---
id: 77091b7e-2d14-49ef-8e10-904b185446ee
title: Most Minteresting
date: "2005-10-30"
published: true
outdated: true
description: Turning traffic data into a feed of posts
era: gaia
category: Code
tags:
  - PHP
  - Mint
changes:
  - at: "2020-02-23"
    change: This was rescued from the archives of the old [felocity.org](https://web.archive.org/web/20060218081049/http://www.felocity.org/journal/most-minteresting-indeed) site. Writing on the internet was pretty different back then.
---

Let's get right to it- I've been blogging a lot about [Mint](https://web.archive.org/web/20060218081049/http://www.haveamint.com/) lately, and there really is a good reason for it all. As a PHP/MySQL person, I love to tinker. You may have noticed a new thing where the portfolio used to be (if you're not the type for RSS). Thanks to Shaun's Mint and the good plugin folks of [Textpattern](https://web.archive.org/web/20060218081049/http://www.textpattern.com/), I've written up a little something I like to refer to as the "Most Mintersting Articles". Puns and jokes aside, this is a pretty robust plugin for TXP, and includes its own caching module.

The need was a simple enough one, I wanted more exposure for the more interesting things on the site I've written. Some articles get a lot more reads than others, and some articles get a lot more comments. Since Mint is really good at collecting where on my site people went, it made sense to design a plugin to focus on that aspect. Additionally, Mint rolls its data and deletes old logs so the "freshest" pages are always going to update with time.

# Caching the Minty Joy

If I could walk out of here with a "LIKE %" in my SQL and run it every single time no matter what, I would have. However, reality knocked quite ludly, and large tables aren't a fan of that style of searching. With a little bit of caching, we can eliminate the server strain that would otherwise be caused by the plugin. (And if it's really extreme, removing the wild-cards from the resource variable can remove the problem altogether.) The caching concept is actually based on a very old method we used for Gaia Online, put together with a bit more modern piece from the new database code we rolled out. It is based on the idea that if a query should be cached, it's SQL should never change. This means we can base the filename for the cache off of the SQL query. Since we have a very small number (1) of queries in this case, a CRC32 will suffice.

# The Goods

The rest really just needs to be seen to be believed. Of course, you need Mint (link at the top there) to make use of this, but Shaun made some awesome software, so it's well worth the price. I'd like to think of this as another good reason to get fresh and minty!

Update: Version 0.2 now supports the Mint object if Mint is on a different database than TXP.

Download rjh_minteresting v 0.2 [available as a gist](https://gist.github.com/Jakobo/f460f8f08cf92379ca47fcea4b3220f0)
