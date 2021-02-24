---
id: 033fd339-b82f-41b0-95b5-b105a8ea9666
title: Enhancing for Bugs
date: "2015-03-14"
published: true
outdated: true
description: 'Sometimes, instead of feature detection, you can get away with "bug detection"'
era: linkedin
category: Code
tags:
  - JavaScript
  - IE6
changes:
  - at: "2020-02-21"
    change: This article is from the archives of felocity.com. The original unedited post can be found in the [github archives](https://github.com/jakobo/jakobo.github.com). It has recieved a quick once-over to modernize the content where applicable, but may contain references and links to code that is dead, unloved, or may simply no longer apply to modern web development.
---

In the days of Internet Explorer 6, it was common to lament the problems of the browser nobody wanted to support. Some of the bugs that developers have uncovered are well documented, some of them not. This falls more into the later camp. It's fix, while trivial, serves as a great reminder about how to build software that works in every browser.

Let's get the basics out of the way first. In every browser on the planet (except IE6), it is possible to create a checkbox in IE6 that is by default selected using everyday JavaScript.

```js
var cb = document.createElement("input");
cb.type = "checkbox";
cb.checked = true;
```

The above code would render the checkbox once you append the checkbox to the DOM, but no matter how one tries, the box won't actually start in the checked state. While it's technically possible to [sniff IE6 using conditional comments](http://dean.edwards.name/weblog/2006/11/sandbox/) and react accordingly, trying to detect a browser based on its signature will always be a poor choice and a last resort.

Internet Explorer's documentation on document.createElement shows that before IE9, it was possible to render an element using the angle brackets, < and > respectively. When rendering out an entire tag with angle brackets, IE6 properly sets the "checked" property. Since standards compliant browsers don't allow angle brackets, we can start with a non-standard solution, falling back to the W3C method on failure.

```js
// IE6 requires a checkbox to be made differently
try {
  var cb = document.createElement('<input type="checkbox" checked>');
} catch (e) {
  var cb = document.createElement("input");
  cb.type = "checkbox";
  cb.checked = true;
}
```

By applying the philosophy of feature detection to something that is (by all accounts) a bug, we can keep true to our development principals in the browser.
