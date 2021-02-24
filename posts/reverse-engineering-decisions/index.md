---
id: be59d5b7-2afa-4be5-b35b-3dc0ba466480
title: Reverse Engineering Decisions
date: "2018-06-19"
published: true
description: We can always go back, if we plan just a little ahead
era: leadsv
category: Leadership
tags:
  - Code
  - Type 2 Decisions
---

Prior to 1995, the idea of a "Type 2" decision didn't exist. In a [letter that year to Amazon shareholders](https://www.sec.gov/Archives/edgar/data/1018724/000119312516530910/d168744dex991.htm), Jeff Bezos explained that all decisions at his company fell into one of two buckets. The first bucket he labeled "Type 1" and reserved for decisions that are irreversible (or nearly irreversible) and frequently have an outsized impact on a company. Everything else he defined as a Type 2 decision.

Type 1 decisions do exist, and they must be considered carefully. But that wasn't his concern; rather, Bezos was afraid that innovation at Amazon would stagnate and the company would lose momentum if they went down a path of applying Type 1 processes to **every** decision, including the reversible ones. The reality is that most decisions do not require extreme scrutiny, nor do most decisions put companies at risk based on their outcome. Most decisions are Type 2.

Because Type 2 decisions can be made quickly by high judgement individuals, these decisions help a company to be more agile. That certainly sounds like how we want engineering decisions to unfold.

Yet almost every engineering organization has fallen prey to applying Type 1 decision making to all of their decisions. All of us, often with the best intentions, have slowed down our decision making on the basis of risk then paradoxically rushed products to market without any idea of how to undo our decision if it doesn't bear fruit. With either of these two factors in play, every engineering decision suddenly looks like a Type 1 decision.

We need to get back to Type 2 engineering decisions.

# Engineering Decisions Aren't Type 1

Most engineering decisions aren't Type 1 decisions. As Bezos describes it, Type 1 decisions are "one-way doors… If you walk through and don't like what you see on the other side, you can't get back to where you were before."

![Nothing is as scary as a cabinet full of racoons](/images/posts/reverse-engineering-decisions/fear.jpeg)

We've sent humans to the moon. In comparison, bringing code back to its original state is trivial. Database migrations, selecting programming languages, and even choosing a cloud provider can feel on the surface like unidirectional paths. But databases have backups, languages can be changed later (you'll rarely ever be a single-language company anyway), and containers have made it easier than ever to change hosts. These decisions are not without cost, but they are certainly reversible.

So if engineering decisions are inherently Type 2 decisions, why would the following pitch fail at almost every company?

_We're redoing the chat system next month. I know we're mostly a Java shop, but I think we should redo the backend in Clojure. [insert the reasons for Clojure here]_

There are a dozen different reasons why this proposal might fail. Most of those reasons will never be tested, though, as organizational bodies such as Guilds and Architecture Councils, along with systems such as Releases Checklists, are designed to say "no" to these ideas. While well intentioned, these are the systems that create additional process and hurdles that prevent change from even being attempted in the first place. The end state of most of these bodies is a heavyweight Type 1 decision-making process.

You don't have to go out and disband your Architecture Council, but you might want to change their charter. To return to Type 2 decision making, these groups can stop throwing up roadblocks to change and start focusing on how to help engineers make safe, reversible decisions by considering and controlling risks and by making it possible to reverse these decisions later.

# Controlling for Risk by Controlling Cost

