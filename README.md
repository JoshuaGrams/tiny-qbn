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


Tutorials and Examples
----------------------

There is a [quick-reference](doc/quick-reference.md) which gives a
brief overview of the current features.

I have a three-part walkhrough creating a simple
[setting](https://joshuagrams.github.io/tiny-qbn/doc/Localvore.html)
where you can drive around to different locations and see what
local seasonal food is available. This shows how to create basic
cards and requirements.

There are also a couple other walkthroughs demonstrating other
features.

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

This version of the library also allows you to:

* Create two-part cards with a separate cover and contents within
  the same Twine passage. 
* Create a list of card-like *choices* (which can be filtered by
  the current story state) within a single passage.
* Set card priority to ensure certain cards are chosen or exclude
  lower-priority cards altogether. I think I designed this wrong,
  but it might be useful anyway.
* Show a card's requirements to the player. This is still a little
  primitive, but it's there.

I also wrote some completely undocumented code to create stats
that improve as you use them, using the "Basic Ability" math from
StoryNexus. That code is split between [basic-ability.txt][] and
the "choice helpers" at the end of [widgets.txt][].

Declaring Cards
---------------

To make passages visible to the QBN engine, tag single-use
passages with `card` and reusable passages with `sticky-card`. You
can add or remove cards at any time using `<<addcard "title"
sticky=false>>` or `<<removecard "title" always=true>>` (pass
`false` as the optional second argument to remove only single-use
cards).

* Tags starting with `req-` are requirements which must all be met
  for the card to be visible.

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

* You can also do simple comparisons with `req-name-op-value`
  where `op` is one of `eq`, `ne`, `lt`, `gt`, `le` or `ge`
  (EQual, Not Equal, Less Than, Greater Than, Less than or Equal,
  Greater than or Equal). If `name` contains a numeric value, then
  an underscore in `value` will be converted to a decimal point
  (since you can't have punctuation in tags). Otherwise `value`
  will be treated as a string.

* If you have split cards (cover and contents), tags starting with
  `req-` only allow the cover to be visible. Tags starting with
  `also-` define more requirements which must also be satisfied in
  order to access the contents of a split card.


Selecting Available Cards
-------------------------

* `QBN.cards(limit)` will return an array of passage titles for
  all the cards which match the current game state.

* By default, you get *all* available cards: the `limit` argument
  tells the function to randomly select that many passages from
  the available list.

* Due to the way SugarCube's scripting works, you will probably
  have to enclose these function calls in backticks or a
  `<<script>>...<</script>>` block.

-----

* `<<range $name "low" 30 "medium" 70 "high">>` will
  create a temporary variable `_low_name`, `_medium_name` or
  `_high_name` depending on the value of `$name`.

* Each range starts at the lower value, so in the example above, a
  value of 30 would be medium rather than low.

* The range list can have as many names and numbers as you want,
  but you may never have two names in a row. If you begin or end
  the range list with a number, then it will not set a variable
  for numbers off that end of the range.

* You may want to put your `<<range>>` calls in the special
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
  list of passages, like SugarCube's built-in `<<include>>` macro
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

* `<<cover "name">>` is a wrapper which shows only the cover of
  split cards (or all of a plain card). `<<content>>` does the
  same for the content part.

* `<<linkto "name">>` is a wrapper which links to the passage instead of
  including it.

* `<<coverbox "name">>`, `<<contentbox "name">>` and `<<linkbox
  "name">>` are the same as `<<cover>>`, `<<content>>` and
  `<<linkto>>` except they draw a box around the card or the link.

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
* `npm run build` will create the minified version of the story javascript.
* `npm run examples` will build the examples.
