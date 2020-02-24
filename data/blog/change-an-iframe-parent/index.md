---
title: Change an iframe Parent Without Reload
date: "2015-03-17"
published: true
description: Moving an iframe around on the DOM can trigger reloads. Can something be done about it?
era: linkedin
changes:
  - 2017-10-04: It’s been noted in [comments](https://medium.com/@mbogdan/even-in-webkit-support-for-the-so-called-magic-iframe-has-been-removed-882a27d1bf15) and confirmed that the reparenting with `adoptNode()` no longer works and will instead cause the iframe to reload. Based on the [bug report](https://bugs.webkit.org/show_bug.cgi?id=13574), we’re also not likely to see this situation change either.
  - 2020-02-21: This article is from the archives of felocity.com. The original published article can be found via the [internet wayback machine](https://web.archive.org/web/20130410103709/http://www.felocity.com/article/insertbefore_appendchild_and_reloading_iframes/). It has recieved a quick once-over to modernize the content where applicable, but may contain references and links to code that is dead, unloved, or may simply no longer apply to modern web development.
---

If you’re playing around with iframes, there’s a nasty bug that occurs when you attempt to move the iframe using methods such as `appendChild()` or `insertBefore()`. How nasty the bug is depends on how tolerant your code is of reloading behaviors. Any attempts to move the iframe around will cause reloads in older Safari & Firefox versions. The problem lies in how the browsers interpret these events, removing the node and then adding it to its new destination which triggers a reload. If you’re trying to move iframes around on the page with something like a drag and drop interface, this rears its ugly head. Strangely enough, IE doesn’t exhibit this behavior, which leaves the problem to just Webkit and Firefox.

## Workarounds in CSS

A quick scan reveals only one consistent technique for moving iframes about on the page using CSS- positioning absolutely. An absolutely positioned iframe can be readjusted easily, and can track directly on top of a placeholder such as a div. This works pretty fantastically in all but the most complex of layouts where absolute positioning requires a relative parent in just the right place.

```html
<div id="#placeholder"></div>
  <!-- ...last node in the page... -->
  <iframe id="theFrame" src="http://www.example.com"
   style="left: -12345px; top: 0; position: absolute;"></iframe>
</body>
```

```js
(function() {
  var div = document.getElementById("placeholder");
  var iframe = document.getElementById("theFrame");

  window.setInterval(function putFrameOntoPlaceholder() {
    // 1) measure the size of the iframe, change size of div
    div.width = iframe.offsetWidth + "px";
    div.height = iframe.offsetHeight + "px";

    // 2) get the div's position on the page, position iframe
    iframe.left = div.offsetLeft + "px";
    iframe.top = div.offsetHeight + "px";
  }, 100);
})();
```

In layouts that make heavy use of relative positioning, it’s easy to see where this might run into snags. Styles on either the div or iframe could mess up the alignment a bit, and while it’s correctable it’s not very feasible for a large scale site where there’s going to be several developers building code.

## Webkit & Gmail: Adopting Nodes

In July 2010, Google silently released an improvement to Gmail. It was most noticeable when using the gmail chat feature. You could open the chat window, “pop” it out of the main window, and then _close the parent window_ and everything continued to work. The most fascinating part about this was the minimal load time in the popup. It was as if the entire Gmail environment were being ported over to the popup as part of the unload events. That’s exactly what’s happening. **The iframe contained the code both the main page and popup needed.** [The initial webkit bug on reparenting iframes](https://bugs.webkit.org/show_bug.cgi?id=32848) would result in the ideal fix.

This worked thanks to the [DOM Level 3](http://www.w3.org/TR/DOM-Level-3-Core/core.html) core; a new DOM manipulation method was added called `adoptNode()`. Adopting an HTML node would simply move the node and in the case of the iframe, would not trigger a reload of the content. Coming back to Gmail, the JavaScript needed for the popup window is loaded into an iframe. When the parent window is closed, `adoptNode()` is called, moving all of the necessary code into the popup window before itself closing.

## And Firefox? Opera? Insert-other-browser?

Unfortunately, as of this writing, Firefox still has [an open ticket on the [broken adoptNode behavior](https://bugzilla.mozilla.org/show_bug.cgi?id=254144), with no fixes in sight. As a last ditch effort, we can fall back to `importNode()`, we will just take the performance hit and trigger an undesirable reload which can possibly erase state within the iframe if there is any.

This stuff hasn’t been validated against Opera. Since Opera is based on webkit, it shouldn’t be exhibiting this bug.

## Falling Back

Using the below code, it’s possible to use `adoptNode()` when it’s available, and then fall back to the `importNode()` as a last resort. Depending on the browser, you may still reload the sub-document. Should the `adoptNode()` bug ever get fixed, you'll get a large performance boost in iframes and popups.

```js
try {
  document.adoptNode(window.opener.$("#my-iframe"));
} catch (exc) {
  // performance hit. Either importNode, or load the
  // frame contents with appendChild()
  // remember you'll also need state somewhere
  // in window.opener
  document.importNode(window.opener.$("#my-iframe"));
}
```