Every company takes risks, gambling that the benefit of a feature or technology will [outweigh its cost](http://firstround.com/review/this-matrix-helps-growing-teams-make-great-decisions/). This risk is often hidden behind questions about how much something will cost or how long it will take. Cost and time are stand-ins for risk. For products and features built on established technology, the cost of developing a feature is always proportional:

`Cost of Feature = k * Cost of Product`

This is the normal equation for building features. When technology is known and constant `(k)`, the cost of the feature grows proportionally to the complexity of the product. However, this all goes out the window when we use a new technology to deliver a new product.

`Cost of Feature = Cost of Technology * Cost of Product`

Not only have we lost the only constant in the equation, but now any increases in the cost of a feature are difficult to clearly attribute to either the product or the technology. Engineers who have attempted to re-architect something while adding new features can explain firsthand how rapidly feature cost can grow.

!["Threading the Needle" is a good way to describe changing both technology and product at the same time](/images/posts/reverse-engineering-decisions/needle.jpeg)

Coupling engineering decisions with the product makes it impossible to control for cost. Being unable to control for cost then creates an unmeasurable amount of risk. Aversion to this risk, the likelihood that the benefit will no longer outweigh the cost, especially when it is poorly quantified or largely unknowable, drives us towards Type 1 decisions.

But if we [change only the technology](https://engineering.gusto.com/the-shortest-path-is-the-scariest/) without changing features simultaneously, we return to a manageable cost and therefore a manageable amount of risk:

```
Cost of Engineering Decision = k * Cost of Technology

...and...

Cost of Technology = Time in Production * Scope of Deployment
```

When we are not iterating on the product `(k)`, the cost of an engineering decision is proportional to the technology cost. And as engineers, there are two levers we use to control technology costs: How long the decision is in production, and how widely deployed the decision is. These can be controlled for by placing caps on decision time and scope of deployment.

Limiting the time in production ensures that even less than optimal decisions will be revisited after a known interval of time, while limiting the scope of deployment ensures that the number of systems affected by our decision remains small until the change has been validated. This is critical should we revisit the decision and decide we need to reverse or change course.

However, just controlling for time and scope by themselves will not make Type 2 decision-making possible. We also need to eliminate that one-way door: If a decision does need to be reversed, we must be able to reverse it.

# Reversible Engineering Decisions

"We can't undo the change" is a statement based exclusively on fear and laziness. The idea that you cannot return to a previous state is nonsensical. It might take a tremendous amount of work, but it's never impossible.

However, without a realistic plan to go backwards, any engineering decision will suddenly look like a Type 1 decision, regardless of how well we have controlled the costs of the decision. The problem of reversing engineering decisions is solved with the domain of engineering:

- Is there a backwards compatible way to do this?
- Can we minimize the number of impacted systems?
- Can we reverse the code without negative repercussions?

![An image of signposts](/images/posts/reverse-engineering-decisions/signpost.jpeg)

For most changes, even complex ones such as selecting cloud providers or introducing new languages within a company, these questions are finite in scope and straightforward to answer.

First, we should always consider whether there is a backwards compatible way to accomplish our goal. Any decisions that are backwards compatible with existing systems are inherently reversible. An API, database, or other system that can be disabled without negative side effects means that reversing the decision is as simple as changing a configuration.

Then, we need to limit the number of systems involved. Decisions that limit the number of impacted systems will be easier to reverse should we decide to. Large technology efforts can be broken down into individual systems to test and validate. Should we decide to reverse our decision, this reduces the number of steps we must take to undo a change.

Finally, we need to articulate and document the steps involved in reversing the code. In simple cases, this might be as straightforward as ramping down the traffic to a service or endpoint. In more complex cases, it may involve invalidating caches, notifying business partners, or doing the reversal outside of core business hours. If you've been here a while, you know I'd [recommend RFCs](/archives/rfcs-ftw) for the job.

By making it easier to to reverse an engineering decision, we make it easier to treat the decision as a Type 2 decision.

Now we have answers for the scope, the shelf life, and the reversal path of our decision. To actually carry out the Type 2 decision, we must now write it down, act upon it, and report on the results.

# Putting Type 2 Engineering Decisions Into Practice

Let's return to our earlier Clojure example. An organization focused on helping people get to "yes" instead of saying "no" wouldn't stop the deployment of Clojure into production. Instead, the group would facilitate the answering of important questions:

- Why are we making this decision?
- What is the maximum amount of time we will run with the decision before reevaluating?
- What is the minimum scope necessary to produce sufficient learnings from our decision?
- How will we return the systems to their original state if necessary?

Accountability would necessitate that if you're the individual who wants to bring Clojure to the company, you've spent some time thinking about these questions and have made an honest effort to answer them. Once these questions are answered, estimating the risk and making the decision becomes much simpler.

![A remote control highlighting "Netflix"](/images/posts/reverse-engineering-decisions/netflix.jpeg)

There is no better example of Type 2 decision making in practice than at Netflix. In Los Gatos, the company champions a culture of Freedom & Responsibility. Outside of some basic guardrails (don't create irrevocable disasters; don't cause moral, ethical, or legal issues), engineers have the freedom to make whatever engineering decisions are necessary in order to move the company forward.

At Netflix, [engineering teams make their own decisions](https://medium.com/netflix-techblog/engineering-trade-offs-and-the-netflix-api-re-architecture-64f122b277dd) and are responsible for their own code from inception to deployment to operations. Instead of losing themselves to an endless debate around whether an engineering decision is correct, the company prioritized the ability to recover quickly from wrong decisions.

And it worked.

Netflix Engineering has continued to grow and innovate, winning [numerous awards](https://www.comparably.com/companies/netflix/awards) and strong employee scores for its culture all the while.

You don't have to be Netflix or Amazon to get your engineering team back to making Type 2 decisions. Start simple by asking folks to get their reasoning behind proposed changes down in writing using the questions above as a guide. Answering "why," "how long," "how much," and "how to return" goes a long way towards controlling the cost (and concomitant risks) of decisions and ensuring you can have the same kind of rapid response that companies like Netflix enjoy.

In answering these questions, insist on written communication over oral communication. Systems like Architectural Decision Records or a RFC can help you capture debate, discussion, and your learnings. When other engineers understand what you are doing and why, carry out the decision.

Then, when a decision reaches the end of its shelf life, revisit it. If it was the right decision, share what you learned and determine your next steps. If it wasn't, do exactly the same thing, but activate your plan for reversing or changing the decision.

Record it, do it, revisit it.
