---
id: 1a06bd53-8850-41e1-9817-9559e3d93d38
title: Transactions, Part 2
date: "2006-10-02"
published: true
description: Gaia's original "transaction manager" explained
era: gaia
category: Code
tags:
  - PHP
  - MySQL
changes:
  - at: "2020-02-23"
    change: This was rescued from the archives of the old [felocity.org](https://web.archive.org/web/20070112140348/http://www.felocity.org/blog/article/php_transaction_manager_architecture/) site.
---

> Note: This article was written under the guise of PHP 4, which lacks a lot of object related functionality that would be beneficial to the development of the code used in these examples.

It's been a while since I've touched on the topic, mostly because I've been busy with work for Gaia. However, this incubation period has let the transaction system mature, and it continues to hold out well with over 29 million completed transactions in the last 7 months. Since its inception, it's been adjusted to support item granting, and is currently being extended to support transactions in the Gaia Marketplace / Auction House. In the first article, I covered the surface of the transaction manager, and some of Fowler's theories which were behind it. In order to avoid recoding large parts of the site, a lock-first mentality was chosen for how to handle keeping an account up to date. This time, we're going to focus on all the players / classes of the transaction manager and how they work together.

As in most programming languages, PHP provides support for both public and private methods within a class. In development, one of the primary objectives was to minimize the external facing interface for the end-developer, while still keeping the backend components easy for a developer to maintain. Each component was given specific tasks, responsibilities, and a list of classes that it would couple with in order to provide functionality.

# Bank Transaction Manager

The first component is the first of three end-developer facing classes. The Bank Transaction Manager is responsible for creating Transaction Entries, adding Transaction Entries to its internal stack, and then processing the entry stack while reporting on the success or failure of the process. When a Bank Transaction Manager is initialized, it creates an Account Manager object for tracking the accounts which it needs to load. As entries are created with the `createEntry()` method, they are fed to the end developer and then added back in to the system via `addEntry()`.

A Transaction Entry is nothing more than a shell object, providing a clean interface for setting an object's ID, it's attribute, quantity, and other associated properties. When `addentry()` is called, the Bank Transaction Manager uses these properties in order to decide what Account to load (via the Account Manager). This pairing is then set aside until execution.

During the execution phase, the Bank Transaction Manager tells the Account Manager to initialize all relevant accounts. It then loops through every entry/account pair and passes the entry into the account. In processing terms, these are called posting rules. Every posting rule has a boolean success, and the sum of all functions returning an ultimate success or failure for `execute()`.

If any errors are encountered, the Bank Transaction Error (a simple static class) is written to with information about the failure.

# Account Manager

In a horizontally scaled environment, a user's inventory or a row of trading information might reside on completely separate machines. To encapsulate the loading and saving of these various things is the reason for the Account Manager object. Requested accounts are queued up, and then loaded via a single call to loadAccounts(). Beyond simply loading accounts, the account manager should be able to

- handle information if the account has changed
- prevent data overlap by avoiding querying for duplicate data
- provide an interface for the instantiation of new Account objects

During the execution of the Bank Transaction Manager, the Account Manager is called (specifically when `BankTransactionManager::addEntry()` is used). Accounts are queued for loading as entries are added, and are then loaded at once. There are two ways to load the account data, one which uses blocking, and one which does not. Even at 4.5 million registered members, the blocking method has not been an issue, and so that is the method we'll be talking about. In an InnoDB database, a row can be locked during the select phase as part of a transaction by using the following syntax:

```sql
SELECT 'columns' FROM 'table' WHERE 'criteria' FOR UPDATE;
```

The `FOR UPDATE` places a lock on the row, leaving your PHP script as the only script that has access until the lock expires. This feature is only available on InnoDB however, as the MyISAM engine supports neither row locking nor transactions.

When asked to save, the AccountManager calls the `isChanged()` method on every account in order to verify if it has been altered. Accounts which have been altered are then saved back to the database and the locks released.

# Transaction Entry

There's not much to say about the TransactionEntry object. As a shell, all it contains is a data payload. It's information consists of: "how many", "of what", "with what serial", and "adding or subtracting". To help simplify the development end, the Entry object is extended to support Game items, Regular Items, Gold, and Gift Credits. During execution, these small instruction sets are passed to the Account object.

# Account

Defined as the authoritative source regarding all data coming in and going out, these objects are modeled in spirit after the VO J2EE pattern. They exist to hold an account's data, and are decorated with methods to support the changing of that data. When the Account Manager calls `loadAccounts()`, every queued account object is asked for its database information and required fields. The sum of this data is aggregated, and passed into the `importData($fieldName, $data)` function. When the Bank Transaction Manager executes, it then takes every Transaction Entry object, and passes it directly into `postEntry($t)`. It is at this point that the heavy lifting is actually done.

Every account maintains a ruleset for how its data is to be altered, known as "posting rules". These rules are very strict, and breaking them should cause the entire transaction to fail for the user and return an error. The most common example of failure is if the posting rule contains an item type that the account does not support, such as posting gold information to an inventory account. With a single public interface, the logic of altering the account information is also internalized, protecting it from the outside world. Upon altering the account, `postEntry()` will return either `TRUE` or `FALSE`, which will be evaluated by the Bank Transaction Manager object.

Adding new accounts or extending existing accounts to add functionality is very easy. The methods exposed publicly are small, specifically `getDaoName()` and `getDaoFields()` for Gaia's database support, `importData()` for loading, `exportAccount()` for saving, `isChanged()` for the Account Manager's save required check, and `postEntry()` for altering the account's data.

# Code in Practice (End Developer Side)

For as complicated as this all seems, the code which ends up facing the developer is only the Bank Transaction Manager and Transaction Entry's public methods. The Account Manager and Account exist outside of the end-developer's scope, unless they are building in support for additional account types.

```php
$btm = new BankTransactionManager($transaction);

// create entry (Account, Entry Type)
$e = $btm->createEntry("Gold.Gold");
$e->setUserId($user_id);
$e->addGold($gold_amount);
$btm->addEntry($e);

$e = $btm->createEntry("ServerGold.Gold");
$e->setUserId(ENTITY_SERVER);
$e->subtractGold($gold_amount);
$btm->addEntry($e);

try {
    $btm->execute();
}
catch (Exception $e) {
    throw $e;
}
```
