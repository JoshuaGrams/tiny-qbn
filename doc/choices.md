Inline Choices
==============

Sometimes you want to offer a set of choices, and you want to
filter them like cards, but you know those options will only ever
be used in that one place. You *could* make a card for each
option, and set/require a variable unique to the passage where
they belong (hrm, I should implement `req-passage-<title>`). But
if you have a fixed deck of choices it's a bit nicer to have them
and their conditions all in one place.

So I added a `<<choices>>` macro which lets you make a bunch of
temporary cards inside a single passage and store the resulting
deck in a variable. To define a choice you say `<<when>>tags`
followed by `<<offer>>contents`. If you don't specify `card` or
`sticky-card`, it will automatically add `card`.

	<<choices _my_choices>>
		<<when>>sticky-card
		<<offer>>[[Procrastinate->Start]]
		/* etc... */
	<</choices>>
	<<cardrow `QBN.filter(_my_choices)`>>

To display the choices, we use `QBN.filter(deck, limit=none)`.
This works like `QBN.cards(limit)` except that it takes a deck of
cards instead of searching all passages. Here we're showing all
the matching choices, but we could have said ``<<cardrow
`QBN.filter(_my_choices)` 3>>`` to tell it to randomly select 3
choices if it more than that are available.

There's no way to link to one of these temporary cards. I could
possibly come up with a way to do that, but I'm not sure it's
worth it. This *does* mean that you still have to make a separate
passage for the *result* of each choice, so if you're working in
the Twine editor it's still a lot of clicking around. But you
can't nest cards forever: you'll want to break out into a new
passage at some point. And this way you'll tend to use Twine links
so the editor can show you the connections. I dunno. Maybe there's
a better way, but I experimented with several things and this is
the one that I settled on for now.

So. Let's add a couple of stats and a couple more choices. In
StoryInit:

	<<set $stat_points to 1>>
	<<set $stealth to 0>>
	<<set $strength to 0>>

Then at the top of Start we'll let you spend your stat point.
We're going to use setter links again, but use some knowledge of
JavaScript to change *two* variables at once. In JavaScript you
can follow a variable name by `++` or `--` to increment or
decrement it (actually, you can put the `++` or `--` before the
variable too, and though there are some subtle differences, it
works the same in most situations). And a semicolon is used to end
one statement and start another one.

	Stat Points: $stat_points
	Stealth: $stealth<<if $stat_points gt 0>> ([[increase->Start][$stealth++; $stat_points--]])
	Strength: $strength<<if $stat_points gt 0>> ([[increase->Start][$strength++; $stat_points--]])

Now we're ready to add more choices:

	<<when>>sticky-card req-stealth-gt-0 <<offer>>[[Sneak Past]]

And the corresponding passage (note that this isn't a card, just
an ordinary passage):

	::Sneak Past
	A heated argument at one of the stalls distracts the guard
	briefly. You take advantage of his lapse in attention to sneak
	past.

This will be visible only if you bought stealth. Now, as I said,
there's no way to link to a choice, so I don't *think* there's
ever any point in having a choice with cover and contents. But the
`also-` requirements are still sometimes useful. Using my
`<<linkif>>` widget we can make the strength card always visible,
but only link to something else if the `also-` requirements are
met.

	<<when>>sticky-card also-strength-gt-0
	<<offer>><<linkif `QBN.available(QBN.current)` "Bash the Guard">>

That's `<<linkif condition title linktext>>` where `linktext` is
optional. Then of course we need the passage:

	::Bash the Guard
	You bash the guard over the head (that'll teach him to wear
	his helmet) and saunter past as he collapses.
