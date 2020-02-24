---
title: window.postMessage and IE8, 9
date: "2015-03-14"
published: true
description: Of course older versions of IE and modern web features don't play nice
era: linkedin
changes:
  - 2016-01-12: IE 9 Support has **ended**. That means we can finally just use `window.postMessage` the way it was intended. You can safely discard 99% of this now!
  - 2020-02-21: This article is from the archives of felocity.com. The original unedited post can be found in the [github archives](https://github.com/jakobo/jakobo.github.com). It has recieved a quick once-over to modernize the content where applicable, but may contain references and links to code that is dead, unloved, or may simply no longer apply to modern web development.
---

It started out innocently enough: the LinkedIn Platform needed to run our Professional Plugins on third party sites. To do the basic process of resizing iframes (to fit our plugins), we needed a way to talk across domains. With HTML5, we gained access to postMessage(), which was a nice standard way of talking between domains. For the browsers such as IE6 and IE7, libraries such as [Apache Shindig](http://shindig.apache.org/) and [easyXDM](http://easyxdm.net/) have found a way to use Visual Basic objects (and later Flash) to coerce older browsers into supporting a compatible interface. Internet Explorer 8 and 9, however, have a set of quirks in its window.postMessage() which will frustrate users of home-grown solutions and libraries alike. Inevitably, another developer is going to run into these problems.

## Internet Explorer Recasting Things to “Object”

If you’re using popup windows alongside a cross domain library, you’ll probably be calling methods in window.opener to avoid having to create multiple listeners for the window.postMessage object. While this nuance isn’t postMessage specific, if you’re using an RPC implementation in a library, you can expect your `success()` and `error()` methods to get mangled.

```js
// child window
function childFunction() {}
window.opener.parentFunction(childFunction);

// parent window
function parentFunction(f) {
  alert(typeof f); // object
}
```

To get around this, you can either serialize the function using `toString` or make sure that `parentFunction` doesn’t depend on a `typeof` check. Even though in the `parentWindow` it looks like an object, it will still begin with “function” when serialized. As an added check, you can verify the existence of `call()` and `apply()` before treating it like a callable object. On some level, what Internet Explorer is doing is correct, as Functions are Objects just like everything else. Since the Parent and Child window both have different window objects, their Function objects would also be different.

```js
// Oh IE...
window.opener.Function === Function; // false
```

As of Internet Explorer 9, the typeof operator properly displays the object as Function, implying it’s callable. Therefore, the fix can be localized to IE 6/7/8 using a conditional comment in JavaScript.

## No Communication Across Popup Windows

If you’re adventurous and forgo a library for cross domain communication, do not expect it to talk to popup windows in Internet Explorer 8. The worst part about this is that it’s a [known bug in postMessage](http://blogs.msdn.com/ieinternals/archive/2009/09/16/Bugs-in-IE8-support-for-HTML5-postMessage-sessionStorage-and-localStorage.aspx) for which the current solution is to make an iframe, for which you can then hand off the window.opener assignment. There are two problems with this approach. In order to reach window.opener, the popup window and iframe will need to be on the same domain or set their document.domain property. The second problem is a bit more vexing, as reaching through window.opener triggers the first bug mentioned above. The workarounds are still usable, but if you’re passing anything more complex than a primitive such as a string between windows, you’re sunk.

To be safe, it’s worth wrapping the things in window.postMessage as a string using JSON. If you need to persist objects between windows, giving objects a way to reinstantiate on the other side is really the only option.

## Origin Mismatching

The rules for `postMessage` security are pretty straightforward. When calls are made, the origin is derived from the window object used to initiate the `postMessage` call. The below code highlights the IE8 inconsistency. For whatever reason, reaching through `window.opener` again causes issues, and the domain is changed to the initial script entry point into `postMessage` versus the page where the code actually resides.

```js
// popup window (popup.example.com)
document.domain = “example.com”;
window.opener.postMessageInterface(“string”);

// window that opened the popup (iframe.example.com)
// just contains normal postMessage()
document.domain = “example.com”;
function postMessageInterface(str) {
  window.top.postMessage(str);
}

// On the ultimate listening page, IE8 identifies the origin
// as where the call stack began. Other browsers all identify
// the origin as the domain from which the .postMessage() call
// was made
window.addEventListener(“message”, function receive(evt) {
  // IE 8
  alert(evt.origin); // popup.example.com

  // Every Other Browser
  alert(evt.origin); // iframe.example.com
}, false);
```

The workaround for this is that we can use setTimeout. By putting the intent to call `postMessage` back on the stack, we are able to resolve it with the correct origin.

```js
function postMessageInterface(str) {
  window.setTimeout(function() {
    window.top.postMessage(str);
  }, 0);
}
```

The need to make use of this workaround is even more important if you’re using `document.domain` due to a CDN. Even though it’s been set in the example, the values are ignored for `postMessage` (even though those exact same rules allowed `window.opener` to be reached in the first place).

## How it Works Now

Unfortunately, despite the uptick of the latest Internet Explorers, a good number of users are still stuck with versions before IE10 in which the problems have finally been resolved. To save some headache for these older browsers, you should definitely consider a library like [easyXDM](http://easyxdm.net/) that takes care of these nuances for you.
