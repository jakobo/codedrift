---
title: A Quick Fake Germanization
date: "2008-11-13"
published: true
description: Long words can ruin unsuspecting layouts
era: linkedin
changes:
  - 2020-02-23: This was rescued from the archives of the old [felocity.org](https://web.archive.org/web/20090505041357/http://www.felocity.org/blog/article/a_quick_fake_germanization/) site.
---

I ran into a problem where I needed to guess how something would look in German, without knowing a single drop of German. So, I pulled up Mozilla's XPath documents and made a small bookmarklet. It's far from perfect, but it definitely has its uses. Even if the first use was messing with Twitter's Fail Whale.

[Fauxgermanhausen das Pagen!](javascript:%28function%28%29%7Bvar%20prefixes%3D%5B%27%27%2C%27glocken%27%2C%27das%27%2C%27borfa%27%2C%27maushe%27%2C%27uber%27%5D%2Csuffixes%3D%5B%27%27%2C%27hausen%27%2C%27%20die%20vander%27%2C%27gleuten%27%2C%27noshan%27%2C%27flagellan%27%2C%27mek%27%2C%27dak%27%2C%27en%20das%27%2C%27ga%27%5D%2CxPathResult%3Ddocument.evaluate%28%27.//text%28%29%5Bnormalize-space%28.%29%21%3D%27%27%5D%27%2Cdocument.body%2Cnull%2CXPathResult.ORDERED_NODE_SNAPSHOT_TYPE%2Cnull%29%2Ci%2CtextNode%2Ccnt%2Cout%2Cj%2Cpfx%2Csfx%3Bfor%28i%3D0%2Cl%3DxPathResult.snapshotLength%3Bi%3Cl%3Bi++%29%7BtextNode%3DxPathResult.snapshotItem%28i%29%3Bif%28textNode.parentNode.nodeName.toLowerCase%28%29%3D%3D%27script%27%7C%7CtextNode.tagName%3D%3D%27style%27%29continue%3Bcnt%3DtextNode.data.split%28/s/g%29%3Bout%3D%5B%5D%3Bfor%28j%3D0%3Bj%3Ccnt.length%3Bj++%29%7Bif%28cnt%5Bj%5D.replace%28/%5Bs%5D/g%2C%27%27%29%3D%3D%27%27%29continue%3Bpfx%3D%28%21Math.floor%28Math.random%28%29*10%29%29%3F%27%27%3Aprefixes%5BMath.floor%28Math.random%28%29*prefixes.length%29%5D%3Bsfx%3D%28%21Math.floor%28Math.random%28%29*10%29%29%3F%27%27%3Asuffixes%5BMath.floor%28Math.random%28%29*suffixes.length%29%5D%3Bout.push%28pfx+cnt%5Bj%5D+sfx%29%3B%7DtextNode.data%3D%27%20%27+out.join%28%27%20%27%29+%27%20%27%3B%7D%7D%29%28%29%3B)

```js
(function() {
  var prefixes = ["", "glocken", "das", "borfa", "maushe", "uber"],
    suffixes = [
      "",
      "hausen",
      " die vander",
      "gleuten",
      "noshan",
      "flagellan",
      "mek",
      "dak",
      "en das",
      "ga",
    ],
    xPathResult = document.evaluate(
      ".//text()[normalize-space(.)!='']",
      document.body,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    ),
    i,
    textNode,
    cnt,
    out,
    j,
    pfx,
    sfx;
  for (i = 0, l = xPathResult.snapshotLength; i < l; i++) {
    textNode = xPathResult.snapshotItem(i);
    if (
      textNode.parentNode.nodeName.toLowerCase() == "script" ||
      textNode.tagName == "style"
    )
      continue;
    cnt = textNode.data.split(/\s/g);
    out = [];
    for (j = 0; j < cnt.length; j++) {
      if (cnt[j].replace(/[\s]/g, "") == "") continue;
      pfx = !Math.floor(Math.random() * 10)
        ? ""
        : prefixes[Math.floor(Math.random() * prefixes.length)];
      sfx = !Math.floor(Math.random() * 10)
        ? ""
        : suffixes[Math.floor(Math.random() * suffixes.length)];
      out.push(pfx + cnt[j] + sfx);
    }
    textNode.data = " " + out.join(" ") + " ";
  }
})();
```
