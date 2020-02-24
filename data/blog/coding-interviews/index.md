---
title: Coding Interviews
date: "2015-06-22"
published: true
description: Why a decade of computer science doesn't fit in a 45 minute interview
era: pinterest
banner: /static/thoughts/coding-interviews/banner.jpeg
---

We shouldn’t need to code in onsite interviews. However, in a sea of resumes, we need some kind of signal to understand how well a candidate understands the job they are applying for. Lacking any better way to answer “do you understand the concept of programming”, we’re left with technical interviews. We use these questions because we need to establish a baseline for programming competency.

As a company increases in size, our definition of competency changes. This is because as engineers, we are always told to [hire smart people](http://www.joelonsoftware.com/articles/GuerrillaInterviewing3.html). In response, our once straightforward baseline questions evolve to look for smarter and smarter developers. The cumulation of this process is a complete migration from “show me something you’ve built” to “reverse a linked list”. As we try and find harder questions for candidates, we look online for guidance. We go to Google and we come back with knapsacks.

## Knapsacks in the Workplace

The Knapsack Problem illustrates everything that is wrong with technical interviews and how we conduct them today.

> Given a knapsack size of “n”, what is the most valuable combination of items you can place in the knapsack without exceeding the weight limit?

![The knapsack problem, illustrated](/static/thoughts/coding-interviews/knapsack.png)
Knapsack Problem Illustrated by Dake ([wikimedia commons](http://en.wikipedia.org/wiki/File:Knapsack.svg))

Engineers love this shit.

- The basic implementation isn’t “optimal”
- To do it “right” is “hard”
- The solutions on the internet are generally trusted

Hell, the Knapsack Problem even has one true solution and “hints” written by smart people that you can copy/paste right into your company wiki.

Everything about the Knapsack Problem is flawed. When we pick this question, we do it ignorant of why it was a “hard” problem to begin with.

The Knapsack Problem above is known as a Dynamic Programming (or DP) problem. DP was conceived in [1953 by Richard Bellman](http://www.ncbi.nlm.nih.gov/pmc/articles/PMC528332/pdf/pnas00713-0067.pdf) as a way to break a large problem up into smaller sub problems. However, it wasn’t until the late 1960's that [Viterbi](http://ieeexplore.ieee.org/xpl/login.jsp?tp=&arnumber=1054010&url=http%3A%2F%2Fieeexplore.ieee.org%2Fxpls%2Fabs_all.jsp%3Farnumber%3D1054010) as well as [Hart, Nilsson, and Raphael](http://ieeexplore.ieee.org/xpl/login.jsp?tp=&arnumber=4082128&url=http%3A%2F%2Fieeexplore.ieee.org%2Fxpls%2Fabs_all.jsp%3Farnumber%3D4082128) created algorithms that applied DP theory to real world problems. It took over 15 years to go from an idea to an algorithm, 15 years by some of the smartest people in our field.

**And we expect someone who doesn’t recall the solution from memory to condense 15 years of computer science into a 45 minute window via clever hints.**

That’s not just hard, that’s unrealistic and unfair. The only way you could complete the programming activity in time is strict recall. This places the Knapsack Problem and its ilk in the realm of what I’ve been calling Eureka Problems; named for the required "A-Ha" someone has to have in the interview to stand a chance.

## Eureka Problems

The worst programming problems for technical interviews are in the bucket of Eureka Problems. If you don’t know what a Eureka Problem feels like, here are a few technical interview questions.

1.  Given an array of numbers, find the array range that contains the largest possible sum.
2.  Given a grid and a robot at point [X1, Y1], write a solution that calculates the path to its destination [X2, Y2].
3.  Given a linked list, write a solution that detects if the linked list contains a loop.

For these problems, it’s possible to develop a solution to the problem. Anyone who has done a technical interview recently smells something missing: constraints. With **only a few more words,** these questions become Eureka Problems, containing one true answer.

1. Given an array of numbers, find the array range that contains the largest possible sum **in O(n) time**. (Solved using Kadane’s algorithm)
2. Given a grid and a robot at point [X1, Y1], write a solution that calculates the **shortest** path to its destination [X2, Y2]. (Solved using A\* search algorithm)
3. Given a linked list size of N, how can we tell if the LinkedList has a cycle in it **without modifying anything**? (Solved using Floyd’s cycle-finding algorithm)

The restrictions force you to have a Eureka Moment. Like the Knapsack Problem above, you’re asked to condense the thinking behind a decade of computer science into the remaining 20 minutes.

These Eureka Problems are so ingrained in our interview culture that there are [entire books written](http://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/098478280X) on coding interviews. That’s right. Entire books center around recognizing the 10 most common Eureka Problems and the 10–15 variants of each. Those questions above are all in the book, along with the Knapsack Problem from higher up.

Once you add the restrictions, you are no longer assessing the candidate’s ability to do the job asked of them. Instead, you’ve created a question that is assessing the candidate’s memorization and recall ability. That’s not what we want to know at all.

## Towards Pragmatism

“Do I want to be on the receiving end of this person’s emails, code, & bug reports?”

This is the question you probably want to answer if you care about the software you are creating. It’s also easier to check by asking questions closer to the job at hand. If he is doing browser code, make a multi-column layout. If she is an application developer, have her call a mock of your API and do something with the data.

We say we want a holistic developer who sees the big picture. Someone who asks questions about the business, how it all fits together, and sees opportunity in all the different parts of the role. None of these traits come out in asking someone to recreate a pathfinding algorithm.

Let’s ask these instead, for example.

- Given this page on Stack Overflow (in an area your resume says you have experience in) can you help me figure out which answer is the right answer? How do we test it and find out?
- I have a design / product specification here. Can we walk through it and start on a basic proof of concept over the next 30 or so minutes?
- Let’s take this code here that I wrote and isn’t working. Can you sit over my shoulder as we debug this and help me create working code? We can also add some tests so I don’t break it again.

If you can’t get away from your attraction to classic Computer Science interview questions, consider accepting the less than perfect solution. You’re hiring someone to solve problems and write code, not to design algorithms.

Remember.

“Do I want to be on the receiving end of this person’s emails, code, & bug reports?”

Because that’s the question you need to be answering at the end of the interview.
