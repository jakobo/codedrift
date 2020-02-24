---
title: Making it Transaction Anything (in PHP)
date: "2006-04-13"
published: true
description: Gaia's original "transaction manager" explained
era: gaia
changes:
  - 2020-02-23: This was rescued from the archives of the old [felocity.org](https://web.archive.org/web/20060618103250/http://www.felocity.org/) site.
---

Everything is on track for SXSWi (Visit the SXSWi Web Site) this year, and excited isn’t even a good word for how I feel right now. It’s 4 am [Ed. Now it is noon the following day…] and I’m downright giddy. Last year I blew my first chance to go because I didn’t move fast enough. This year, I jumped for it and managed to grab a room at the Hilton Austin. In on the 10th and out on the 14th, and if I didn’t have some larger projects, I’d be staying much longer. To those going, I’ll see you there (just look for the kid who looks like an excited lost puppy). However, if you notice the title, this isn’t about SXSWi entirely, but instead is focused much more on some meaty PHP things: transactions. For the new bank code at Gaia, there needed to be a way to move items and gold about the site through a standardized (and [5 nines” reliability) system. Add to that full logging in the event of failure, and the ability to “transact” just about any two things on the site, and you get the foundation of the transaction system. This is part one of a multi-part article which will touch on the surface and theories used in the transactions framework. (Part 2 will focus more or architecture, and Part 3 implementation, reflection, and whatever pseudo-code can be shared).

When the project first began, transactions were an odd concept. Not like database transactions, but a sequence of events that were atomically linked and reversible. Examples included purchasing from the Gaia Store (give the system gold, the system gives an item), making a trade (place an item into an “escrow” neutral zone), auctioning off an item (again, an escrow style neutral zone), purchasing non-pixels such as a Trading Pass or a Guild Purchase where the result is a database row but no items or gold, and many other things that went beyond the basic “remove gold, add item” mentality. This meant it was time for some research into complex data analysis models. Enter Martin Fowler, whose books I had read back in college, but like most college students made a point of forgetting. Thankfully, John had Analysis Patterns which was all we needed to get underway. I’m going to digress for a moment to say Fowler is a very intelligent man, but I remember why I couldn’t remember what he wrote- Fowler has a hard time communicating why a pattern works the way it does. If you’re someone who needs to know the [why”, you might have to suck it up like I had to. After going cover to cover, it appeared there was a very basic system underneath even the most complex banking systems. To abridge the text, we started referring to it as the Conceptual Account Thingy (or CAT for short).

## Accounts, Entries, and All That Jazz

Keeping with our simplified version of things, an Account was described as nothing more than a container. This container could hold things, and those things belong to some entity. As an added bonus, [Gaia’s “DAO](http://72squared.com/index.php/module/Articles/action/Display/id/37) information was also stored with the Account in order to provide a means to get out and save data when needed. Accounts were then abstracted and an Account class was created for the “things” on Gaia that were owned by “someone”. The initial list included:

1. Gold (owned by user)
2. Inventory (owned by user)
3. Trade (owned by the trade row)

The third one is actually very interesting because a Trade became what was called a “Summary Account” in that it contained two Accounts inside of it, a left half and a right half. The left half was owned by the trade row and by the left user, while the right half was owned by the trade row and the right user. Because of this, the only entity that owns the entire trade is the trade row itself. When retrieving Accounts, they are always fetched by their owner which is often a primary key. This ensures speed of performance during the Account loading process. With a means to load and save the data, the next step is to manipulate it.

According to Fowler, the Entry class is nothing more than an entry that will be logged to an Account. Think of recording a check in the checkbook’s ledger. This process is formally called Posting an entry, but for practical purposes, entries are applied to an Account, and then the changed Account is saved back to the database. To soften the load on PHP, the entries became lightweight containers of metadata which provided little more than a pretty interface for method calls. A simplified version of an Entry looked like: (note, “Container” is nothing more than an abstracted hash table in order to provide useful namespacing functionality. In this case, the datatypecontainer enforces typecasing on items going in and coming out of it.)

```php
<?PHP
/**
* Required Include Files
*/
require_once(DIR_CLASSES . ‘container/datatypecontainer.php’);

class TransactionEntry
{
    function TransactionEntry()
    {
        $this->Container = new DataTypeContainer();
    }
    function importData($data) {}

    function exportData($preserveId = true) {}

    function setEntryId($v) {}
    function getEntryId() {}

    function setTransactionId($v) {}
    function getTransactionId() {}

    function setEntityId($v) {}
    function getEntityId() {}

    function setAccountType($v) {}
    function getAccountType() {}

    function setObjectId($v) {}
    function getObjectId() {}

    function setAttribute($v) {}
    function getAttribute() {}

    function setAsAdd() {}
    function setAsSubtract() {}
    function setPolarity($v) {}
    function getPolarity() {}

    function setTimestamp($v) {}
    function getTimestamp() {}

    function setStatus($v) {}
    function getStatus() {}

    function cloneInverse()
    {
        $obj = new TransactionEntry();
        $data = $this-&gt;exportData(false);
        $data[“polarity”] = $data[“polarity”] * -1;
        $obj-&gt;importData($data);
        return $obj;
    }
}

?>
```

I left the cloneInverse statement because it was of particular note. From above, it was said that everything done to an Account needs to be able to be undone. The secret to this is being able to “reverse” all of the entries that have been applied to a transaction, and then reapply them. The net result of this will always be the Account’s original state. In extensions of this Entry object, decoration aliases are used such as `setUserId()` in order to simplify the application programmers’ work. With entries, and things to apply those entries to, the next step is to set up the rules.

## Posting Rules

When the transaction manager hands an entry to an Account, it is the Account’s responsibility to take that entry and apply it. For different Accounts, applying an entry means different things. Inventory Accounts (owned by a user) are by far the hardest with their need to add/remove binary strings. An Account can always look at the class of an Entry object if that Account supports multiple types of entries. At present, since the inventories on Gaia (housing, main, game inventory, etc) are separated, there is no need to develop sophisticated entry handling. Fowler gets into extreme detail about Posting Rules and covers more than is needed by this system. However, the basics of how to apply a rule and what happens when applying an entry to an Account need to still be established. It was agreed upon that should a posting rule fail, it will fail all future objects in the posting rule change, and triggering a rollback of the transaction by taking the `cloneInverse()` of each Entry and reapplying them.

![Using "clone inverse" to create consistent transactions](/static/thoughts/gaias-original-transaction-manager/asynchronous_model.png)

Every Account then has a public `postEntry()` method, which takes an Entry object as an argument. Using the generic accessor functions from the base TransactionEntry Object, the Account can apply the Object ID, Attribute, and Polarity to their entry. Each call to `postEntry()` returns `TRUE` on rule posting success. All that remains is to tackle the fact that the web (and the Accounts) are constantly in use. Collisions can occur when a second transaction manager is started while the first one is still in process. Since the first transaction hasn’t saved, the second process has dirty stale old data.

Fowler presents two methods of avoiding collision, both which are worth touching on briefly. Milage varies with either one.

## Posting Rules With “Catchup”

Of the two methods Fowler discussed, journaling is by far the most widely employed. To draw a real-life analogy, it functions much like a checkbook register. At any given point, a quick glance through the register can tell someone what the “balance” is, including all transactions which haven’t cleared. Much like processing checks out of order, an Account can be measured by taking its present state, and then applying all deduction Entry objects which have not cleared yet. This gives the transaction manager the net low for the account, making it possible for the system to check for insufficient funds, missing items, and incomplete database rows. In a set of linear steps in PHP/MySQL, you might get something like the following:

1. Process 1 writes what it wants to do (status uncleared) to the DB
2. Process 1 gets an insert ID as a result of this
3. Process 1 loads the Account
4. Process 1 loads all deducting transactions up to its insert ID on top of the Account
5. Process 2 can start, and at any point after #1, its Net Account will include all of Process 1’s unresolved deductions.

While this is a very reliable system, the need to constantly bring an Account to current isn’t a very cheap process query wise. Also, every system needs to implement this transaction system so that a blind write to someone’s inventory isn’t destroyed in the process. Since the Vending system, Shopping system, Item Granting System (used in games) all would not start equipped with this transaction manager, it was not meant to be. If you’re starting from scratch, this is certainly the way to go. If not, well, you can always improvise.

## Improvising with innoDB Locking

The problem was, as stated above, the asynchronous nature of Account objects. Lacking the ability to journal the transactions, the other solution to an Asynchronous problem is to break it. By redefining the Accounts to be as small a data set as possible and introducing a simple retry. The most likely collision on the site is the Gold Account, which would require a user to earn gold on the site within the same timeframe as say, completing a Marketplace Transaction. Marketplace can see the lock, wait a split second, and try again. The resulting failing collision rate is so low that it’s considered acceptable to have a user retry in the event of a complete lockout.

I’ve made mention a few times to locking, and this is done with two tools: innoDB and the MySQL `SELECT...FOR UPDATE` syntax. We’ve made liberal use of the innoDB storage engine for it’s transaction support, and according to MySQL, using the `SELECT...FOR UPDATE` syntax places a good lock on the innoDB row, letting the process finish what it was doing. If during the select phase some database row it needs is locked, it reseeds at a small random interval and performs its work on a retry. When complete, the transaction is committed and the changes recorded.

For spanning multiple databases with a single transaction, John developed a DB spanning object for the DAO he developed. It chains commits to fire off in sequence, effectively minimizing the failing window gap. Half commits are still a problem should for example, all the servers magically lose power and they are mid-commit. Unfortunately, this is a failing of the improvisation that can only be solved with a true multi-phase commit. In production testing, it’s failure rate is wholly dependent on the hardware’s reliability. While this has a low failing rate, it is substantial enough to warrant exploring extensions to the DAO’s DB-spanning system.

## Conclusions

The system is currently in testing with a very good success rate. There are a few tweaks needed to optimize the system of Account and Entry objects in order to reduce weight when including them for processing. I’d also like to better explore the DAO’s integration into the Account object- the current method alters the conceptual DAO behavior in order to solve a problem where more than one Account object may be tied to the same database row. More on that next time though.
