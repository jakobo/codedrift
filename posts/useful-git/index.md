---
id: 7cec3bd1-e044-4dc8-a9ab-141fad2bc474
title: Useful Git
date: "2015-03-18"
published: true
description: There are some good git commands, and there are great git commands
era: linkedin
category: Code
tags:
  - git
changes:
  - at: "2020-02-21"
    change: This article is from the archives of felocity.com. The original published post can be found via the [wayback machine archive](https://web.archive.org/web/20141013025631/http://www.felocity.com/article/good_git_commands_to_know). It has recieved a quick once-over to modernize the content where applicable, but may contain references and links to code that is dead, unloved, or may simply no longer apply to modern web development.
---

I love git. It and its other distributed version control systems have changed the way we think and write about code. Not too long ago, we used to commit giant monoliths of code to SVN locations. Complex environments often had to dedicate at least one person to managing branches. It was the complete opposite of good. I've been using git now for over 8 years, and I'm still learning tips and tricks that make my day to day development easier and better. These are some of my favorite commands.

# git bisect: When did the code go wrong?

Eventually something will break, and if you're unlucky, it will only happen after a long stream of commits. The git bisect command allows you to begin searching for that commit where things went south. The command looks like:

```sh
git bisect start
git bisect bad HEAD
git bisect good aecdb123
# and so on...
```

You'll need to specify a "bad" revision (often `HEAD`), a "good" revision (perhaps from a tag or git log), and then you're off to the races. Git will select a commit exactly halfway between "good" and "bad". So you'll test your code. If it worked, type `git bisect good`, and if it didn't type `git bisect bad`.

Every time you tell git if things are good/bad, it will cut the remaining revisions down by half. Before you know it, you'll have zeroed in on the commit that is causing everything to fail. Check the commit log, see what happened, and you'll usually be 99% of the way towards fixing your broken build. All of the bells and whistles that make bisect even cooler are available on the [git-bisect docs page](http://www.kernel.org/pub/software/scm/git/docs/git-bisect.html).

# pull + rebase: 2 for 1

You can pull. You can fetch. You can rebase.

```sh
git pull --rebase origin master
```

Or you can do all three in a single command.

# git config: Type less with aliases

Maybe you don't like reaching up for the hyphen key `-` and want a simple command to pull and rebase at the same time. `git config` lets you set any of the config options. There are a lot, but for now we'll just show off an alias.

```sh
git config --global alias.rpull 'pull --rebase'
```

From this point forward, you can type `git rpull` to fetch+pull+rebase. Your hyphen key will thank you!

# git-reflog: Undo nearly anything

`git reset` (with the hard flag) is probably one of the scariest operations you can do. Just like that, it could appear your entire repository was catapulted back in time. This can be pretty great… as long as you didn't need any of those changes. It only took me accidentally blowing away my changes once before I did `git reset` in new branches only. This was before I learned about the "reflog".

The `git reflog` command spits out a sequence of operations.

```sh
1907832 HEAD@{0}: checkout: moving from master to sample
1907832 HEAD@{1}: commit: working on git article
809189a HEAD@{2}: commit: final title change
1887f64 HEAD@{3}: commit: minor amendment to iframe article
6c8e64c HEAD@{4}: commit: launch iframe blog, added to git blog
b47369b HEAD@{5}: pull origin master: Fast-forward
7f66541 HEAD@{6}: commit: changed to hashes for markdown, new post
b9e19d0 HEAD@{7}: commit: converting to pygment happy land
432a308 HEAD@{8}: rebase finished: returning to refs/heads/master
432a308 HEAD@{9}: rebase: more drafting of the creed post
```

It turns out that it's damn-near impossible to lose something in git. As you commit, rewind, replay, and revert, git keeps a record of every single thing you've done. Now, let's reset to some arbitrary distance ago, destroying all my hard work.

```sh
git reset --hard b9e19d0
# HEAD is now at b9e19d0 converting to pygment happy land
```

Sure, I'm back in "pygment happy land", but I just lost 7 commits worth of work. `git reflog` knows you better than you think; it has your history of changes, including your foolish reset:

```sh
b9e19d0 HEAD@{0}: reset: moving to b9e19d0
1907832 HEAD@{1}: checkout: moving from master to sample
1907832 HEAD@{2}: commit: working on git article
809189a HEAD@{3}: commit: final title change
1887f64 HEAD@{4}: commit: minor amendment to iframe article
6c8e64c HEAD@{5}: commit: launch iframe blog, added to git blog
b47369b HEAD@{6}: pull origin master: Fast-forward
7f66541 HEAD@{7}: commit: changed to hashes for markdown, new post
b9e19d0 HEAD@{8}: commit: converting to pygment happy land
432a308 HEAD@{9}: rebase finished: returning to refs/heads/master
432a308 HEAD@{10}: rebase: more drafting of the creed post
```

A quick reset back to `1907832`, and everything is back as if **nothing was ever destroyed**. There's a line added to your reflog for the reset you made too! This makes `git-reflog` incredibly powerful. It's also comforting to sometimes just look at the reflog and know git's got your back.

# Keep Learning

Most of these tips were pulled from notes I took while learning git. I then learned there is an entire website dedicated to improving your git-fu. http://gitready.com/ has examples, tricks, tips, and even more amazing things that go beyond this.
