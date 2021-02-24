---
id: b7bc68b5-fc6a-4eb5-9e6b-884afdaae7b2
title: Stylizing Form Submits
date: "2006-10-28"
published: true
outdated: true
description: Camino and Safari & styling type=submit
era: gaia
category: Code
tags:
  - JavaScript
  - CSS
  - Forms
changes:
  - at: "2020-02-23"
    change: This was rescued from the archives of the old [felocity.org](https://web.archive.org/web/20061218112920/http://www.felocity.org/blog/article/stylizing_the_form_submit_button/) site.
---

"The buttons aren't styling" I remarked as I stared at the page in Camino and Safari. Testing on the Mac platform has been the absolute bane of my existence as of late, mostly because for some reason, these browsers in particular are very protective of their form widgets. Coming back to [Cameron Adams' Entry on Styling Form Widgets](https://web.archive.org/web/20061218112920/http://themaninblue.com/writing/perspective/2004/04/28/), I found that none of the Macromedia examples were actually working for Camino/Safari, although they looked beautiful in Firefox. The submit button simply would not take the background settings. Interesting enough though, something of input type="button" styled perfectly.

However, the value attribute of the button wasn't getting passed in. For the legacy code around Gaia, we have forms with more than one possible "submit" for an action. The most common case of this is preview and submit buttons we traditionally use in the forums. This left us with two scenarios:

Submit Buttons that couldn't be styled in Camino / Safari

```html
<form id="myForm" action="some.php" method="POST">
  <input type="text" name="foo" value="" />
  <input id="submitBar" type="submit" name="action" value="bar" />
  <input id="submitBaz" type="submit" name="action" value="baz" />
</form>
```

or Button tags that wouldn't pass in their value to the PHP script (and shouldn't technically perform a submit either)

```html
<form id="myForm" action="some.php" method="POST">
  <input type="text" name="foo" value="" />
  <input id="submitBar" type="button" name="action" value="bar" />
  <input id="submitBaz" type="button" name="action" value="baz" />
</form>
```

The final solution ended up being something right down the middle and using JavaScript to make up for Safari / Camino's shortcomings. Starting with a default submit button, we can replace it with a input `type="button"` node, and add a bit of JavaScript to the onclick to make up for the stylized button's shortcomings. The first block of JavaScript goes into the HEAD, and the second block can either go into an onLoad handler or at the end of the form tag, depending on how soon you need the replacement.

```js
////////
// SwapSubmit - A Tool for Stylizing Submit Buttons on All Browsers
// Licensed under CC-GPL-2.0
// http://creativecommons.org/licenses/GPL/2.0/
////////
var RJH_SwapSubmit = {
  replacedEles: new Object(),
  replace: function (formid, eleid) {
    if (typeof eleid == "string") var ele = document.getElementById(eleid);
    else var ele = eleid;

    if (typeof formid == "string") var f = document.getElementById(formid);
    else var f = formid;

    if (ele) {
      var o = this.build(formid, ele);
      var name = ele.getAttribute("name");
      var value = ele.getAttribute("value");

      var pn = ele.parentNode;
      pn.removeChild(ele);
      pn.appendChild(o);

      if (!document.getElementById(name))
        f.appendChild(this.buildInputField(formid, name));

      this.replacedEles[eleid] = new Object();
      this.replacedEles[eleid]["name"] = name;
      this.replacedEles[eleid]["value"] = value;
      this.replacedEles[eleid]["form"] = formid;
    }
  },
  build: function (formid, ele) {
    var o = document.createElement("button");
    var f = document.getElementById(formid);

    var oldOnclick = ele.onclick;
    o.id = ele.id;
    o.className = ele.className;
    o.onclick = function () {
      if (oldOnclick) {
        if (oldOnclick() == false) return false;
      }
      RJH_SwapSubmit.submitForm(this);
    };

    return o;
  },
  buildInputField: function (formid, name) {
    var o = document.createElement("input");

    o.setAttribute("type", "hidden");
    o.id = name;
    o.setAttribute("name", name);

    return o;
  },

  // ORIGIN: onClick of a button
  submitForm: function (ele) {
    var clickId = ele.id;
    var name = RJH_SwapSubmit.replacedEles[clickId]["name"];
    var value = RJH_SwapSubmit.replacedEles[clickId]["value"];
    var formid = RJH_SwapSubmit.replacedEles[clickId]["form"];
    document.getElementById(name).value = value;
    document.getElementById(formid).submit();
  },
};
```

```js
RJH_SwapSubmit.replace("FORMID", "SUBMITBBUTTONID");
```

Replace FORMID and SUBMITBUTTONID with the relevant values. If you want to see it in action, check out a working example. The example will also echo out the form contents on submit. You'll have to forgive the poor PNG buttons.

## Drawbacks

The largest drawback hands down is the addition of JavaScript. It's not something to depend on, and many steps were taken to ensure that the enhancement is progressive in nature.

Styled images will have to be styled to reflect the change from an input to a button node, and can be referenced via `button#idNameofElement` to apply all the necessary stylization.
