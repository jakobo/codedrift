---
id: 263ef58b-264e-46ce-b30f-94ef3c28076e
title: Line Numbers in eval
date: "2015-03-16"
published: true
outdated: true
description: You should never do this. Until you inevitably have to
era: linkedin
category: Code
tags:
  - JavaScript
  - eval
  - debugging
changes:
  - at: "2020-02-24"
    change: Better alternatives than eval finally exist with `await import()` syntax. You should definitely explore those. Additionally, LinkedIn has sunset [Inject](https://github.com/linkedin/inject) on their production site now that many viable alternatives exist. Hoo-ray modern web development!
  - at: "2020-02-21"
    change: This article is from the archives of felocity.com. The original unedited post can be found in the [wayback machine archives](https://web.archive.org/web/20130122001746/http://www.felocity.com/article/executing_a_script_node_using_appendchild). It has recieved a quick once-over to modernize the content where applicable, but may contain references and links to code that is dead, unloved, or may simply no longer apply to modern web development.
---

When it comes to executing code, `eval()` is a [terrible idea](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval). However, somewhere in your coding career, you will need to evaluate code.

And unfortunately, if there's an error in the code, any line numbers are going to point to the invocation of `eval()` and not the erroring line within the body itself. Lucky for us, `<script>` tags correctly report erroring lines with line numbers.

Before we go any further, this is an obligatory **don't use eval**. It should be an option of last resort. Your Content Security Policy is hopefully already preventing you from doing this.

# Trying to not Evaluate: .innerHTML or .text

The first attempt was to set innerHTML to your JavaScript, and then place that node onto the page via appendChild. If you are only concerned with modern non-microsoft browsers, you'd be done at this point.

```js
// ⚠️ Obligatory THIS IS EVAL DO NOT DO THIS
function createScriptNode(code) {
  var scr = document.createElement("script");
  scr.type = "text/javascript";
  scr.innerHTML = code;
  return scr;
}
```

Internet Explorer won't execute the JavaScript inside of this script tag, even though the innerHTML property is set. However, it uniquely [supports the "text" property](<http://msdn.microsoft.com/en-us/library/ie/ms535892(v=vs.85).aspx>), which no other browsers seem to support. When set, scripts in IE will execute once appended to the DOM. A few changes to our above script, and we have a "safe" method. Borrowing from the idea of feature testing for things only IE supports, we'll actually feature test against this text property, falling back to alternate versions as needed.

```js
// ⚠️ Obligatory THIS IS EVAL DO NOT DO THIS
function createScriptNode(code) {
  var scr = document.createElement("script");
  scr.type = "text/javascript";
  try {
    scr.text = code;
  } catch (e) {
    try {
      scr.innerHTML = code;
    } catch (ee) {
      return false;
    }
  }
  return scr;
}
```

# Tying it Together

Further optimizations can be used to pre-select the best insertion method. In [inject](https://github.com/linkedin/inject/blob/68c343180ed3a08dffb0ad445fe45d70908683e1/src/executor.js#L129), we wrap the code we want to execute within a function declaration and assignment. This enables us to store the results of the "eval" so that modules can then be executed on demand. The below example is just a simple JSON evaluator as a proof of concept. Like all things eval, you should always be cautious with invoking `eval()` on items that are not 100% in your control.

> **Note:** With modern build systems, tools such as inject, RequireJS, SystemJS, and other JavaScript loaders are a thing of the past. Bundle your JavaScript with webpack/rollup/parcel and go work on other more challenging problems in your product!

```js
// ⚠️ Obligatory THIS IS EVAL DO NOT DO THIS
var createScriptNode = (function () {
  var testScr = document.createElement("script"),
    property = "innerHTML";
  testScr.type = "text/javascript";
  try {
    testScr.text = ";";
    property = "text";
  } catch (e) {}
  return function (code) {
    var scr = document.createElement("script");
    scr.type = "text/javascript";
    scr[property] = code;
    return scr;
  };
})();

var evalJSON = function (jsonString) {
  var exec = ["window.results =", jsonString],
    node = createScriptNode(exec),
    results;
  document.body.appendChild(node);
  results = window.results;
  delete window["results"];
  return results;
};
```

While this code definitely makes it possible to do more harm than good (we're stepping around JSLint/Hint eval checks), the upside is huge when you're evaluating code and need to understand at what line something is failing on. In the case of a module loading system, having both the upside of eval and the upside of an embedded script tag is a huge win for developers.
