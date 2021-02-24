---
id: 7526ad84-351d-433c-a9a2-7d84cc70b801
title: AJAX Prototype Scope
date: "2006-04-13"
published: true
outdated: true
description: Avoiding AJAX Scope Issues in Prototype
era: gaia
category: Code
tags:
  - JavaScript
  - protoype.js
  - APIs
changes:
  - at: "2020-02-23"
    change: This was rescued from the archives of the old [felocity.org](https://web.archive.org/web/20060426013445/http://www.felocity.org/) site.
---

I haven't seen this covered much, but I really felt it was worth a mention. A lot of people have worked with the [prototype library](https://web.archive.org/web/20060426013445/http://prototype.conio.net/), including myself. One of the most challenging things I've had to do was create an object that could make an AJAX request, and then internalize the response. Calling a function out on the global scope is messy and in poor taste if you can avoid it. I thought back to my Java classes, and remember an almost reflexive style of programming. About an hour later (including reading through prototype's source) I had a working model.

The major players in this design are the `XMLHttpCatch` object and the `Ajax.Request` object. Our goal is to call a sending function inside of an instance of `myObj`, and then have the response be ran in the context of `myObj`. By default, you cannot refer to "this" inside of the callback, because of scope issues. The solution is to encapsulate the request, and then have a way for the response to find its way back home. We do this by passing the scope down into the `XMLHttpCatch` object.

Hopefully other people will find this useful, as occasionally it is not practical to have globally scoped functions for onComplete, and you want access to all the proper `this.methodName()` calls. I thought about moving the catch object into myObj as a function definition during initialize, but the current model is a bit more reusable.

```js
Abstract.XMLHttpCatch = Class.create();
Abstract.XMLHttpCatch.prototype = {
  initialize: function (opts) {},
  receive: function (response, scope) {
    scope.receive(response);
  },
};

Abstract.myObj = Class.create();
Abstract.myObj.prototype = {
  initialize: function (opts) {
    for (var prop in opts) {
      this[prop] = opts[prop];
    }
    this.XMLHttpCatch = new Abstract.XMLHttpCatch();
  },

  receive: function (response) {
    this.response = response.responseText;
    alert("Response Text: " + this.response);
  },

  send: function () {
    // get a local name for our catch object
    XMLHttpCatch = this.XMLHttpCatch;

    // get a local name for "this" (what we want to run the response under)
    scope = this;

    // prototype does the rest
    ajax = new Ajax.Request(
      "http://www.myurl.com/path/to/my.php", // URL
      {
        // options
        method: "get",
        onComplete: function (resp) {
          XMLHttpCatch.receive(resp, scope);
        },
      }
    );
  },
};

example = new Abstract.myObj();
example.send();
```
