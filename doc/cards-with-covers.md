Card Covers
===========

You sometimes want to let players know that a storylet exists even
if they can't currently access it. You might want to give them
something to work towards or just let them know that there is more
to the story that they haven't seen on this playthrough.

And you could do this with two separate cards: one that has the
"cover" or "menu item" part, and another that has the actual
content. But with Twine's editor it's very tedious to have
separate passages like that. So I have set up some tools to let
you put both parts in a single passage.

For example, let's say that you encounter a scary beast, and you
can either back away slowly, or play dead and hope it doesn't eat
you. But if your `$strength` is high enough, you have the option
to subdue the beast and send it on its way. We won't show you that
option if you're very weak, but if you're nearly strong enough,
we'll let you know that you're getting close.

So. How about:

	You round a bend in the trail and come face to...chest with a
	four-legged monster that has horns like giant spaghetti
	servers. Or should that be antlers? Whatever they are, it
	shakes them angrily at you.

	<<includeall `QBN.cards().sort(QBN.alphabetically())` "coverbox">>

In a real game we would need to set some variables to exclude the
cards that don't apply to this scenario. And we would probably
just let the cards show up in a random order. But for this
demonstration we're going to be looking at these same options
several times, so it's nice to have them in a consistent order.

My `<<cover>>` and `<<coverbox>>` macros will set a `_qbn_cover`
temporary variable before including the card. And I have
`<<content>>` and `<<contentbox>>` macros which will remove
`_qbn_cover` (and will also remove the card from the deck if it's
not sticky). So now we can write a two-part card:

	::Back away slowly [sticky-card]
	<<if _qbn_cover>><<linkcontents>><<else>>\
	Moving slowly so as not to incite its hunting instincts, you
	tiptoe backwards until you can no longer see the beast.

	<<return>>
	<</if>>

My `<<linkcontents>>` macro will give the name of the current
card, and if all of its conditions are met, it will link to it.
Note that if you link to a card, there will be no temporary
variables set (i.e. no `_qbn_cover`) so you'll get the contents.
If we play the game, we can see the option and click on it. Let's
add another:

	::Play dead [sticky-card]
	<<if _qbn_cover>>\
	<<linkcontents "Play dead and hope it doesn't eat you">>\
	<<else>>\
	The better part of valor is discretion, in the which better
	part I have sav'd my life.
	--Falstaff

	You curl into a ball on the ground and like motionless. The
	beast snuffles you, but after a terrifying eternity, it
	wanders away, leaving you miraculously un-gored and
	un-trampled.

	<<return>>
	<</if>>

`<<linkcontents>>` can take an argument giving a string to use
instead of the card's name. It can also take a card title as the
second argument, in case you want to check the conditions on a
card other than the current one.

-----

OK. Now let's get to the meat of this example. We'll add a
StoryInit passage that initializes your `$strength` stat to 1.
And in the Start passage we'll show your current strength and
allow you to increase it so you can see the effects.

	Strength: $strength ([[increase strength->Start][$strength to $strength + 1]])

	-----

This is a SugarCube "setter" link. After the first closing bracket
you can put another set of square brackets, and put variable
definitions inside those, just like you'd pass to `<<set>>`. So
clicking this link will add one to your `$strength` and go to the
Start passage. Even though we're already there, we want to link to
it so it will get redisplayed to show the new strength and
re-select the cards.

Now we can define a card that requires some strength to be visible
and more strength for you to see its contents.

	::Very Strong [sticky-card req-strength-ge-2 also-strength-ge-3]
	<<if _qbn_cover>>\
	<<linkcontents "Use brute force">> (requires <<requirements>>)\
	<<else>>\
	You leap at the beast, screaming wildly, and grab its antlers.
	Or horns? Whatever. You wrench them to the side, driving it to
	its knees, and sit on its head. It attempts to get up, but
	doesn't have the leverage. When it seems properly cowed, you
	release it, and it saunters off into the brush, trying to
	pretend that it meant to do that all along.

	<<return>>
	<</if>>

As we've seen before, tags starting with `req-` define
requirements. They must all be met for `QBN.cards` to select the
card. So you won't even see the cover if a `req-` isn't met. But
now we also have tags starting with `also-`, which define
requirements that must be met for the card's *content* to be
available. These tags are checked by `QBN.available(cardTitle)`
which is used by `<<linkcontents>>` and by the `<<content>>` and
`<<contentbox>>` wrapper macros.

The other new thing here is the `<<requirements "title">>` macro,
which lists the requirements for a card (the current card if you
don't tell it otherwise).  If `$strength` is 2, the cover will be
visible but it won't have a link, because you need 3 strength to
use it. So we want to tell the user what they need.  This is
pretty primitive still: you can see that it shows both
requirements (strength 2 *and* strength 3) even though the first
one is redundant. And StoryNexus lets you use icons to show
requirements, and has tooltips, and such. So I have a ways to go
here. But it's a start.
