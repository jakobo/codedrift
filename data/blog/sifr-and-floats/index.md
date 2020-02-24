---
title: sIFR and Floats
date: "2005-04-14"
published: true
description: A flash of inline content in your (flash) replacement
era: gaia
changes:
  - 2020-02-23: This was rescued from the archives of the old [felocity.org](https://web.archive.org/web/20050507121849/http://www.felocity.org/journal) site. Writing on the internet was pretty different back then.
  - 2020-02-23: Flash isn't a technology we should use anymore. Modern web fonts have made this article compeletely obsolete. It's a good thing.
---

I ran into a snag while preparing for the May 1 reboot, involving [sIFR](https://web.archive.org/web/20050507121849/http://www.mikeindustries.com/blog/archive/2005/02/sifr-2.0-release-candidate-4). I was attempting to replace a H2 element in the following two columns. They were designed to display side by side using opposing floats. However, someone pointed out that in Firefox for Windows only (now there’s a new browser oddity for you) the flash text would cling to the top of the container element, in this case, content. Here was the initial CSS being used:

```css
#content #recentEntries {
  float: left;
  display: block;
  width: 200px;
}

#content #latestProject {
  float: right;
  display: block;
  width: 200px;
}
```

The problem was solved by making use of absolute positioning within a relative container. This solved the weird flash “flicker” that was occurring using the sIFR technique. The final CSS looked like:

```css
#content #recentEntries {
  position: absolute;
  left: 0;
  display: inline;
  width: 200px;
}

#content #latestProject {
  position: absolute;
  left: 256px;
  display: inline;
  width: 200px;
}
```

I don’t think I will be the only person who ever goes the route of floats and runs into this peculiar snag. Once I complete the Felocity design, I will also put up the alternate stylesheet that fully demonstrates the flicker effect. In the meantime though, it’s back to packing boxes. I’ve been preparing for a move to the San Jose area in the interest of not driving an hour every time I need to go to San Jose—which translates to 3-5 days a week. There’s a good number of boxes lying around and in my room. My original plan of a “few short trips and one big trip” is quickly becoming anything but a few. It seems like you always have more stuff when it’s in boxes.
