---
id: 117de3d4-7c13-4262-8ce4-f2d032f70dbb
title: The Value in Status
date: "2018-07-03"
published: true
description: If you're writing status reports, make the most of it
era: leadsv
category: Leadership
tags:
  - Status Reports
banner: /images/posts/the-value-in-status/banner.jpeg
---

Let's get this out of the way. Both you and I are not fans of the status report.

Unfortunately, there is a point in time where, lacking any reasonable alternative to keep people informed, the need for a status report is inflicted upon the organization.

I wish there was an easy way to kill off the status report once and for all. [I've certainly tried](/archives/fix-the-status-report). Even when you have an [Engineering RFC process](/archives/rfcs-ftw) or are implementing [Thoughtwork's ADRs](https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records), you will likely find yourself needing to write a status report.

As an engineer, the tedium of writing status reports means we often put off creating one until the absolute last minute.

We're missing the point. If we are going to do status reports, then we should turn them into a valuable exercise that helps us share the impact of our work. We can then share that impact with our manager, [making it easier for them to understand our work](https://simpleprogrammer.com/dealing-with-your-boss/) and advocate on our behalf.

Status reporting is a vital communication [soft skill](https://www.manning.com/books/soft-skills) every engineer needs. You don't have to invent a status report; you can just use a template. (We've got you covered on that end, so keep reading.) You'll see that when we change our mindset about the status report, it becomes an opportunity to shine instead of a chore.

# The Purpose of Status Reports

![Arms linked in unity, or more appropriately, how your manager's manager gets a status report](/images/posts/the-value-in-status/linked.jpeg)

Any discussion of status reports should focus first on why we have them in the first place. Status reports are an informational tool. The simplest version often just restates the week's accomplishments to your manager, who's responsible for getting relevant bits of information shared around the company on your behalf.

Oftentimes, your manager is the messenger of your work efforts, both to her boss and to the company at large. The process of aggregating your team's work (usually upward, then outward) gives your manager and her supervisors insight into what's going well or where they can be helpful to you and your team.

Additionally, a non-trivial amount of your manager's time is spent resolving dependencies between your team and others since your workflows are often interdependent. As the company grows, the number of relationships your manager maintains grows exponentially:

- With three teams, there are only **three** relationships.
- With six teams, there are **15 relationships**.
- With eight teams, there are **28 relationships**.

Even physical barriers such as a stairwell or other buildings [begin to interfere with how information moves](/archives/the-stairway-problem) around the company.

At some point, it is no longer realistic for you or your manager to inform every individual personally. Something has to replace face-to-face meetings. Sometimes it's a tool like Slack, but more often than not, it's email.

This need for communication at scale is why we have status reporting. But if our status reports can be read by anyone, who are we writing status reports for?

# Status Reports Aren't Only for Your Boss

![Your boss (possibly) who isn't the only one benefiting from your status report!](/images/posts/the-value-in-status/boss.jpeg)

Our first instinct is to write our status reports exclusively for our manager. After all, it's frequently our manager who asks for these updates.

Ideally, your boss is already aware of the work you are doing because your team has one-on-ones, agile daily standups, or other systems in place that acknowledge employee workflow. Even if these systems don't exist, it's rare to find a boss completely oblivious to their employees' work.

Instead, our status report is most likely to be taken by our manager and shared with their boss and the teams you interface with. Unlike your boss, these people are less concerned about the technical aspects of the work and much more interested in how the subject of your report is going to impact them.

Upward management is not always your boss, but your boss' manager, their boss, and as far upward as the status reporting goes. Frequently (but not always), it's limited to the discipline. For example, your head of engineering or business unit's GM may read a combined report of everyone's status. To address the needs of individuals upward in our management chain, our status needs to discuss why the work was important to the business objective.

Peer teams are those 28 groups we discussed above. They want to know if their work is going to be impacted by your team's timelines or if they are preventing you and your team from delivering value. For these teams, our status reports need to clearly explain our impact on their work and if our work is dependent on a task they are responsible for.

[Like a good bug ticket](https://simpleprogrammer.com/writing-world-class-software-tickets/), your status report has multiple audiences. In this case, it's your upward management chain and your peer teams.

Is it possible to write such a status report? Something that lets your boss advocate for your work, that can clearly explain business value, and can keep peer teams informed about technical implications?

You bet. It's not going to look like your traditional status report, though.

# What Goes Into a Status?

![That which is measured, explains the impact](/images/posts/the-value-in-status/measure.jpeg)

With our audience in mind and our reasons for writing a status at hand, we're ready to create our first status report. You can either use a status report template (which we have for you below) or open your favorite editor and give yourself two bullet points.

You're going to write down what you believe are the two most important things people, in addition to your boss, need to know about. While it's entirely possible there are more things you want to share, this artificial limitation forces us to focus.

Attention to a status report is finite. If we talk about fewer items, we're afforded more words to focus on why the things we chose mattered.

We have our two items we want to draw attention to, so now we can get into the details. For each of those bullet points, you're going to add five sentences.

First, we're going to write what we did that fits inside of a tweet — the old 140-character kind. This brevity forces us to be specific and concise.

Then, state why your task mattered to the business. Maybe this was part of an important project. It might be preventative maintenance. No matter the reason, you made a conscious decision to prioritize, and your next sentence should explain why this task was important to undertake or complete.

Next, acknowledge other work that was required from your peers in order to get your task done. In companies of any size, our work isn't done in isolation. Our status report gives us an [opportunity to acknowledge and recognize our peers](/archives/reward-and-recognize) for supporting the business outcomes.

If you have things you need from another team to proceed, state the ask clearly. Then, state who you are going to talk to in order to resolve this dependency.

Finally, state who individuals should come to with questions. You might suggest people email you directly, but it could also be a Slack channel or a ticket in your bug/task system that works best.

# Sample Status Report

To illustrate the power of reporting status in this form, I'm going to dredge up a status report I sent as an engineer during my time at LinkedIn while we were rolling out [reorderable profile sections](https://blog.linkedin.com/2010/02/02/linkedin-profile-reordering) back in 2010.

> **The Non-Valuable Version**
>
> - Fixed drag & drop bugs — [JIRA ticket]
> - New script init system — [JIRA ticket]
> - Testing auto-collapse sections — [JIRA ticket]
> - Fixed layout problem w/ education section — [JIRA ticket]

> **The Value-Driven Version**
> Faster load times for profile pages through changing our script initialization. This change to how we load JavaScript will result in less abandonment when members try to connect with one another. Scott (Ads) and Jeremy (Homepage) will be adapting this technique to their pages. Questions about JS Load sequencing can be sent to [my-email].
>
> We are running a test on auto-collapsing sections when dragging and dropping profile sections. We believe that people with larger LinkedIn profiles are less likely to rearrange the sections, even if it would help these members present themselves better professionally. Before we roll the change out to members, I am partnering with Sara (Analytics) to ensure the behavior is instrumented correctly and doesn't impact other metrics. Questions on this change can be directed to either myself ([my-email]) or John ([aaron-email]).

When moving into the new status report format, I had to focus the list so that I could put more attention on the things that mattered to the business. Bug fixes are important, but unless a specific bug had an outsized impact on the business, they must be nixed to make room for the items that matter most. With that in mind, I immediately dropped the bugs.

Following the format from above, we stated clearly what we did, why it was important to do it, who helped us, who we need help from, and where follow-up questions should go.

When I changed to this system for reporting status, not only did my work get more visibility, but it was also easier for me to resolve issues with other teams and ask for help when I was stuck. When it was time for promotions at the company, I already had a record of the work I did. More importantly, I also had record of why the work mattered. It was the easiest promotion I earned.

# Putting Better Status Reporting Into Practice

Setting aside the time to assess business value, recognize peers, and clearly define what's holding you up is going to take time. If you don't set aside time to do a good status report, you never will. The absolute first thing you need to do is block off 30 minutes in your calendar before 2pm on Friday.

That seems arbitrary, but the workplace slows down after Friday lunch, weekend plans form, and it gets harder and harder to set aside 30 minutes for quality work the closer to five o'clock it gets. The sooner you block off that time, the more creative energy you'll have.
