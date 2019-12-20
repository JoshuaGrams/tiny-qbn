TinyQBN Quick-Reference
=======================

Declaring Cards
---------------

Tag passages with:

* `card` or `sticky-card` - use once vs. use many times.
* `req-expression` - must be matched to see cover.
* `also-expression` - must also be matched to see contents.
* `priority-nnn` - integer priority level: lower priority cards will be excluded from any selection containing higher-priority cards.

Expressions:

* `name` - `$name` or `_name` has a non-empty value.
* `not-expression` - expression has an empty value.
* `random-xx` - available xx percent of the time (integer percent).
* `name-op-number` - op is `eq`|`ne`|`lt`|`gt`|`le`|`ge`; use `_` for decimal point. 
* `priority-xx` - priority: signed integer: default is zero.

Checking variables:

* `<<range var threshold name threshold ...>>` - set `_name_var` to true for the name of the range (if any) that `$var` (or `_var`) falls into.

Manually manipulating the event deck:

* `<<addcard title sticky>>`
* `<<removecard title even_if_sticky=false>>`

Card Contents
-------------

* `<<card>>...cover...<<contents>>...contents...<</card>>`
* `<<choices var>><<when>>tags...<<offer>>contents...<</choices>>` - store a list of choices in `var`.
* `<<requirements card=QBN.current wrap=none separate="comma">>` - show requirements for a card or choice.
* `<<linkif condition title [linktext]>>` - display title (or
  linktext if given). If `condition` is truthy, make it a link to
  the given passage.

Selecting Cards
---------------

* `QBN.cards(limit=none)` - select available cards from the deck, up to limit.
* `QBN.filter(cards, limit=none)` - select from given passage list.
* `QBN.onlyHighest` - ignore lower priority cards, or just put them last?
* `<<fillhand $hand limit cards>>` - attempt to fill `$hand` to its `limit` with random selections from `cards`.
* `QBN.visible(card)` - should this card be visible (are its `req-` requirements met)?
* `QBN.available(card)` - should this card's contents be available? Both its `req-` *and* its `also-` requirements must be met.


Showing and Storing Cards
-------------------------

* `<<includecard card>>` - set `QBN.current` to `card` and then include it. SugarCube doesn't track the names of included passages, so this lets us do that. It nests properly in case you want to include cards inside cards.
* `<<includeall cards wrap="content" separate=none>>`

Then we have several helper macros which build on the above two:

* `<<cardlist cards wrap="content">>` - comma separated list.
* `<<cardrow cards wrap="contentbox">>`
* `<<cardcolumn cards wrap="contentbox">>`

Separators
----------

* `<<comma last>>`

Wrappers
--------

* `<<cover>>` and `<<coverbox>>`
* `<<content>>` and `<<contentbox>>`
* `<<linkto>>` and `<<linkbox>>`

These are called as `<<wrap card>>`, where `card` may be a passage title or a passage-like object (choice, etc.).
