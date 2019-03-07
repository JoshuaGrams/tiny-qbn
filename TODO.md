Code for StoryNexus-like Narratives
===================================

* `<<drawcards hand n passages>>`
* `<<card>>...<<contents>>...<</card>>` - choose by `_card_front`?
* Wrapper widget to display card fronts.
* Extend `QBN.passageMatches` to take a prefix string/regexp.
* `<<includeall>>` passes `available` to `wrap` widget.
	* Or sets `_card_available` if no wrapper?
	* Availability is `QBN.passageMatches` with `also-` prefix.
* Inline "cards" for choices...how?
	* Multiple cards in one macro, probably?
	* Where do we store the deck membership for these? `"passage -> choice"`?
	* Each one needs metadata and contents.
	* `<<choices>>[<<choice>>...<<contents>>...]*<</choices>>`?
	* first `<<choice>>` is optional.
	* content before initial `<<choice>>` is an error.
	* every `<<choice>>` must have `<<contents>>`.
* Add `<<requirements passage [wrap] [separate]>>` macro.
	* Calls `wrap` with requirement and met/not-met.
	* Calls `separate` with `last` flag.

<!-- vim:et
-->
