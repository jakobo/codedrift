---
id: 891b8ec4-8722-48c4-9a77-28f5b1bdc80f
title: Just In Time JavaScript
date: "2007-11-27"
published: true
outdated: true
description: Chained CSS and JavaScrit loading
era: gaia
category: Code
tags:
  - JavaScript
  - CSS
  - Lazy Loading
changes:
  - at: "2020-02-23"
    change: Thank goodness for modern environments. Webpack, etc definitely make the techniques in this article obsolete. And we've also solved [non-blocking CSS](https://keithclark.co.uk/articles/loading-css-without-blocking-render/) pretty consistently too!
  - at: "2020-02-23"
    change: This was rescued from the archives of the old [felocity.org](https://web.archive.org/web/20071118102059/http://www.felocity.org/blog/article/javascripts_strange_threaded_nature/) site.
---

Web apps are heavy, and wait times suck. For every interaction you build, there's that much more code being added to the project. Eventually, it's going to be too much for the user to handle, especially if they are on dialup or slow DSL (though I suppose even an iPhone on EDGE would qualify). For example, the Cash Shop we just launched at Gaia weighed in at over 400k (~100k gzip compressed and minified). While we're a graphic heavy site, waiting for an additional 100k was needlessly painful. To boot, _there was no promise the user was even going to use that feature_, making loading all that JavaScript and CSS a really silly exercise. We needed a way to load the JS and CSS on the fly across all browsers.

Getting the JIT Loader

The most recent version (1.0.0) can be downloaded here:

- [Get the most recent JIT Loader](https://gist.github.com/Jakobo/7a5aec5fcebc8f4886193b114c9ec4f0) (23k)
- [Get the most recent JIT Loader - min + packed](https://gist.github.com/Jakobo/7a5aec5fcebc8f4886193b114c9ec4f0) (5.6k)

The locking utility is also included, but if Lock exists, it won't be used. Enough thanks can't go to Ryan Grove for the original [Lazy Load](https://web.archive.org/web/20071215020306/http://wonko.com/article/527) utility. The JIT loader, like LazyLoad is released under the New BSD License.

# Putting off Loading the CSS and JavaScript

The method of loading we are specifically looking at is known as "event based loading" or "lazy loading". While the [wikipedia article on lazy loading](https://web.archive.org/web/20071215020306/http://en.wikipedia.org/wiki/Lazy_loading) is not very detailed, the summary of the article is that lazy loading allows us to wait on loading stuff until we need it. In computer science, usually the discussion revolves around expensive objects or data calls. In our case, it's all about the browser load time. There's little reason to put JavaScript or CSS into the head of a document unless we know it is 100% needed for the page. We want to put off the expensive http connection and download as long as possible.

A very practical example (and one already out there) is to defer the loading of images until they are within the viewport. Both the [JQuery Lazy Load Plugin](https://web.archive.org/web/20071215020306/http://www.appelsiini.net/projects/lazyload) and the [YUI Image Loader](https://web.archive.org/web/20071215020306/http://developer.yahoo.com/yui/imageloader/) do exactly this, reducing load times on pages by holding out on pulling down images until you need them. For these examples, scrolling the page (and moving a placeholder into the viewport) is an event that triggers the load. If this has proven successful for images and content, there's no reason this can't be applied to scripts and CSS as well.

# Loading JavaScript In Existing Frameworks

To a certain extent, Dojo and YUI have both built in a loading system for including packages before executing script. They are the [dojo.require()](https://web.archive.org/web/20071215020306/http://dojotoolkit.org/book/dojo-book-0-9/part-3-programmatic-dijit-and-dojo/functions-used-everywhere/dojo-require) directive and the [YUI Loader Utility](https://web.archive.org/web/20071215020306/http://developer.yahoo.com/yui/yuiloader/) respectively. These two were specifically called out because their methods of including requested files are so different.

In the case of Dojo, an XMLHttpRequest (XHR) is made to load the JavaScript package, and then is ran through `eval()` to convert the request into functional code. This lets Dojo use a package style syntax similar to Java for including libraries to run. Each call to `require()` is synchronous and blocks, meaning you can trust a directive to fully complete before getting into your code. This method is highly effective for lazily loading a package since Dojo is clever enough to not include something twice. The crutch though is the XMLHttpRequest, which is subject to any cross site scripting issues. (Note: AOL has managed to do a custom Dojo build with XHR support across domains and the process is pretty well documented, but it is not the default behavior.)

On the other end of the spectrum, the folks at Yahoo! have taken a different approach, writing to the DOM directly using the `<script>` tag. This eliminates the cross browser issues that Dojo grapples with, but trades it for the limitations of inline script writing exposing the DOM to Internet Explorer in a state when it's not "complete" in IE's mind, resulting in the dreaded Operation Aborted error. In order to use the loader, there's also a lot that needs to be done if custom modules are going to be used. (As of this writing, the YUI Loader constructor does not take the config object, so it's hard to dynamically add to the object without using `YAHOO.lang.augment()`.)

Ryan Grove built a library independent utility for including scripts, similar to YUI, called [Lazy Load](https://web.archive.org/web/20071215020306/http://wonko.com/article/527). It was a good strong start, and needed a steroid boost to provide the CSS support and streamlined DOM writing. Because the API was radically changed, the name was changed as well.

# Just In Time Loader (JIT Loader) Basics

In most situations, the behavior we are looking for is "on event X, load this, then load this, then load this, then execute Function X". To provide access to this streamlined interface, `JIT.startChain()` was created. Calling `startChain()` returns a method-chaining object that you can use to build up a series of Javascript and CSS includes. The following methods are available on the object returned from the `startChain()` call.

- `addCss(urls, verifier, ie_version)`: adds a CSS File (or array of CSS files) to the execution stack. It will continue when `verifier` returns true. By default, all verifiers simply make sure the nodes have been written to the DOM, not that they have been processed internally. In the case of CSS, you can specify a specific IE version you want to apply this CSS to in order to keep your CSS files clean.
- `load(urls, verifier)`: adds a JavaScript file to the execution stack
- `loadOnce(urls, verifier)`: adds a JavaScript file to the execution stack. When fired, if the URL has already been added by another JIT load or an external source, it won't be loaded again.
- `onComplete(fn, obj, scope)`: Starts the execution chain. When the execution chain has completed, `fn` will be ran. If `obj` is suppled, it will be passed as an argument. If `scope` is true, `fn` will instead be directly ran in the context of `obj`.

The most primitive example of chaining would then look something like:

```js
JIT.startChain()
  .loadOnce(jsfile, function () {
    /* verifier */
  })
  .addCSS(cssfile)
  .onComplete(function () {
    // run this when everything is loaded
  });
```

If chaining is not your thing, you can also make direct calls to the JIT object (see examples at the end). After the verifier, each of the above calls takes a callback function, object, and scope; the `onComplete()` doesn't exist in the root JIT object and is used solely for the purposes of chaining. These are left available in case more advanced functionality is required.

# Optimizations

Because JavaScript is (mostly) single threaded, if there are multiple calls to the Lazy Loader, we shouldn't wait on the current code execution block to write to the DOM and clean up when it is finished. The original Lazy Load used a queue system that let multiple calls stack as pending, even if they were for different load requests. The smallest synchronous operation is the DOM write, which can be pushed out to a method and can be locked using a [spinlock](/archives/threading-in-javascript) to emulate fake threads. Any events that get queued up between DOM writes can be added to the stack, and can then execute while slow scripts take a while. This speedup is surprisingly most noticeable on Internet Explorer, where events are allowed to interrupt the current JavaScript thread, to write more concurrent nodes into the DOM.

# Limitations

The verifier function that is passed in is the linchpin of the event based loading. When the verifier resolves to `true`, the loading process continues with the assigned callback. When working with CSS, this is exceptionally difficult. There are two options when dealing with event loading the CSS files, either find a testable property in the CSS, or pass in `null` for the verifier slot, and load the CSS first. While the first offers more reliability, the second tends to be more practical, since the CSS won't usually apply to anything other than nodes created by the JavaScript. A simple example of a CSS verifier would be (assuming your CSS sets the body's background image to the below mentioned URL:

```js
var verifier = function () {
  return (document &&
  document.body &&
  document.body.backgroundImage = "http://example.com/load_complete.gif")
    ? true
    : false;
};
```

The second major limitation of the system is in `loadOnce()` which requires script nodes to exist in the DOM to test if they have been properly loaded. This testing method makes it incompatible with the dojo.require() directive which uses the XHR to perform script includes. In the future, the verifier check might be ran once to preemptively test for component loading, but that will cause issues with testing in the `YAHOO` namespace.

# Enough Already, Examples Please!

You can see JIT in use on the website [Gaia Online](https://web.archive.org/web/20071215020306/http://www.gaiaonline.com/) for the Cash Shop (under the market submenu) and eventually in place for the world map and other header-based events.
