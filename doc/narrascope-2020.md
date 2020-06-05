Resources from NarraScope talk 2020
===================================

Cat Manning and I gave a talk [Making Storylets Work for You: How to Build a Quality-Based Narrative](https://narrascope.org/pages/schedule.html#WednesdayB) at NarraScope 2020, where she talked about narrative design and I talked about implementation using tinyQBN (my storylets library for Twine/SugarCube). This is a list of resources that were mentioned in the ensuing discussion (or that I've added afterward).

On the [NarraScope Discord](https://discord.gg/DPQYuDV), the Q&A for the talk starts [about here](https://discord.com/channels/590565562334052352/701244748635045959/717808385428291635).


Code Examples from the Talk
---------------------------

These are very skeletal: due to...well, 2020...we didn't nail things down until the last minute so there's not a *lot* more there than we showed in the talk. But I think all the tricky code bits are here. You can save these pages, import them into Twine, and peruse the code at your leisure:

[Floating Branches](https://joshuagrams.github.io/tiny-qbn/examples/Floating%20Branches.html) shows my take on code structure for the "party" idea: multiple branching conversations that the player can switch between and choose which ones to follow up when. This could be expanded with requirements on the storylets so you can't follow a particular conversation further until you've seen some other thing, or have conversations that don't start until a certain time, or after another event, or whatever.

[The Sprawl example](https://joshuagrams.github.io/tiny-qbn/examples/sprawl.html) looking at how you might implement a cyberpunk mission inspired by [Hamish Cameron's Powered by the Apocalypse tabletop RPG](http://apocalypse-world.com/pbta/games/title/The_Sprawl).


Storylets Tools
---------------

Harlowe's author is [adding storylet support](https://bitbucket.org/_L_/harlowe/commits/0751b7212e7c5990cb414a063edbfd1620deec68). This is not in the released version (3.1.0), but will presumably be in the next release.

AW Freyr's [Hybrid Choices](https://intfiction.org/t/hybrid-choices-version-7-not-on-line/44319/2) extension for Inform 7 is for making choice-based sections in your parser games, but has a concept of "pages" that can be linked together in branching paths or have requirements. I didn't explore it too deeply, but from reading the documentation and playing around a bit, it seems like it has everything you need for basic storylets.

There was also some discussion of whether tinyQBN might benefit from expanding into a full Twine story format:

* The IFTF released [three Twine specifications](https://github.com/iftechfoundation/twine-specs/) in February: one defines story formats, one defines the HTML output (Twine stories), and one defines Twee 3 (a format for writing Twine stories in text files rather than the graphical editor).

* Dan Cox has a [tutorial on creating your own Twine 2 Story Format](https://videlais.com/2020/02/28/creating-your-own-twine-2-story-format-part-1-understanding-twine-2-html-structures/) and also a basic experimental story format called [Daelog](https://videlais.com/2020/02/28/creating-your-own-twine-2-story-format-part-1-understanding-twine-2-html-structures/) that uses tags and runs things through Tracery to generate text.

Em Lazer-Walker said "Some day I'd love to get back to some of the scripting language work that emerged out of my research at MIT, which had a lesser goal of combining a storylet system with a more traditional directed node graph (a la Twine, etc). The idea being that there are elements of interactive narrative that storylets are really good at effectively communicating, and some other things that more rigid systems can communicate more elegantly, and giving you versions of each with a solid way for them to interplay with each other would give you the best of both worlds." [Storyboard](https://github.com/lazerwalker/storyboard) (pre-alpha) is on GitHub.


Other Resources
---------------

Emily Short's [Storylets talk at the London IF Meetup](https://www.youtube.com/watch?v=0zDXcVc5zv0) is 94 minutes long, but a great overview along with a collaborative exercise showing one way to get started designing with storylets: well worth the watch.

Emily's blog also has a series of articles on storylets and reasoning about story state from the turn of 2019.

* [Narrative States](https://emshort.blog/2019/11/23/narrative-states/)
* [Storylets: You Want Them](https://emshort.blog/2019/11/29/storylets-you-want-them/)
* [Storylets Play Together](https://emshort.blog/2019/12/03/storylets-play-together/)
* [Pacing Storylet Structures](https://emshort.blog/2020/01/21/pacing-storylet-structures/)
* [Mailbag: Development Process for Storylet-Based Interactive Fiction](https://emshort.blog/2020/02/18/mailbag-development-process-for-storylet-based-interactive-fiction/)

Asked about games that use storylets particularly well, Cat said, "that's the thing, I think a lot of them use storylets interestingly. For me, the ideal is "games that use their presentation of storylets to amplify a larger theme in the game". So Bruno Dias' [Voyageur](https://brunodias.itch.io/voyageur) fits that well for me, and while Firewatch feels outside my scope, they do interesting work with storylets firing as you move through the environmental space.

Cat also mentioned Max Kreminski and Melanie Dickinson's upcoming [Why Are We Like This](https://twitter.com/maxkreminski/status/1243247010825654273) (tweet showing a screenshot) as an interesting example of storylet use.

Max Kreminski suggested Jon Manning's GDC talk [Compiling Your Story: Using Techniques from Compiler Design to Check Your Narratives](https://schedule2019.gdconf.com/session/compiling-your-story-using-techniques-from-compiler-design-to-check-your-narrative/861033) as a possible source for ideas on testing complex narrative structures. Jon Manning is a dev on [Yarn Spinner](https://yarnspinner.dev/) (used for Night in the Woods?). It looks like the video is only in the GDC Vault, not on YouTube, but he gave the same (?) talk at [linux.conf.au](https://linux.conf.au/schedule/#thursday) and that video is on [archive.org](https://archive.org/details/lca2020-Compiling_Your_Story_Using_Techniques_from_Compiler_Design_to_Check_Your_Narrative).

Max also has a very short paper [Storylets: Sketching a Map of the Storylets Design Space](https://mkremins.github.io/publications/Storylets_SketchingAMap.pdf) which attempts to start describing the differing capabilities of storylet systems.

Bruno Dias has a blog article [Attempted: Building a General-Purpose QBN System](https://brunodias.space/2017/05/30/an-ideal-qbn-system/index.html) talking about attempting to expand Voyageur's engine into a general-purpose tool, why he abandoned the attempt and notes on his thinking on what the pieces of a narrative engine are and what some of the difficulties might be.
