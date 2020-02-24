---
title: Friendly akick Advice
date: "2003-09-23"
published: true
description: A flash of inline content in your (flash) replacement
era: college
changes:
  - 2020-02-23: In the wild west of IRC, you'd occasionally have channel operators that would go on wild powertrips and "auto kick" (akick) for a good laugh. This article could easily apply to any modern messaging platform. You should still not just kick people out of social spaces for fun.
  - 2020-02-23: This was rescued from the archives of the old [felocity.org](https://web.archive.org/web/20030924065232/http://www.felocity.org/) site. Writing on the internet was pretty different back then.
---

When you are an op in IRC, you have some obligations to the people in the channel. To keep order, to be fair, and to balance the channel. To do this, you have three major ways of removing a problem: kick, kickban, akick. Let's look at these in a nice simple fashion. Maybe you too, an op of an IRC channel can appreciate the differences and use what you think is appropriate.

Kick: `/kick #channel <nick> <reason>` perhaps the simplest of maneuvers, a swift kick in the bum is likened to a slap on the wrists. When a user is kicked, their activity in the IRC channel is frozen for a moment, making sure the OPs warning got to them. Since most people have their chat programs auto-rejoin, a kick is nothing more than a minor inconvenience. Additionally, beyond being just a small slap, a kick can be funny, amusement, or just plain boredom. On a scale of 1 to being rammed up the ass, kicking only rates about a 2.5.

Kickban: `/ban -uN #<channel> <nick>` followed by `/kick #<channel> <nick> <reason>` is a much stronger version of the kick. By adding a ban to the front of the kick, it makes sure that an auto-rejoin script can't bring the user back into the channel for a small amount of time. Since the user can't rejoin automatically, they are forced to sit and think about their actions. A time-out, if you will. "N" is a variable number that when used will unset a ban after a certain number of seconds, saving you the trouble of remembering to remove the ban. When no ban expiry is set, a ban could in theory last forever. On a scale of 1 to being rammed up the ass, the kickban varies from about a 4 to a 9.

AKICK: `/chanserv akick #<channel> add hostmask` is the ugliest and meanest of all kicking. When an authorized person adds someone to the AKICK list it means they are gone for good, forever, and can't even come back if someone removes the ban. This is the big McNasty of boots, and is reserved only for people who are truly hopeless or are constantly breaking channel rules, even after being warned several times. On the scale of 1 to completely-hosing-someone, this is the clear winner with a ranking of 10. If you get an AKICK, you usually deserve it.

I say usually because there are some ops who don't understand how this system works. You don't akick because a guy pisses you off, you don't akick because you have some sort of grudge against a single person, and you don't akick to solve problems until you discuss it with other people. We here at felocity.org hope you find this guide to be informative and fun. Remember, don't kick unless you really really mean it.
