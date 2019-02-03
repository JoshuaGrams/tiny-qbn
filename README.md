TinyQBN
=======

A simple toolkit for creating filtered-card-deck stories (aka
quality-based narratives or resource narratives) with Twine 2 and
Sugarcube. Use Twine's passage tags to mark cards and their
requirements, and a couple of simple functions and macros to
select and display cards. Continue to use Twine links as usual
when those are the appropriate tool.


Adding TinyQBN to your Story
----------------------------

Copy the Story Javascript (the [minified](story-javascript.min.js)
or the [readable](story-javascript.js) version) and [Story
Stylesheet](story-stylesheet.css) into your game.


Declaring Cards
---------------

To make passages visible to the QBN engine, tag single-use
passages with `card` and reusable passages with `sticky-card`. You
can add or remove cards at any time using `<<addcard "title"
[sticky?]>>` or `<<removecard "title">>`.

* A passage tagged with `req-variableName` requires the variable
  to have a value which is not zero, `false`, or the empty string.

* A passage tagged with `req-not-variableName` requires the
  variable to be undefined, zero, `false`, or the empty string.

* A passage can only be selected by the QBN engine if *all* of its
  requirements are met. This does *not* affect normal Twine links:
  you can link to any passage regardless of its requirements.

* You *must* leave out the initial sigil from the variable name:
  `req-spoonerisms` will be satisfied if there is either a story
  variable `$spoonerisms` or a temporary variable `_spoonerisms`.

* Tagging a passage with `req-random-20` creates a requirement
  which has a 20% random chance of being satisfied (you can use
  any whole number between 1 and 99).


Selecting Available Cards
-------------------------

* `QBN.passages(extraVars)` will return an array of [Passage
  objects](http://www.motoslave.net/sugarcube/2/docs/#passage-api)
  for all the cards which match the current game state. You may
  optionally pass an object with extra variables which will be
  used to satisfy requirements (e.g. `{personality_trait: true}`
  to select only personality trait cards).

* Due to the way Sugarcube's scripting works, you will probably
  have to enclose these function calls in backticks or a
  `<<script>>...<</script>>` block.

* You may not want to offer *all* available cards to the user, so
  you can use `.random()` on the array to select a random card or
  e.g. `.randomMany(3)` to select 3 random cards.

-----

* `QBN.range("$name", ["low", 30, "medium", 70, "high"])` will
  create a temporary variable `_low_name`, `_medium_name` or
  `_high_name` depending on the value of `$name`.

* Note the quotes and the sigil on the variable name here. You
  need both since this is a Javascript function. Hmm...I wonder if
  I could make this a Sugarcube macro instead?

* Each range starts at the lower value, so in the example above, a
  value of 30 would be medium rather than low.

* The range list can have as many names and numbers as you want,
  but you must start and end with a name, and alternate names and
  numbers.

* You may want to put your `QBN.range` calls in the special
  `PassageHeader` passage so they get computed automatically at
  the beginning of every turn.


Displaying Selected Cards
-------------------------

* `<<includecards passages style>>` will include a list of
  passages, like Sugarcube's built-in `<<include>>` macro but with
  multiple passages.

* `<<linkcards passages style>>` will create links to the
  passages, using their names as the link texts.

* In both cases, the `style` argument is optional.

* Giving no style or `"vertical"` will stack them vertically,
  giving each one a subtle background and border so you can tell
  they are cards.

* A `"horizontal"` style will lay them out side-by-side, again
  with a background and border.

* Passing `"separator:xxx"` will print them as plain text with
  "xxx" between passages or links (use any text you like here).

* When using a `", "` separator the last occurrence will be
  replaced with `" and "` so you get the usual comma separated
  list (without a serial comma: you'll have to change the
  Javascript if you want that).


Rebuilding the Minified Javascript
----------------------------------

If you make changes to `story-javascript.js` and you want to
rebuild the minified version, you'll need
[Node.js](https://nodejs.org/) installed.

Open a command-line window, go to the folder where this
`README.md` file is located, and run the command `npm install` to
download the necessary tools.  Then the command `npm run build`
will create the minified version of the story javascript.
