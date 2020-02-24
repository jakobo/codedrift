---
title: Improve Transparency With RFCs
date: "2017-11-01"
published: true
description: A lightweight process that embraces the oldest consensus tool on the Internet
era: leadsv
changes:
  - 2020-02-21: This article has been updated to point to the new URL location of the RFC repository
---

> If you’re already onboard with RFCs in your engineering org, [skip straight to github](https://github.com/aibexhq/rfc) for a turnkey RFC process you can use.

When I first set out to [kill the status report](/thoughts/fix-the-status-report), the goal was for us as engineers to move away from the “what” and spend more time documenting the “why”. Two and a half years ago, the idea of **whydocs** gave a name to source-committed rationale behind our technical decisions. This idea found its way into Agile methodology as Architecture Decision Records (ADR). Both whydocs and ADRs share a common problem. Companies with these tools in place are only capturing what was decided, not what was considered and decided against.

The answer to sharing ideas and intents resides in the oldest consensus tool on the internet, the “Request for Comments” (RFC). With an open, timely, non-authoritative design, RFCs not only capture what was decided, but what wasn’t decided, technical ideas, and general thoughts about engineering. The broad application of RFCs makes it a stronger choice than whydocs and ADRs for capturing decisions in your engineering organization.

## It Began With a Memo

In 1969, Stephen Crocker sent a memo to his partners creating a collection of connected machines known as ARPANET. In a [2009 op-ed](http://www.nytimes.com/2009/04/07/opinion/07crocker.html), Steve described his anxiety about publishing the notes of the informal working group, worried that “we might sound as though we were making official decisions or asserting authority.” To minimize this perception, Steve titled the collection of ideas a “Request for Comments.”

In the [third such memo](https://tools.ietf.org/html/rfc3) he sent, Steve explained his reasoning and set forth simple guidelines.

![RFC-3: The RFC on RFCs](/static/thoughts/improve-transparency-with-rfc/rfc3.png)

> Documentation of the NWG’s effort is through notes such as this. Notes may be produced at any site by anybody and included in this series.
>
> CONTENT
>
> The content of a NWG note may be any thought, suggestion, etc. related to the HOST software or other aspect of the network. Notes are encouraged to be timely rather than polished. Philosophical positions without examples or other specifics, specific suggestions or implementation techniques without introductory or background explication, and explicit questions without any attempted answers are all acceptable. The minimum length for a NWG note is one sentence.
>
> These standards (or lack of them) are stated explicitly for two reasons. First, there is a tendency to view a written statement as ipso facto authoritative, and we hope to promote the exchange and discussion of considerably less than authoritative ideas. Second, there is a natural hesitancy to publish something unpolished, and we hope to ease this inhibition.

In these three paragraphs, a significant amount of procedural red tape could no longer take hold.

1. Anybody can create a note and have it included, regardless of length
2. Notes should be timely, not perfect
3. These are non-authoritative, non-binding ideas

For almost 50 years now, the RFC has persevered. Not only does it remain the standard way of proposing ideas for the groups created in the wake of ARPANET, but the use of RFCs has expanded to many modern languages and frameworks including [Rust](https://github.com/rust-lang/rfcs), [React](https://reactjs.org/blog/2016/04/07/react-v15.html), [Ember](https://github.com/emberjs/rfcs), [Python](https://www.python.org/dev/peps/pep-0001/), [Chef](https://github.com/chef/chef-rfc), and others. Every group that has adopted RFCs has sought to further democratize ideas and increase transparency within their organization. It’s time for Engineering Organizations to enjoy these benefits.

## RFCs In Engineering Organizations

We intrinsically know that the strongest ideas are not born in a committee or a council, but instead from individual engineers solving difficult business problems. Yet when we find ourselves repeating work, ideas, and effort, we create governing bodies that attempt to exert control over our organization.

**Architecture Councils** are formed in order to approve or bless ideas, yet these autocratic groups often tear themselves apart due to a lack of authority or a lack of individuals wanting to interact with them.

**Guilds** are created when there’s a common thread everyone shares (language, stack, framework) in order to pitch ideas and build consensus. These are synchronous events and discussions containing key decisions are rarely recorded.

**Chief Architects** are hired and are placed into roles where they must dictate decisions outside of their domain, driving engineering efforts underground.

A better answer to all of the above is an open process where anyone can submit ideas (especially in their infancy), get feedback from peers, and know that the collection of ideas is neither binding nor authoritative. Thankfully, for this process, we can return to the humble RFC. The three intents of the RFC process embody what we value in a transparent and collaborative engineering organization.

1. Anyone in the organization can propose an idea, regardless of length
2. Proposals should be timely, not perfect
3. These are non-authoritative, non-binding ideas

RFCs are a tool that gives us an alternative way of building consensus that favors modern development practices.

The key to the RFC’s success in an engineering organization is the lack of friction. An ideal RFC process for a modern company leverages the minimum set of tools any engineer has on hand: an editor, a source control tool, and a code review system. Anything beyond these three items is extra-credit. The goal is to make it as easy as possible to publish ideas and collect feedback.

## Bringing RFCs to Your Team

Your first RFC does not need to be so ambitious as to turn the entire company on to the idea of RFCs. Local teams benefit from recording and broadcasting their intent for architectures, changes, and ideas regardless of the culture or climate around them. If you’re a direct manager or an engineer, you have the power to take the first step.

That first step is (naturally) to create your first RFC and share it, just as Stephen did in 1969. If hand delivered letters aren’t your style, the [RFCs for Engineering Organizations git](https://github.com/aibexhq/rfc) we use at [Aibex](https://aibex.com) has the why, the how, and even RFC-1 titled “using rfcs” ready for distribution. Just fork the repository, answer the open questions, and publish to your company’s code system. From then on, just take a few moments to capture your team’s ideas and share them as RFCs.

Before long, other teams will notice. When you encourage them to participate and share their own ideas, your RFCs will gain momentum and visibility. Eventually, you’ll achieve the open honest communication and democratization of ideas that is key to engineering organization health. All because you made a Request for Comments. Our organizations deserve nothing less.
