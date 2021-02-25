TinyQBN
=======

A simple toolkit for creating filtered-card-deck stories (aka
storylets or quality-based narratives or resource narratives) with
Twine 2 and SugarCube. Use Twine's passage tags to mark cards and
their requirements, and a couple of simple functions and macros to
select and display cards. Continue to use Twine links as usual
when those are the appropriate tool.

Related Work
------------

As of version 3.2.1, Harlowe has storylets, using the
[`(storylet:)`](https://twine2.neocities.org/#macro_storylet) command to
define requirements for a passage and `(open-storylets:)` to get a list
of the open (available) storylets for display.

If you're comfortable with some JavaScript, David Masad's
[StoryletManager](https://github.com/dmasad/StoryletManager) adds
parameterized storylets to SugarCube, where the "same" storylet can
appear in different places (or even multiple times in the same place)
with different objects or characters filling certain roles.

Dan Cox's [SimpleQBN](https://github.com/videlais/simple-qbn) is a
JavaScript library for storylets that isn't tied to a particular story
format or to Twine at all.


New!
----

For easier editing, you can now put the TinyQBN "tags" in comments
in the passage itself:

	/*QBN card req-lizard-eq-Sam req-transformations-gt-2 */

If you use `req:` instead of `req-`, the rest of the line will be
treated as a TwineScript expression:

	/*QBN
	  card  req: $lizard eq "Sam"
	  req $transformations gt 2
	 */

I ran through the examples quickly and they all still *seem* to
work, but by all means let me know if I broke anything horribly.


Adding TinyQBN to your Story
----------------------------

Now you can simply [generate a blank TinyQBN
project](https://joshuagrams.github.io/tiny-qbn/examples/blank-project.html),
save it and import it into Twine.

Or you can add the library to a story manually: copy the Story
Javascript (the [minified](story-javascript.min.js) or the
[readable](story-javascript.js) version), the
[widgets](widgets.txt) (create a passage with a `widget` tag for
these) and optionally the [Story Stylesheet](story-stylesheet.css)
into your game. Click the "Raw" button when viewing these for
easier copy/pasting.


Documentation
-------------

* [Quick reference](doc/quick-reference.md).
* Older, more verbose [reference](doc/reference.md) (doesn't cover
  the newer features).

You may want to start with [Dan Cox](https://videlais.com/)'s new
_Working with TinyQBN_ articles: they give a clear overview of the
concepts and get you started by translating some examples from the Twine
Cookbook into QBN form:

* [Terms and Concepts](https://videlais.com/2020/09/05/working-with-tinyqbn-part-1-terms-and-concepts/)
* [Writing QBN Stories](https://videlais.com/2020/09/19/working-with-tinyqbn-part-2-writing-qbn-stories-using-twine-2-example/)
* ...and he has two more planned.

Or you can dive into my walkthroughs (video versions [on
YouTube](https://www.youtube.com/playlist?list=PLy3M_6DKN9joOGhUD1chHumc9aS6EZZ_F)):

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
* [Three Ways to Track Progress](doc/progress.md). This doesn't have a
  good example yet, but there is an "example" testing that the code
  works:
  [twee](examples/progress.tw),
  [html](https://joshuagrams.github.io/tiny-qbn/examples/progress.html).
* [Cards with Covers](doc/cards-with-covers.md):
  [twee](examples/covers.tw),
  [html](https://joshuagrams.github.io/tiny-qbn/examples/covers.html).
* [Inline Choices](doc/choices.md):
  [twee](examples/choices.tw),
  [html](https://joshuagrams.github.io/tiny-qbn/examples/choices.html).
* [Card Priority](doc/priority.md):
  [twee](examples/priority.tw),
  [html](https://joshuagrams.github.io/tiny-qbn/examples/priority.html).
* Dice Rolls: here's a quick example of doing Powered by the
  Apocalypse style dice rolls (roll 2d6 plus a stat modifier, 10+
  is success, 7-9 is mixed results, 6- "life is interesting"):
  [twee](examples/dice-rolls.tw),
  [html](https://joshuagrams.github.io/tiny-qbn/examples/dice-rolls.html).
* [Setting up Tweego and VSCode](doc/tweego.md) to build Twine stories
  from text files instead of using Twine's graphical editor.
* Weather the Storm is a small (around 2500 words?) complete story I
  wrote that fakes a parser-ish world model, using cycling links to
  enter verb/noun commands and storylets (with a how-many-conditions
  salience filter) to respond to them. The
  [source](https://github.com/JoshuaGrams/weather-the-storm) has its own
  GitHub repository, and you can [play
  it](https://joshgrams.itch.io/weather-the-storm) on itch.io.

I also wrote some completely undocumented code to create stats
that improve as you use them, using the "Basic Ability" math from
StoryNexus. That code is split between
[basic-ability.txt](./basic-ability.txt) and
the "choice helpers" at the end of [widgets.txt](./widgets.txt).


Status
------

This is still missing a good way to automatically display storylet
requirements to the player. That's...a *complicated* thing to do
in a generic library like this, and I may or may not ever figure
out how to do a good job of it.

And it hasn't been used for a real game/story, so it could have
hidden design flaws.

I believe that my examples exercise all the features, and
everything works there, but I don't have a proper test suite for
the code.

Other than that, I'm regarding this as feature-complete. I'd like
to add a bunch more documentation and examples, but that's not my
strong point, so it's slow going. There might also be a few more
convenience features I could add.

But I think this is about as far as it makes sense to go in Twine
without writing an entire new story format. And since Twine's
editor is not designed for this, if you're going that far you
might as well spend the time to bang together a more suitable
editor and make a full custom tool. My two cents, YMMV, etc.


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
