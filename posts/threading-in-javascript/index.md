---
id: 91b2dfc9-a28c-4f99-8378-140a19744950
title: JavaScript Threading
date: "2007-11-08"
published: true
outdated: true
description: Not Everything Adhears to JavaScript's Semi-Single-Threaded Model
era: gaia
category: Code
tags:
  - JavaScript
  - Events
changes:
  - at: "2020-02-23"
    change: When this article was rescued from the archive, I retested the example page. Safari and Firefox both handle this behavior correctly. So `prompt`, `confirm`, and `alert` away without running into stuff running weirdly in the background.
  - at: "2020-02-22"
    change: This was rescued from the archives of the old [felocity.org](https://web.archive.org/web/20071118102059/http://www.felocity.org/blog/article/javascripts_strange_threaded_nature/) site.
---

There's a lot of digging required to figure out if Javascript is single or multi-threaded, and for every article out there, at least three contradict it. Thanks to the work Dan Simard in June, [a final answer on Javascript threads](https://web.archive.org/web/20071118102059/http://www.javascriptkata.com/2007/06/12/ajax-javascript-and-threads-the-final-truth/) was reached. The only major problem in this was that the comments by a user to Simard's post indicated that `alert()` caused Firefox's execution chain to change. The result was while the prompt was on screen, `setTimeout()` and other assorted callback functions were free to resolve.

The problem is made worse with several `setTimeout()` calls. As a single thread, JavaScript maintains some sort of event stack, where all of the callbacks and timeouts pile up, waiting for their turn. Once the event stack is out of events, the timers start again to count down to execution. If you fire one call with a `setTimeout()` and a timeout value of 2 seconds, and one more second of code execution follows, there will still be 2 seconds on the timer since it has not had a chance to run.

```js
var foo_count = 0;
var bar_count = 0;
var foo = function () {
  ++foo_count;
  window.setTimeout(bar, 5);
};
var bar = function () {
  ++bar_count;
  alert("foo=" + foo_count + ", bar=" + bar_count);
};

// triggers
window.setTimeout(foo, 10);
window.setTimeout(bar, 20);
// end triggers
```

In a perfectly timed environment (running just this code), `foo` will execute, followed by `bar`, followed by `foo`'s call to `bar`. In reality, the ms calibration for this is iffy. The output comes out as `foo=1`, `bar=2` then `foo=1`, `bar=1`. However, simply looking at the timing values, our alert calls should be reversed. We've entered the world of volatile variables and shared space without even knowing (and probably not even wanting). Under the hood, it appears that making a call to `alert()`, `prompt()`, `confirm()`, or any other window level call pauses the current thread's execution, letting any pending `setTimeout()` calls resolve. When the execution returns from the window event, variables that were scoped one block higher could have changed without the knowledge of the current execution block.

A more practical example of this can be found on the [Threadsafe JS Example Page](/images/posts/threading-in-javascript/test-page.html). As of this writing, IE and Opera execute things properly in order, waiting for the `prompt()` to finish before continuing the current code block, and after completion, letting the pending `setTimeout()` event fire. In Firefox and Safari, during the `prompt()` call, the `setTimeout()` executes, overwriting the value of `bar`.

# Protecting A Volatile Bar

As mentioned before, when the browser's JS Interpreter hands off to the `alert()`, it begins resolving any waiting `setTimeout()` calls that in in the event queue. In our example, another call to `bar()` is waiting which also increments bar_count. By the time we alert `bar_count`, something has gone and changed it. This seems to also hold true for `prompt()` and `confirm()` in Firefox and a few other browsers.

Imagine instead of just our primitive `window.setTimeout()` we were using an AJAX callback which waited for a DOM node to be available. The costs of this shared variable space being violated is a bit more costly. In many other languages, there are Mutexes for the synchronized calls, and the volatile declarative to avoid problems. Because the implementation of ECMAScript is unique to each browser, there needs to be a consistent way to secure data from tampering during the application's critical moments.

At our disposal is the following JavaScript knowledge:

- `new Object()` is atomic (can't be interrupted by browser events)
- `return (new Object() === new Object());` is always false as each new object is given a unique ID by the system. We need a way to atomically create an ID for a fake thread.
- `Array.push()` is atomic (can't be interrupted by browser events) as long as we are using the native implementation. This non blocking implementation means even if two events get in the way of each other, only one will hold index[0] in the final array
- `(function() { new Object(); })();` is garbage collected properly
- block scope level variables cannot be changed by outside factors

That doesn't leave us with much. [Ming made a post on JS Mutexes](https://web.archive.org/web/20071118102059/http://my2iu.blogspot.com/2006/10/javascript-mutexes-2.html) though that got the ideas flowing. The biggest concern from Ming's entries was that in Internet Explorer, events such as `onload` can interrupt a process, creating multiple events at the same time. To get around this, we would need a method which the browser cannot interrupt. This is where the native `Array.push()` comes in handy. For some reason, IE treats this call as non-interruptable, letting us have a queue process that ensures element 0 is the first lock requester. If we have two atomic commands, one to uniquely identify a lock request and another to enqueue the lock, then we have everything we need for a very basic spinlock implementation. Even if a second event interrupts our two statements, the pushing onto the array guarantees only one of the two requests will be given rights to the lock.

Spinlock design implies a "busy wait" cycle for getting the lock, meaning each individual thread usually sits in the equivalent of `while(1) {}`. Because we don't have threads and instead have the event queue, a while loop would seize the system. To get around this, we can use the same `setTimeout()` call that was the source of our problem to "sleep" an event until the lock resource is available. The result is a very lazy locking method that requires the application to care about the lock (but a lock that can be used in many different ways). Our pseudo code looks like:

```
sub process
    lock = get lock
    if not lock owner
        retry sub process in N ms (sleep)
        return

    lock was obtained
    perform critical code
    release lock

    non critical segment here
end process
```

Return to the [Threadsafe Test](/images/posts/threading-in-javascript/test-page.html) and try the protected version. Across all browsers, the lock is held until the process has properly completed.

# Beyond Locking Down Variables

A locking system like this can be extended to deal with more than just the Javascript Variables. In the case of lazy loading javascript, it is possible to be using the same utility to load several "sets" of Javascript at the same time. To avoid keeping the document.head open (and risking Operation Aborted problems), we use the same locking strategy to keep a DOM node from getting written to until Internet Explorer reports it as closed, such as an onreadystate for a script tags.

The locking utility can also be used to create "run once" functions such as an `init()` for a class outside of its constructor. The class can simply request the lock, and on completion, refuse to release it. While this takes up a small bit of memory in the lock utility, it also guarantees only one `init()` reaches the critical section for the life of the page.

# Limitations

Building such a locking system in JavaScript is not without drawbacks. The most notable of these is the lack of support for browsers which do not support `Array.push()`. If this browser needs to be supported, there's not much that can be done via this method, or you can simply take your chances and code with very clear and isolated callbacks and timeouts.

It's also unknown just how atomic the methods are. While in brief tests in Rhino this appears to be atomic during the critical push step, there's no guarantee that it is actually going to be atomic if the browser makers create true Multi-Threaded JavaScript. Hopefully by then, there will also be the volatile keyword.
