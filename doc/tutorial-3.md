Single-Use Cards for Stories
============================

Since [last time](tutorial-2.md), I have added a bunch of products
to each of the business locations. All of the animal products at
Anderson's Farm are available year-round, but they each have a 90%
chance of occurring, so often they'll be "out of stock" of one or
two of them. I think that was the only interesting technique I
used.

-----

So far we have used exclusively sticky cards, to represent
physical objects and locations. But for pieces of story, you'll
more typically use single-use cards so you don't show individual
stories more than once. Let's do some of that: we'll add some
flavor text about what other customers are doing.

As with the current product listing, we'll re-use the code for all
the businesses. Create a passage called "product story".

	<<set _productstory to true>>\
	<<set _storycards to QBN.cards(1)>>\
	<<unset _productstory>>\

The argument to `QBN.cards` tells it to randomly select that many
cards (if possible) instead of returning all of them.  Then if we
found a story, we display it.

	<<if _storycards.length>>
	<<includeall _storycards>>
	<</if>>

Now we'll include this passage in all three businesses, and test
that it works with no stories.

And then let's add some stories about broccoli. Start by opening
the broccoli passage and setting a temporary variable that we can
match against: `<<set _broccoli to true>>`. Then create a new
passage, tag it with `card`, `req-productstory` and
`req-broccoli`. We could also say `req-location-eq-fairweather`,
but since they're the only ones selling broccoli I'll leave it
out. Then let's write the contents:

	A woman in her 60s stops short. Is that organic broccoli? Look
	at that //color//! That's the most beautiful broccoli I've
	ever seen! I'll have to buy some for my dog: he //loves//
	broccoli.

We'll also give the passage a title for the sake of easy
identification. Let's test that. Drive to Fairweather in January:
there should be no broccoli and no story. Go back home, advance to
April, then go back to Fairweather. There should now be broccoli
and the story should show up. Since it's a single-use card it
should only show up once. So if we start to drive away and then
get back out of the car, there should still be broccoli but no
story.

Let's add a couple more:

	A large black pickup truck parks outside and a
	broad-shouldered man in a torn sweatshirt enteres the store.
	"Oh good, they //do// have broccoli today. I got a nice piece
	of sharp cheddar at Anderson's and I'm craving cream of
	broccoli soup."

And:

	A young couple meanders through the store. One turns to the
	other. "How about we make beef and broccoli tonight? We have
	those steak tips in the fridge that we need to use."

Now those cards can be randomly shown (once each) any time when
there is broccoli. You could also make stories about dishes that
need multiple ingredients: broccoli-spinach quiche, or kale-potato
soup. Just remember to set temporary variables in each ingredient
card so you can tell when they're available.

I'll flesh this out with some more stories, but I think this is
about as far as I'm going to take this example. Hopefully it's
enough to get you started even though it's still just a setting
rather than a story with any kind of plot.

[The full example](https://joshuagrams.github.io/tiny-qbn/doc/Localvore.html).
