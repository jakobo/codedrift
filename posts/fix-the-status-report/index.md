---
id: 6b9cd4c1-fd81-4bcc-a29e-5c64061eb63a
title: Fix the Status Report
date: "2015-03-18"
published: true
description: There are better things for everyone to do on a Friday
category: Leadership
tags:
  - Status
  - 1:1s
banner: /images/posts/fix-the-status-report/banner.jpeg
---

"I'm sorry, but" I find myself beginning with my team, "we need to do a weekly status email." I feel defeated. Five years into helping people amplify their careers and the best tool I have for sharing our success with the organization is a three-bullet-point mess.

Status Reports (capital S, capital R) are nothing but a source of loathing. They represent a lumbering beast of a company, rife with bad communication and people no longer knowing what the person next to them is working on.

I believe we can fix this.

First order of business: Status Reports are terrible. I'm not the first [[1](https://marklewis3.typepad.com/blog/2014/07/status-reports-are-bullsht.html), [2](https://foredecker.wordpress.com/2011/03/05/status-reports-suck-and-everybody-hates-them/), [3](https://randsinrepose.com/archives/status-reports/)] person to make this observation. I'd wager there hasn't been a mention of them that isn't met with sighs and eyerolls from engineers. A Status Report represents a weekly interruption where everyone scrambles to remember how they spent the last 39.75 hours of their week.

The Status Report is well deserving of the ire it gets. I have been on both ends of it. It's frustrating. Every other tool we use as engineers already captures what we are doing, so why the Status Report?

We lose a lot of time to these things.

Consider that the cognitive load of simply switching into Status Report mode is [23 minutes and 15 seconds](https://www.fastcompany.com/944128/worker-interrupted-cost-task-switching). To get back on track, we're butting against an hour of time. That is an entire hour your organization is going to grind to a halt. Engineers will instead be scouring the bug tracker, emails, and wiki history in an attempt to reconstruct the work week.

Engineers do this out of fear. They believe that a Status Report lacking in status will impact their career, earn them questions from their boss, or otherwise make their life even more difficult than the time they are expending on the Status Report. So the engineer diligently assembles as many bullet points as necessary to avoid making themselves look bad.

This process exposes the two major flaws with how we do Status Reports. First, we use them as a snapshot in time, capturing only the world as we knew it at the time the report was due. Second, we have an unhealthy obsession with only the "what" part of our progress, removing key information around why we undertook the tasks we did or how we moved forward.

# No Snapshots

Status is not locked at 4:45pm on a Friday. Status is a flowing state that changes from day to day. Trying to get a clear picture of all of the moving parts is like capturing a photo of a sprinter using a polaroid camera. The larger the organization, the more lag that gets introduced into Status Reports. Your boss wants to share the status on Friday, so you ask for everything Thursday; by the time everyone finishes their status, something really important that happened isn't in anyone's report.

Status needs to be queryable and searchable. Tools such as Slack and HipChat can make this possible. A properly set up instance of one of these tools is already listening to all the work you are doing. It's a stream of consciousness is one of the purest forms: data.

# It's Important Because

Right there are the three magic words. The thing you're working on in that other browser tab, do you know why you are doing it beyond the ticket having your name on it? Does it map to the Really Big Problems your company wants to solve? When your boss asks for more details about something, does the importance come attached? Adding the phrase "it's important because" on both sides will lend a natural structure and meaning to the work.

And honestly, sometimes it's hell to finish that thought. Maybe you don't know why the work you are doing matters. Make a point of resolving that.

In fact, let's just document the "why" as it happens and be done with status as we knew it.

# Whydoc Can Kill the Status Report

I usually hate creating new terms for things, but the replacement of the Status Report deserves a less toxic name. You're welcome to call it whatever you'd like, but the goal is to make status something anyone can pull; it never was supposed to be something people "pushed" to their manager. While the formula I present below is applicable to Slack, you can tweak it to any other real time "feed" system you have (HipChat, Hall, etc).

1. Make the tracking automatic. Take advantage of Slack's webhook framework. Capture events from all of the tools you are already using.
2. Create Whydoc channels. I like "Y[GOAL]" both for meme amusement and the Y items being sorted much lower on the channel list. For example, "yjsframework" is all about why we need to choose a JS framework and how that moves the business forward.
3. Curate the meaningful events. When important things happen that affect the Whydoc, post the permalink (right click the timestamp, copy/paste) and drop it into the channel. If you're really big on automation, feel free to make curation an automatic #hashtag operation.
4. Steer 1:1 conversations away from the generic status. Simply changing "what are you working on" to "how are you solving this week's problems" will tell you much more about the real problems and why they are important. The work being done is progress for the company, so find what problems the work is currently solving, understand why they matter, and capture that. Then, share it in a private group channel between you and your employee so everyone has a record of the why behind their work. For now, I just call them "Udocs" for consistency.

We have now turned the Status Report into a self service model. We not only know what's being done (date searching), but why it's important (Whydocs), and all of the other value people are creating (Udocs) that may not have been immediately obvious.

> Fun trivia bonus: The name "whydoc" came from the idea of putting "why_xnxx.md" in the root directory of a software project that was Not Invented Here. This provided an in-code rationale for why we needed the custom solution, and also assisted with onboarding.
