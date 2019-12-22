Card Priority
=============

Following StoryNexus's lead, we have three levels of card
priority: normal, important, and urgent.

Let's demonstrate this with a shopping list. We'll use a set of
choices stored in the temporary variable `_shopping_list`. For our
normal choices, we will skip the `<<when>>tags` section.
`<<choices>>` will automatically add a `card` tag, and then we'll
display them as pure covers so they don't get removed from the
deck. So in the Start passage, we'll write:

	<<choices _shopping_list>>
		<<offer>>eggs
		<<offer>>bread
		<<offer>>cheese
		<<offer>>potatoes
		<<offer>>spinach
	<</choices>>\
	You buy <<includeall `QBN.filter(_shopping_list)` "cover" "comma">>.

I want to demonstrate the difference between what happens when you
ask for a limited selection versus when you ask for all available
cards. So make a StoryInit passage and say:

	<<set $limit to false>>

Then at the top of Start:

	<<listbox "$limit" autoselect>>
		<<option "Show the full list" false selected>>
		<<option "Show three items from the list" 3>>
	<</listbox>>
	[[Update List->Start]]

And change `<<includeall>>` to use `QBN.filter(_shopping_list, $limit)`.

If you play the story, you'll see that it shows a list of three
items or all five, and either way they'll be shown in a random
order.

-----

Now let's add some important items. If you tag a card with
`important` it will be selected before normal items. Let's make it
so you can add or remove these items on the fly to see what
happens. In StoryInit (you may have to restart your story to make
these take effect):

	<<set $carrots to false>>

Then in Start, after the `<</listbox>>`:

	<label><<checkbox "$carrots" false true `$carrots?"checked":""`>> Don't forget the carrots!</label>

Notice the **single** less-than and greater-than on `<label>`
since it's an HTML tag and *not* a SugarCube macro.

Since SugarCube's checkboxes don't have an autoselect option like
the listbox, we're using a JavaScript snippet to decide whether it
should be checked initially (based on the current value of the
`$carrots` variable). This is usually called the ternary operator:
you write `condition ? true-result : false-result`. A lot of
people *strongly* recommend avoiding this, claiming it's hard to
read, but it basically just uses "?" and ":" to say "if" and
"else", and it's handy for writing tiny conditional values like
this. So you can make up your own mind whether or not you like it.

We'll add the corresponding choice at the top of the list:

	<<when>>important req-carrots<<offer>>carrots

And play the story again. If you check the carrots checkbox and
update the list, you'll see that the it is always at the start of
the list and then the normal ones come afterwards. If you ask for
only three items, you'll always get the important items and two
random normal ones.

-----

Notice that we're turning off the *availability* of the card, not
its *importance*. This is a little more complicated, but I'll show
that as well.

In StoryInit, add:

	<<set $milk to true>>

Near the top of Start, copy the checkbox code and replace carrots
to milk. Then add a new choice after carrots:

	<<when>>important<<offer>>milk

And then after we define `<<choices>>` we'll update its importance
based on the `$milk` variable (we need to wait until the choice
exists):

	<<set _milk_priority to $milk? "important" : "normal">>\
	<<cardpriority `_shopping_list[2].title` _milk_priority>>\

JavaScript numbers the elements of an array or sequence (like
`_shopping_list`) starting at zero. So because milk is the third
element, its index is 2.

Now milk will always be available, but when you make it important,
it will jump to the start of the list. If both carrots and milk
are important, they will be in a random order, but they'll always
be before the normal-priority choices.

-----

Urgent cards must be dealt with immediately: they block out all
important and normal cards. So let's say that you have a baby who
is hungry, but you're out of food, so you get just that one item
and leave immediately:

	<<when>>urgent req-random-50<<offer>>baby food, then hurry home to feed her.

When this item is available (about half the time), it will be the
only one in the list. Otherwise updating the list will act just as
it did before.

Also note that urgent cards only exclude non-urgent cards *from
that particular selection*. If we made another selection of, say,
the employees who were working the registers at the store that
day, that would be unaffected.
