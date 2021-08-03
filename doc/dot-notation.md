Using objects in requirements
===========

It is possible to use object properties within card requirements. In this example, the player characters stats are defined an object in StoryInit using `<<set $pc = {'strength': 1, 'stealth': 1}>>`.

The individual properties of that object can be used in requirements using dot notation syntax. To access the `strength` property, you'd refer to it as `$pc.strength` (in requirements expressed using comment syntax) or `pc.strength` (in requirements expressed in tag syntax)

For example:

`::Card Title [card req-pc.strength-gte-2]`

or

``::Card Title\
/*QBN\
    sticky-card\
    req: $pc.strength gte 2\
*/``
