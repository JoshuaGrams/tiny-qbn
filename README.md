TinyQBN
=======

A simple toolkit for creating filtered-card-deck stories (aka
storylets or quality-based narratives or resource narratives) with
Twine 2 and SugarCube. Use Twine's passage tags to mark cards and
their requirements, and a couple of simple functions and macros to
select and display cards. Continue to use Twine links as usual
when those are the appropriate tool.


Adding TinyQBN to your Story
----------------------------

Copy the Story Javascript (the [minified](story-javascript.min.js)
or the [readable](story-javascript.js) version), the
[widgets](widgets.txt) (create a passage with a `widget` tag for
these) and optionally the [Story Stylesheet](story-stylesheet.css)
into your game. Click the "Raw" button when viewing these for
easier copy/pasting.


Documentation
-------------

There is a [quick-reference](doc/quick-reference.md) which gives a
brief overview of all the current features, and [my more
descriptive reference to the original features](doc/reference.md)
is also still available.

There are a bunch of walkthroughs demonstrating various features.

The video versions of these walkthroughs are in [a playlist on
YouTube](https://www.youtube.com/playlist?list=PLy3M_6DKN9joOGhUD1chHumc9aS6EZZ_F).

The text versions are in this repository, along with the resulting
code (both in the text-based Twee format and HTML versions which
you can download and import into Twine):

* [Getting Started with TinyQBN](doc/tutorial-1.md):
  [twee](examples/tutorial-1.tw),
  [html](https://joshuagrams.github.io/tiny-qbn/examples/tutorial-1.html).
* [Seasonally Available Items](doc/tutorial-2.md) (more complex
  conditions and a yearly loop structure):
  [twee](examples/tutorial-2.tw),
  [html](https://joshuagrams.github.io/tiny-qbn/examples/tutorial-2.html).
* [Single-Use Cards for Story Passages](doc/tutorial-3.md):
  [twee](examples/localvore.tw),
  [html](https://joshuagrams.github.io/tiny-qbn/examples/localvore.html).
* [Cards with Covers](doc/cards-with-covers.md):
  [twee](examples/covers.tw),
  [html](https://joshuagrams.github.io/tiny-qbn/examples/covers.html).
* [Inline Choices](doc/choices.md):
  [twee](examples/choices.tw),
  [html](https://joshuagrams.github.io/tiny-qbn/examples/choices.html).
* [Card Priority](doc/priority.md):
  [twee](examples/priority.tw),
  [html](https://joshuagrams.github.io/tiny-qbn/examples/priority.html).

The new features in this version of the library are:

* Creating two-part cards with a separate cover and contents
  within the same Twine passage. 
* Creating a list of card-like *choices* (which can be filtered by
  the current story state) within a single passage.
* Setting card priority to ensure certain cards are chosen or to
  exclude lower-priority cards altogether.
* Show a card's requirements to the player. This is still a little
  primitive, but it's there.

I also wrote some completely undocumented code to create stats
that improve as you use them, using the "Basic Ability" math from
StoryNexus. That code is split between [basic-ability.txt][] and
the "choice helpers" at the end of [widgets.txt][].


Rebuilding the Minified Javascript
----------------------------------

If you make changes to `story-javascript.js` and you want to
rebuild the minified version, you'll need
[Node.js](https://nodejs.org/) installed.

* Open a command-line window.
* Go to the folder where this `README.md` file is located (`cd blah/blah/blah`).
* Run the command `npm install` to download the necessary tools.
* `npm run build` will create the minified version of the story javascript.
* Once that's done, `npm run examples` will build the examples
  (assuming tweego is available).
