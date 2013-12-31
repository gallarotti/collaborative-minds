#Building a Single Page Application with AngularJS and Neo4J - Introduction

## Lucky Coincidences
A series of lucky coincidences has recently brought me to dip my toes into a JavaScript-centric programming world completely new to me, from top to bottom. Or maybe I should better say, from **front** to **back**:

### Front End
- Using [AngularJS](http://angularjs.org/), an open-source **JavaScript** framework, maintained by Google, that assists with running single-page applications.

### Back End
- Using **Javascript** also on the server side, with [ExpressJS](http://expressjs.com/), a web application framework built on top of [Node.js](http://nodejs.org/)
- Using **JSON** (JavaScript Object Notation) to transmit data objects between the *client*, the *server* and the *database*
- Using [Neo4J](http://www.neo4j.org/), a fully transactional Java persistence engine that stores data structured in **graphs** rather than in **tables**.

Initially I had picked the **MEAN** stack, a full-stack JavaScript development environment very trendy amongst prototypers in the Angular community (where MEAN is an acronym standing for MongoDB, ExpressJS, AngularJS and Node.js).

However, after I had already built a very simple prototype of my SPA (Single Page Application) using the MEAN stack, another lucky coincidence exposed me to **Neo4J** and it was love at first sight. My decision was that, if I had to learn something new, I would have rather enjoyed being forced into a completely new way of thinking from a data perspective as well, and so I dropped MongoDB in favor of Neo4J from my personal stack.*

## *"Abandon all hope, ye who enter here."*
In Dante Alighieri's "Divine Commedy", when Dante passes through the gate of Hell, the gate bears an inscription which reads *"Abandon all hope, ye who enter here."* 

It might sound a bit too dramatic to quote that inscription here but, being used to work in a very Microsoft-centric programming environment (**Windows**, **ASP.NET** and **SQL Server**), diving into a Javascript-centric environment felt a lot more challenging than I could have ever imagined. I had to abandon at the entrance of this new world most of what I was used to, most of what I knew and all the tools I was already familiar with. As much as it was frightening, though, finding myself almost completely disoriented felt also refreshingly good. 

In this series of posts I will try to put down in words both the mental process I went through and some of the technical challenges that I found myself facing and had to overcome while building a ficticious personal project, which consists of building a Single Page Application (SPA) recreating some/most of [Trello](https://trello.com/)'s functionality.

## New Tools for the Trade
Being that this is a personal project and since it doesn't require using any Microsoft technology, I decided to work off of my MacBook Pro. This decision meant that, among other things, I had to find either a decent text editor or an IDE to write my code, as well as an easy way to version control my files.

After trying out a few different tools, I opted for [Sublime Text](http://www.sublimetext.com/2), a very versatile cross-platform text and source code editor which I liked from the beginning.

To manage the source code I decided to grab the opportunity to try out [Git](http://git-scm.com/), a free and open source distributed version control system designed and developed by Linus Torvalds in 2005. I downloaded it and installed it on my Mac and connected it to [my empty GitHub account](https://github.com/gallarotti).

Next, I created [my first repo](https://github.com/gallarotti/collaborative-minds) (i.e. repository) and, in order to better understand the inner workings of Git, I decided to just use the OS X Terminal, issuing **git** commands directly from the command line. Needless to say, not being a command line type of person, I grew tired of that within a couple of weeks, especially because I found the **add**/**commit**/**push** sequence a bit too cumbersome/annoying (even with some of the shortcuts that git offers). So, recently, I have downloaded [GitHub for Mac](http://mac.github.com/). So far so good, although it's a bit too early to really say how I feel about it. I do enjoy the fact that with **one click** I am finally able to commit all my changes **and** sync them to my GitHub repo.

A side effect of working with GitHub was the rediscovery of [the Markdown language](http://daringfireball.net/projects/markdown/), a minimal markup language used for all README files in GitHub. Being a **plain text** formatting syntax, no special editor is needed to write content using Markdown, although there are some specially-designed editors which preview markdown files with styles. For now I picked [Mou](http://mouapp.com/) a very nice markdown editor which provides instant preview side-by-side to the text being edited.

![Mou Editor](http://1000linesofcode.files.wordpress.com/2013/12/mou.png)

Coincidentally, just a few weeks ago, finally, [Wordpress has announced](http://1000linesofcode.wordpress.com/2013/12/29/perfect-timing-markdown-on-wordpress/) that they are now supporting GitHub's version of Markdown within the blog post editor! Perfect timing for me to really get addicted to this simple writing tool! Because Markdown is simple enough to learn in a few minutes, clean and elegant enough to be readable no matter your context, and it is becoming the defacto markup language of the Internet, at least among the slightly geekier types who do know markup languages :)

