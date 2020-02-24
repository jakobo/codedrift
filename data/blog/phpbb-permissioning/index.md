---
title: A different approach to phpbb's permissions
date: "2004-12-02"
published: true
description: Gaia's volunteer moderator system outstripped phpbb's capabilities
era: gaia
changes:
  - 2020-02-23: This was rescued from the archives of the old [felocity.org](https://web.archive.org/web/20041207010434/http://felocity.org/) site. Writing on the internet was pretty different back then.
---

I’m excited, I get to go visit Gaia’s ISP tonight. I truthfully think the thrill is more in getting to work with hardware than programming. Plus, moving thin little boxes around is always fun.

Currently, I’ve been doing a lot of work with the way phpbb handles its permissions. The method is a group based Moderator scheme, which then uses a different user attribute for most moderation functions. Many people know about Gaia’s two moderator groups, and this is actually more in line with how phpbb intended permissions to be. Give a group power to modify forum X, give another group power to modify forum Y. The problem is, all moderation functions check to see if you are an admin. In phpbb’s architecture, there is no admin “group”. The only reasoning I could find for it was that it simply wasn’t thought of. Many other large scale systems (Xoops comes to mind) use an administrative group just like any other group. Permissions are then applied on the group level.

So then, in centralizing the permissioning model, we see two primary approaches. The first of these is to centralize permissions into groups, and then add users to groups. However, with over 1.3 million users, the group table will grow very large, very quickly. However, you could change permissions for an entire group of people by just adjusting the group. The other way that came to mind was to centralize the permissions on the users themselves. This would allow for “groups of permissions” instead of “groups of users”. From a management perspective, this actually isn’t the better of the two solutions. However, assuming a static package of permissions relative to a user’s power on the site, it makes sense to simply give a user a level / value / package. You could still potentially build a model for a finer granularity of control, but in the case of Gaia, a moderator / admin / etc has a predefined series of tools. The likelihood of adding someone who would mod area A but not area B is actually small (compared to the total user base) and so these individual cases are realistic enough to handle in a separate table.

The other piece of rationale to a user-centric permissioning system is its need to be both forward-compatible with future development, and yet backwards compatible with everything else that has been written. This is where the nightmare truly begins. Several pieces around the site need to be reengineered to the new permission model, including the way our forum tree is built, the piece that says if you can view a topic or not, forum viewing, jumpboxes, etc. However, there are prefabricated templates and expected results. So the new code has expected input, and output, but a completely different internal engine. Essentially then, we are emulating phpbb’s authorization functions while everything under the hood changes. Thankfully, all future developments already include the user-centric model, so the biggest overhaul is in the forums.

I’ve got some 3 pages of notes about ideas of where to change code. It’s time now to see if anything out of these notes will pan out.
