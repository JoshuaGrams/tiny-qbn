Three Ways to Track Progress
============================

There are lots of ways to track different stats or kinds of
progress in your story. Here are three techniques that I think are
particularly useful.

Overview
--------

If a progress variable represents some sort of measurement, it is
probably best stored as a number (months, miles/km, money, etc.).

If you have a linear or simply-branching arc that is spread out
over time but whose progress isn't synchronized with any other
arcs (e.g. an ongoing discussion with your neighbor), use
single-use cards, put only the first card in the deck, and add the
next card each time you advance or make a choice. So only one
storylet (the current one) from this arc is ever in the deck at a
time.

If variable represents story progress and several things are
happening in parallel, you *could* use a number.  But using
`<<progress "intro" "planning" "into the dungeon" ...>>` and
`<<advance>>` links allows you to insert (or remove) story beats 
without having to re-number things or to alter existing storylets
(unless that's required for narrative reasons, of course).


Measurements
------------

In the [Localvore example](tutorial-2.md), we have a year cycle
and a current month variable. In a story about a road trip, you
might track miles (km) to your destination or how long it has been
since your kid started needing a bathroom break and you still
haven't found a rest-room. If you are trying to earn a certain
amount of money (or give it all away before you die and your
greedy relatives descend), wealth might be a stat.

Most of these wouldn't make sense as anything other than a number.
And they have other qualities that indicate that a number would
work well.

Numbers are good for measurements that are unlikely to change
during development. You're not going to suddenly decide that there
are 13 months in the year. Or if you do, you *know* that's a major
change. Are you going to redistribute storylets from other months,
or create new ones from scratch? How are you going to deal with
references to things that happened "next month" or "last month"
now that there's a new month in between?

Or if you're dealing with money, you might change the goal to tune
the gameplay. But that won't change most of the storylets. You
might need to *have* enough money to buy in to an investment
opportunity, but that will stay the same whether your victory
condition is to earn one million or two million. You might have
story beats tied to particular milestones, but you can (and
definitely should) use a `<<range>>` check in your `PassageHeader`
for that:

	<<range "$goals" `.1*$win` "10pct" `.2*$win` "20pct" ...>>

And then tag the passage `req-_goals_50pct` and maybe `important`
or `urgent`.


Independent Story Arcs
----------------------

For linear or branching story arcs whose scenes may be spread out
over time, you may not need a progress variable at all.

Let's say you're having an ongoing discussion with an NPC. Put the
first storylet in the deck (tag it as a single-use `card`), and
give it the appropriate requirements (`req-martha_present` or
whatever). All later pieces of this discussion are passages with
requirements, but which are **not** tagged as `cards`, so they
aren't in the deck yet.

When you play this storylet, it will be removed from the deck, so
you won't see it again. If there is only one way forward, you can
just put `<<addcard [[next passage]]>>` somewhere in the body of the
card. If branching is available, each choice is a `<<link>>` back
to the "hub" where the player chooses between available storylets,
and this link adds the next card when followed.

	<<link [[hub passage]]>><<addcard [[next passage]]>><</link>>

You *could* write the passage names in quotes, but both `<<link>>`
and `<<addcard>>` allow you to write them as if they were normal
Twine links (with double square brackets). The Twine editor will
find those and draw arrows between the passages so you can see
that they are connected.

Here's an empty skeleton for an [avian
party](https://joshuagrams.github.io/tiny-qbn/examples/Floating%20Branches.html)
where you can jump between conversations with different birds, but
each conversation is its own simple branching arc.


Sequences of Named States
-------------------------

One other common pattern is to use a numeric variable to track
story progress. You generally use integer values, so you have step
1, 2, 3 and so on. Maybe step 1 is choosing your party members,
step 2 is planning and preparing, and on step 3 you enter the
dungeon.

It's easy to add new storylets to each phase whenever you want.
And it's simple to set up: initialize the variable to one (or
zero, if you prefer that), and add one to it every time you want
to advance. Then your storylets can require a particular value.

**But** you have to manually keep track of what the numbers mean.
And if you want to add or remove a step, you have to re-number all
the storylets which come after.

So I built a helper macro that tracks progress as a sequence of
named states. In your StoryInit passage, do:

	<<progress "$var" "first" "second" ... "last">>

This creates a fixed list of states. It is stored in SugarCube's
`setup` object so it won't get copied into your story history
every turn and slow down your game. It also does:

	<<set $var to "first">>

Then your storylets can ask to be `before`, `during`, or `after` a
particular state. Tag them with things like:

	req-var-during-third
	req-var-after-second
	req-var-before-last

To advance the variable, use a `<<link>>` back to the hub along
with my `<<advance "$var">>` macro, similarly to the technique for
independent story arcs:

	<<link [[hub passage]]>><<advance "$var">><</link>>

You can also `<<advance "$var" 3>>` or `<<advance "$var" -2>>` to
advance multiple steps or go backwards. It won't go off either end
of the list, so your variable will never go forward past "last" or
backward past "first".
