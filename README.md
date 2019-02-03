TinyQBN
=======

A simple toolkit for creating filtered-card-deck stories (aka
quality-based narratives or resource narratives) with Twine 2 and
Sugarcube. Cards can only depend on the presence or
emptiness/absence of variables. But it can create temporary
variables to indicate the range that numeric variables fall into
(`low_fuel`, `extreme_sobriety` and so on).


Adding TinyQBN to your Story
----------------------------

Copy the [Story Javascript](story-javascript.js) (or the [minified
version](story-javascript.min.js)) and [Story
Stylesheet](story-stylesheet.css) into your game.


Declaring Passage Requirements
------------------------------

To make passages visible to the QBN engine, tag single-use
passages with `card` and reusable passages with `sticky-card`. You
can add or remove cards at any time using `<<addcard "title"
[sticky?]>>` or `<<removecard "title">>`.

* A passage tagged with `req-variableName` requires the variable
  to have a non-zero non-empty value.

* A passage tagged with `req-not-variableName` requires the
  variable to be zero or empty or undefined.

* A passage can only be selected by the QBN engine if *all* of its
  requirements are met. This does *not* affect normal Twine links:
  you can link to any passage regardless of its requirements.

* Requirements ignore the initial sigil of the variable name, so
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

* You may not want to offer *all* available cards to the user. You
  can follow it with `.random()` to select a random cards or
  `.randomMany(3)` to select 3 random cards.

* `QBN.rangeTag(name, ["low", 30, "medium", 70, "high"])` will
  create a temporary variable `_low_name`, `_medium_name` or
  `_high_name` depending on the value of the variable. You can use
  any number of names and numbers in the range list, but you must
  start and end with a name and alternate names and numbers.
  
* You may want to call `QBN.rangeTag` several times in the special
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
