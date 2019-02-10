Things to Test/Fix
==================

* QBN.passages
    * Cards vs. no cards.
    * Matching vs. no matches.
    * `extraVars` vs. no `extraVars` vs. empty `extraVars`.
    * `random-##`
    * Comparisons: eq/lt/gt/le/ge succeed/fail with numbers/strings.
    * Error handling? Do we need any?

* QBN.range
    * ~~Error handling if variable not found.~~
    * ~~Error handling if non-simple variable name or missing sigil.~~
    * ~~Error handling if invalid range.~~
    * ~~Error if range values do not increase.~~
    * ~~`["low", 50, "high"]`~~
    * ~~Range spec with lots of values.~~

* `<<includeall passages wrapper_widget="card">>`
	* ~~Widgets for column, row, comma-separated.~~
	* ~~Use `Macro.has(wrapper_widget)` to check for existence of widget.~~

* `<<addcard>>`
    * ~~Add single-use card (twice).~~
    * ~~Add sticky card (twice).~~
    * ~~Error handling if passage doesn't exist.~~

* `<<removecard>>`
    * ~~Remove single-use card (twice).~~
    * ~~Remove sticky card (twice).~~
    * ~~Error handling if passage doesn't exist.~~

<!-- vim:et
-->
