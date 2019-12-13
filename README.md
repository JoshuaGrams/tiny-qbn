TinyQBN
=======

A simple toolkit for creating filtered-card-deck stories (aka
quality-based narratives or resource narratives) with Twine 2 and
Sugarcube. Use Twine's passage tags to mark cards and their
requirements, and a couple of simple functions and macros to
select and display cards. Continue to use Twine links as usual
when those are the appropriate tool.

**Warning:** I'm doing a major refactoring on this branch to
support some StoryNexus inspired convenience features, so some of
this is out of date. Specifically the tutorials won't work as I
had to rename some macros and ended up removing others. Check out
the [Quick Reference](quick-reference.md) for a quick overview of
where I *think* I'm going with the new stuff. On the surface, not
that much has *really* changed, just enough to be annoying and
break things.


Adding TinyQBN to your Story
----------------------------

Copy the Story Javascript (the [minified](story-javascript.min.js)
or the [readable](story-javascript.js) version) and optionally the
[Story Stylesheet](story-stylesheet.css) and
[widgets](widgets.txt) (create a passage with a `widget` tag for
these) into your game. Click the "Raw" button when viewing these
for easier copy/pasting.


Tutorials and Examples
----------------------

So far I only have a single (*still*-not-quite-finished) example.
[Localvore](https://joshuagrams.github.io/tiny-qbn/doc/Localvore.html)
is a setting where you can drive around to different locations and
see what local seasonal food is available.

I have created a three-part tutorial walking through the creation
of this example. The (somewhat terrible) video versions are on
Youtube:

* [TinyQBN Playlist](https://www.youtube.com/playlist?list=PLy3M_6DKN9joOGhUD1chHumc9aS6EZZ_F)
* [Getting Started with TinyQBN](https://youtu.be/arMISohlYQk)
* [Seasonally Available Items](https://youtu.be/t7mReh08nYI)
* [Single-Use Cards for Story Passages](https://youtu.be/qBm7PtLYKdE)

The text versions are in this repository:

* [Getting Started with TinyQBN](doc/tutorial-1.md)
* [Seasonally Available Items](doc/tutorial-2.md)
* [Single-Use Cards for Story Passages](doc/tutorial-3.md)


Declaring Cards
---------------

To make passages visible to the QBN engine, tag single-use
passages with `card` and reusable passages with `sticky-card`. You
can add or remove cards at any time using `<<addcard "title"
sticky=false>>` or `<<removecard "title" always=true>>` (pass
`false` as the optional second argument to remove only single-use
cards).

* A passage tagged with `req-variableName` requires the variable
  to have a non-empty value (something other than zero, `false`,
  or the empty string).

* A passage tagged with `req-not-variableName` requires the
  variable to be empty (undefined, zero, `false`, or the empty
  string).

* A passage can only be selected by the QBN engine if *all* of its
  requirements are met. This does *not* affect normal Twine links:
  you can link to any passage regardless of its requirements.

* You *must* leave out the initial sigil from the variable name:
  `req-spoonerisms` will be satisfied if there is either a story
  variable `$spoonerisms` or a temporary variable `_spoonerisms`.

* Tagging a passage with `req-random-20` creates a requirement
  which has a 20% random chance of being satisfied (you can use
  any whole number between 1 and 99).

* You can also do simple comparisons with `req-name-op-value` where
  `op` is one of `eq`, `ne`, `lt`, `gt`, `le` or `ge`. If `name`
  contains a numeric value, then an underscore in `value` will be
  converted to a decimal point (since you can't have punctuation
  in tags). Otherwise `value` will be treated as a string.


Selecting Available Cards
-------------------------

* `QBN.cards(limit)` will return an array of passage titles for
  all the cards which match the current game state.

* By default, you get *all* available cards: the `limit` argument
  tells the function to randomly select that many passages from
  the available list.

* Due to the way Sugarcube's scripting works, you will probably
  have to enclose these function calls in backticks or a
  `<<script>>...<</script>>` block.

-----

* `QBN.range("$name", ["low", 30, "medium", 70, "high"])` will
  create a temporary variable `_low_name`, `_medium_name` or
  `_high_name` depending on the value of `$name`.

* Note the quotes and the sigil on the variable name here. You
  need both since this is a Javascript function.

* Each range starts at the lower value, so in the example above, a
  value of 30 would be medium rather than low.

* The range list can have as many names and numbers as you want,
  but you may never have two names in a row. If you begin or end
  the range list with a number, then it will not set a variable
  for numbers off that end of the range.

* You may want to put your `QBN.range` calls in the special
  `PassageHeader` passage so they get computed automatically at
  the beginning of every turn.


Displaying Selected Cards
-------------------------

* `<<card>>...cover...<<content>>...<</card>>` divides a card
  passage into two parts: you can display the part you want with
  the two macros below.

* `<<cover "name">>` will include a passage. If it has a separate
  cover section, only the cover will be displayed.

* `<<content "name">>` will include a passage only if both its
  visibility and availability requirements are met. If it is a
  single-use card, will remove it from the event deck. If it has a
  cover and contents, only the contents will be shown.

* `<<includeall passages wrap=null separate=null>>` will include a
  list of passages, like Sugarcube's built-in `<<include>>` macro
  but with multiple passages.

* The optional `wrap` argument should be the name of a widget
  which will be called with each passage title to display it.
  The default wrapper has the same behavior as the `<<card>>`
  widget described above.

* The optional `separate` argument should be the name of a widget
  which will be called with a flag indicating whether this is the
  last separator. It will be called between each two adjacent
  cards.

Then there are a bunch of helper widgets for common use cases. The
most useful of these are:

* `<<cardrow passages wrap="cardbox">>` displays a row of cards,
  each in a box with a background and border. Pass `"linkbox"` for
  links instead of contents.

* `<<cardcolumn passages wrap="cardbox">>` displays a column of
  cards in boxes. Pass `"linkbox"` for links instead of contents.

* `<<cardlist passages wrap="card">>` displays a comma-separated
  list of cards. Pass `"linkto"` for links instead of contents.

The widgets used to implement these are also available:

* `<<linkto "name">>` is a wrapper which links to the passage instead of
  including it.

* `<<cardbox "name">>` and `<<linkbox "name">>` are the same as
  `<<card>>` and `<<linkto>>` except they draw a box around the
  card or the link.

* `<<comma last?>>` is a separator: it will insert `" and "` for
  the last separator and `", "` otherwise.


Managing a Persistent "Hand" of Cards
-------------------------------------

You can save a list of cards to a variable with:

	<<set $hand to `QBN.passages(5)`>>

To remove a card, do:

	<<run $hand.delete("card title")>>

Refill the hand with:

	<<set $hand to $hand.concat(QBN.passages(5 - $hand.length))>>

But note that this may add duplicate cards (if it selects sticky
cards which are still in your hand). If you don't want duplicates,
you can create the hand *and* refill it with:

	<<fillhand $hand 5 `QBN.passages()`>>


Rebuilding the Minified Javascript
----------------------------------

If you make changes to `story-javascript.js` and you want to
rebuild the minified version, you'll need
[Node.js](https://nodejs.org/) installed.

* Open a command-line window.
* Go to the folder where this `README.md` file is located (`cd blah/blah/blah`).
* Run the command `npm install` to download the necessary tools.
* `npm run minify-js` will create the minified version of the story javascript.
* `npm run examples` will build the examples.
