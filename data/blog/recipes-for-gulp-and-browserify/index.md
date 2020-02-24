---
title: Recipes for gulp and browserify
date: "2014-07-14"
published: true
description: How to use Vinyl since gulp-browserify was blacklisted
era: linkedin
changes:
  - 2020-02-24: Original comments were handled via LinkedIn's content platform. You can [view the original post and comments](https://www.linkedin.com/today/post/article/20140714184735-5276101-recipes-for-gulp-and-browserify).
  - 2020-02-24: This article was rescued from the [internet archive of felocity.com](https://web.archive.org/web/20141013012724/http://www.felocity.com/article/gulp-and-browserify). Links were updated where relevant.
---

If you've tried [gulp](http://gulpjs.com/), you've probably also tried [browserify](http://browserify.org/). This also means you googled for "gulp browserify" and were led to the gulp-browserify plugin on npm. I haven't linked to it because the gulp team has ruled that the gulp-browserify plugin is blacklisted due to redundancy. Instead, the current consensus is a [recipe leveraging vinyl](https://github.com/gulpjs/gulp/issues/369), the underlying virtual file system in gulp. While I think that's technically correct, it requires intimate knowledge of browserify, streams, and the vinyl system.

## The Vinyl Code

Let's start with the code and work backwards. First up, the recommended solution (simplified).

```js
var gulp = require("gulp");
var browserify = require("browserify");
var toVinyl = require("vinyl-source-stream");
gulp.task("js", function() {
  return browserify("file.js")
    .bundle()
    .pipe(toVinyl("bundle.js"))
    .pipe(gulp.dest("output_dir/"));
});
```

This is a very powerful pattern. We're able to leverage the default browserify npm module. [viny-source-stream](https://www.npmjs.org/package/vinyl-source-stream) (npm) can take a stream in progress and convert it to a vinyl supported stream, thus giving it a virtual file system and name. By using this, you no longer have to use a special plugin for browserify. However, this solution breaks down if you want to leverage the globbing in gulp.src that makes for powerful pipelines, do additional transformations prior to browserify, or simply work with a npm module that doesn't support streams or buffers. Like all things gulp, there's a plugin for this functionality; it lets us tap into a gulp pipeline, making our own modifications. That plugin is appropriately named [gulp-tap](https://www.npmjs.org/package/gulp-tap).

## The Code With gulp-tap

```js
var gulp = require("gulp");
var tap = require("gulp-tap");
var toBuffer = require("gulp-buffer");
var browserify = require("browserify");
gulp.task("js", function() {
  return gulp
    .src("**/*.js")
    .pipe(
      tap(function(file) {
        var bundler = browserify({
          entries: [file.path],
        });
        return bundler.bundle();
      })
    )
    .pipe(toBuffer())
    .pipe("...")
    .pipe(gulp.dest("output_dir/"));
});
```

Okay, we've added a few more lines courtesy of the gulp-tap plugin. However, this is a pattern that goes well beyond browserify. gulp-tap is a swiss army knife in the gulp world. It's purpose is to expose the file in the middle of the pipeline, allowing you to call whatever custom transformations you may need. The signature for the gulp-tap configuration takes two parameters. The first is the file object (`vinyl-fs`) and contains `file.contents`, `file.path`, etc. The second is an instance of the `through2` module in case you can go to a stream directly.

Return a buffer, return a stream, or modify file.contents and you're done. Even operations that don't normally return streams or buffers are automatically moved into a buffer for compatibility with the next step on the gulp pipeline.

As a caveat, it should be noted that since you are leaving the stream/buffer world during your gulp-tap operation, it will be slower than if you had a pure solution. However, the leverage you gain for this strategy is unfaily high. Every npm module can be part of your gulp system now.

## gulp-buffer and gulp-stream

Not all gulp plugins are stream or buffer ready. Because of their design, they might be operating on one or the other. This is most common with plugins that are calling out to external commands or require the evaluation of the entire file in order to perform a task. gulp allows these utilities to decline handling streams by throwing an exception. Enter [gulp-buffer](https://www.npmjs.org/package/gulp-buffer) and [gulp-stream](https://www.npmjs.org/package/gulp-stream) (npm), taking in either buffers or streams and returning a buffer or stream for the next step of the pipeline.

In our above code, browserify provides a stream, but uglify only operates on a buffer. Piping through gulp-buffer solves this problem.

## The "gulp way"

The most successful gulp pipelines are those built with small modular components. Per the gulp team's recommendation, plugins shouldn't be created when there is already a npm module that accomplishes your goal. Thanks to utilities like vinyl-source-stream, gulp-tap, gulp-buffer, and gulp-stream, you can make the entire npm ecosystem gulp friendly. You really don't need to write a gulp plugin for most use cases, and that's serious leverage.
