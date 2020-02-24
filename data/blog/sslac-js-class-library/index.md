---
title: Sslac: A JavaScript Class Library
date: "2011-05-03"
published: true
description: A class library that lets you runtime patch methods
era: gaia
changes:
  - 2020-02-23: You have ES6 Classes. You should certainly be using those now! Sslac is also long since retired, though it was in use at LinkedIn for several years because of the need to test fixes and patches for CDN-delivered code on third party sites. Ultimately, this was a lot safer than giving the framework a "switch" flag that could retrieve runtime JS from an arbitrary URL.
  - 2020-02-23: This was rescued from the archives of the old [felocity.com](https://web.archive.org/web/20110507092802/http://felocity.com/article/2011/05/sslac_javascript_class_library) site.
---

The world of JavaScript is rich with ways to bring typical OOP constructs to a highly prototyped language. The world probably doesn't need another library either. Further, it probably doesn't need an entire blog post talking about its features and how it can be used. Nevertheless, the hat is being tossed into the ring. Welcome Sslac, a (somewhat) backward approach to class instantiation in JavaScript.

If you're not keen on the intro documentation, you can [download Sslac from github](https://github.com/jakobo/sslac), view the source, etc.
The Short List (features)

- Natural chaining syntax to define an object
- Compatible with instanceof operators
- Support for superclass methods
- Change definitions of objects after creation
- Support for namespacing and noConflict
- Common JS 1.1 Modules compliant
- Multiple class types (static, instance, and functions)

## A Dual Object Structure

The most important thing to remember in Sslac is that when working from the Sslac chain, you're working on what's internally called the "ObjectRef". This reference isn't the object your code will instantiate, but rather a souped up dictionary with some helpful setters and getters. This syntax allows you to get a method that you've already defined somewhere along the extension chain, and then swap it for something new or patch new code over the old. We'll actually get to that in a bit, but first, the class basics.
Class Basics

For people who have worked with JS class libraries, the syntax should feel familiar. With lowercase versions of the words reserved (static and extends come to mind), Uppercase was used instead. An unexpected benefit of this seems to be that code written is a bit easier to read. For those who have played with Prototype or [Resig's Simple JS Inheritance](https://web.archive.org/web/20110507092802/http://ejohn.org/blog/simple-javascript-inheritance/), the syntax shouldn't feel too unwieldy either.

## Runtime Mixins and Monkeypatching

I hear it's also called "duck punching," which sounds way more cool. One thing Sslac really excels at is the ability to alter code at runtime without modifying the original source code. Much like Prototype's addMethod functionality, these runtime methods cascade into inherited objects. Unlike the other frameworks, however, Sslac provides a set of helper methods to get at the original definitions. To change a method's definition at runtime, you can retrieve the original object's definition, and then swap out a method.

```
// This code sample has gone missing :(
```

In the above, we've enabled the Person object to flip out, and enabled the Ninja object to kill people. Thankfully, only Ninjas (which extend Persons) will be able to [flip out and kill people](https://web.archive.org/web/20110507092802/http://www.realultimatepower.net/index4.htm), but that's the purpose of ninjas anyway. Prototype inheritance means that, by adding the flipOut() method to Person, Ninja will automatically get it. The Person object's probably feeling left out though. And if it's someone else's Person object, you may not want to re-implement their method entirely. This is where that whole "duck punching" concept comes in.

Using `definitionOf()` and `getMethod()`, we can retrieve the original implemented method and call it using the old school `apply()` method, passing the current object along with the arguments array.

## In the Real World

Perhaps the most compelling real-world use case for Sslac comes from development at LinkedIn. With our current framework deployed on high profile sites, we can take a bug we want to fix, write the patch, and then use a tool like Greasemonkey to add our own custom code on top. Bugs can be verified, partner implementations can be tested to ensure there are no regressions, all without either us or the end user developers having to change production code. This provides an invaluable mechanism, allowing code changes to be verified out in the wild, on live sites, without impacting any end user experience. If nothing else, the monkeypatching alone has made the 2k library (minified, pre gzip) well worth its cost.

[Sslac on Github](https://github.com/jakobo/sslac)
