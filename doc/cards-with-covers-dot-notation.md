Card Covers with objects using dot notation in requirements
===========

This example is identical to [cards with covers](cards-with-covers.md). The only difference is that it uses objects within the card requirements rather than simple variables. Instead of `$strength`,  the characters stats are defined as an object in StoryInit: `<<set $pc = {'strength': 1, 'stealth': 1}>>`.

The individual properties of that object can be used in requirements using dot notation syntax. To access the `strength` property, you'd refer to it as `$pc.strength` (in requirements expressed using comment syntax) or `pc.strength` (in requirements expressed in tag syntax)

For example:

`::Card Title [card req-pc.strength-gte-2]`

or

``::Card Title\
/*QBN\
    sticky-card\
    req: $pc.strength gte 2\
    also: $pc.strength gte 3\	
*/``
