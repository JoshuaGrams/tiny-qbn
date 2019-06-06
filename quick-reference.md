TinyQBN Quick-Reference
=======================

**Warning:** some of this isn't implemented yet, or is implemented but not tested. I wrote it as a design sketch so I could see all the features in one place.

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

Checking variables:

* `QBN.range(var, [threshold, name, threshold, ...])` - set `_name_var` to true for the name of the range (if any) that `$var` (or `_var`) falls into.

Manually manipulating the event deck:

* `<<addcard title sticky>>`
* `<<removecard title even_if_sticky=false>>`

Card Contents
-------------

* `<<card>>...cover...<<contents>>...contents...<</card>>`
* `<<choices name extraVars=none limit=none>><<when>>tags...<<offer>>contents...<</choices>>`
  * Also has sub-tags `<<wrap widget_name>>` and `<<separate widget_name>>`.
* `<<requirements wrap separate>>` - show requirements for current card or choice. Not yet implemented, but I *think* I know how.

Selecting Cards
---------------

* `QBN.passages(extraVars=none, limit=none)` - select available cards from deck, up to limit.
* `QBN.filter(passages, extraVars=none, limit=none)` - select from given passage list.


Showing and Storing Cards
-------------------------

* `<<fillhand $hand limit cards>>` - attempt to fill `$hand` to its `limit` with random selections from `cards`.
* `<<includeall cards wrap="content" separate=none>>`
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

These are called as `<<wrap card>>`, where:

* `card` may be a passage title or a passage-like object (choice, etc.).
* `_qbn_available` is a flag that tells whether the "also" conditions are met (i.e. should the card contents be available?).
