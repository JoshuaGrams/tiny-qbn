/*
TinyQBN: quality-based narratives in Twine 2 & Sugarcube.

Copyright 2019 Joshua I. Grams <josh@qualdan.com>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

State.initPRNG()

// Functions and fixed data.
var QBN = {}
window.QBN = QBN

var getVar = State.getVar || Wikifier.getValue
var setVar = State.setVar || Wikifier.setValue

// State that may change from turn to turn
// (i.e. needs to be recorded in the history).
setVar('$QBN', {type: {}, priority: {}})

// Remove single-use cards when visited.
$(document).on(':passagestart', function(evt) {
	QBN.current = evt.passage.title
	passageType(evt.passage, false)
})

function toArgument(title) {
	if(typeof title === 'object') title = title.title
	if(typeof title === 'string') return JSON.stringify(title)
	else throw new Error('Cards must be referred to by title (got ' + (typeof title) + ').')
}

function toPassage(card) {
	if(typeof card === 'object') {
		// Was [[link]], use title.
		if(card.link && card.text) card = card.link;
		else return card  // Assume choice or other passage-like object.
	}
	if(typeof card !== 'string') {
		throw new Error('Cards must be referred to by title (got ' + (typeof card) + ').')
	} else {
		if(Story.has(card)) return Story.get(card)
		let path = JSON.parse(card)
		let t = path[0], v = path[1], i = path[2]
		if(passage() === t) {
			let choices = getVar(v)
			if(choices != null && choices[i] != null) {
				return choices[i]
			}
		}
		throw new Error('No such passage or choice "'+card+'".')
	}
}

// Returns previous type: "card", "sticky-card", or false.
// Optionally changes passage type: null to remove,
// false to remove only single-use cards.
function passageType(p, newType) {
	var baseType
	if(p.tags.indexOf('sticky-card') >= 0) baseType = 'sticky-card'
	else if(p.tags.indexOf('card') >= 0) baseType = 'card'
	else baseType = false

	var types = getVar('$QBN').type
	var oldType = types[p.title]
	if(oldType === undefined) oldType = baseType

	if(newType !== undefined && newType !== oldType) {
		switch(newType) {
			case null:
				types[p.title] = false
				break
			case false:
				if(oldType === 'card') types[p.title] = false
				break
			default:
				if(newType === baseType) delete types[p.title]
				else types[p.title] = newType
		}
	}

	return oldType
}

function shuffle(a) {
	let i = a.length
	while(i > 0) {
		let t, j = Math.floor(i-- * Math.random())
		t = a[i];  a[i] = a[j];  a[j] = t
	}
	return a
}

QBN.alphabetically = function(a, b) {
	if(a == null || b == null) {
		let msg = "QBN.alphabetically seems to be missing an argument."
		msg += " If you wrote .sort(QBN.alphabetically()) you'll want to"
		msg += " remove the empty set of parentheses so you're passing the"
		msg += " function itself, not calling it and passing its return value."
		throw new Error(msg)
	}
	a = toPassage(a).title.toLowerCase()
	b = toPassage(b).title.toLowerCase()
	return a<b ? -1 : (a>b ? 1 : 0)
}

// Choose `count` random values from `array`.
function choose(array, count) {
	if(count == null || count === false) return shuffle(array)
	// Can't choose more values than the array has (or less than 0).
	count = Math.max(0, Math.min(count, array.length))
	// If choosing more than half the array, *exclude* random values.
	var n = Math.min(count, array.length - count)
	var include = (n == count)
	// Choose `n` random indices.
	var selected = [], indices = {}, chosen = 0
	while(chosen < n) {
		var i = Math.floor(State.random() * array.length)
		// Don't choose the same one twice.
		if(indices[i] === undefined) {
			if(include) selected.push(array[i])
			indices[i] = true
			++chosen
		}
	}
	// If excluding values, we build the output afterwards.
	if(!include) {
		for(i=0; i<array.length; ++i) {
			if(indices[i] !== true) selected.push(array[i])
		}
		shuffle(selected)
	}
	return selected
}

// Optionally changes passage priority: 'urgent/important/normal'.
function passagePriority(p, newPriority) {
	var basePriority
	if(p.tags.indexOf('urgent') >= 0) basePriority = 'urgent'
	else if(p.tags.indexOf('important') >= 0) basePriority = 'important'
	else basePriority = 'normal'

	var priorities = getVar('$QBN').priority
	var oldPriority = priorities[p.title]
	if(oldPriority === undefined) oldPriority = basePriority

	if(newPriority !== undefined && newPriority !== oldPriority) {
		if(newPriority === basePriority) delete priorities[p.title]
		else priorities[p.title] = newPriority
	}

	return oldPriority
}

Macro.add('cardpriority', {
	handler: function() {
		var p = toPassage(this.args[0])
		passagePriority(p, this.args[1])
	}
})

function select(filter, n, onlyHighest) {
	// Filter cards into passages.urgent/important/normal.
	let passages = {}
	filter(function(p) {
		p = toPassage(p)
		if(QBN.visible(p)) {
			let priority = passagePriority(p)
			if(!passages[priority]) passages[priority] = []
			passages[priority].push(p)
		}
		return false
	})
	// Select cards from the available set.
	let chosen
	if(passages.urgent) {
		// Urgent cards exclude normal and important ones.
		chosen = choose(passages.urgent, n)
	} else {
		// Important cards are chosen before normal ones.
		if(passages.important) {
			chosen = choose(passages.important, n)
			if(n) n -= chosen.length
		} else {
			chosen = []
		}
		// Normal cards fill out any remaining spaces.
		if(passages.normal) {
			chosen = chosen.concat(choose(passages.normal, n))
		}
	}
	// You can't store Passages in a SugarCube variable (the
	// history code breaks them) so store passage titles instead.
	// Titles are smaller anyway.
	for(var i=0; i<chosen.length; ++i) chosen[i] = chosen[i].title
	return chosen
}

QBN.filter = function(passages, n) {
	let filter = passages.filter.bind(passages)
	return select(filter, n)
}

QBN.cards = function(n) {
	let filter = Story.lookupWith.bind(Story)
	return select(filter, n)
}

var operators = {
	eq: function(a, b) { return a == b },
	ne: function(a, b) { return a != b },
	lt: function(a, b) { return a < b },
	gt: function(a, b) { return a > b },
	le: function(a, b) { return a <= b },
	ge: function(a, b) { return a >= b },
	before: function(a, b, name) {
		return QBN.progress(name, a) < QBN.progress(name, b)
	},
	during: function(a, b, name) {
		return QBN.progress(name, a) === QBN.progress(name, b)
	},
	after: function(a, b, name) {
		return QBN.progress(name, a) > QBN.progress(name, b)
	}
}

var operatorNames = {
	eq: 'to be', ne: 'not to be',
	lt: 'to be less than', le: 'to be at most',
	gt: 'to be greater than', ge: 'to be at least'
}

QBN.functions = {
	not: {
		match: /^not-(.+)/,
		action: function(m) {
			return !QBN.requirementMet(m[1])
		},
		description: function(m) {
			var desc = QBN.description(m[1])
			return desc == null ? desc : 'not ' + desc
		}
	},
	random: {
		match: /^random-([0-9]+)/,
		action: function(m) {
			return State.random() < m[1] / 100
		},
		description: function(m) {
			return null
			// or: m[1] + '%'
			// or: BasicAbility.prototype.difficulty(Math.floor(m[1]))
		}
	},
	compare: {
		match: /^(.*)-(eq|ne|lt|gt|le|ge|before|during|after)-(.*)/,
		action: function(m) {
			var actual = QBN.value(m[1])
			var op = operators[m[2]]
			var expected = m[3]
			if(typeof actual === 'number') {
				expected = expected.replace('_', '.')
			}
			return op(actual, expected, m[1])
		},
		description: function(m) {
			var actual = QBN.description(m[1])
			var op = operatorNames[m[2]]
			var expected = m[3]
			if(typeof actual === 'number') {
				expected = Number(expected.replace('_', '.'))
			}
			if(actual == null || op == null) return null
			else return `${actual} ${op} ${expected}`
		}
	}
}

function invalidName(name) {
	if(!/^[$_][_a-zA-Z][_a-zA-Z0-9]*$/.test(name)) {
		return "invalid name " + JSON.stringify(name) + "."
	}
}

QBN.range = function(value, ranges) {
	var n = ranges.length
	if(typeof n !== 'number' || n < 2) {
		var msg = "QBN.range: invalid range spec:"
		msg += " must have at least two values"
		msg += " (got " + JSON.stringify(n) + ")."
		throw new Error(msg)
	}
	var range, lower, prev
	for(var i=0; i<ranges.length; ++i) {
		var r = ranges[i]
		if(typeof r === 'string' && typeof prev === 'string') {
			var msg = "QBN.range: invalid range spec " + JSON.stringify(ranges)
			msg += ": may not have two consecutive strings."
			throw new Error(msg)
		}
		prev = r
		if(typeof r === 'string') range = r;
		else if(typeof r === 'number') {
			if(typeof lower !== "undefined" && r <= lower) {
				var msg = "QBN.range: invalid range spec " + JSON.stringify(ranges)
				msg += ": numbers must be strictly increasing."
				throw new Error(msg)
			}
			if(value < r) { if(range) break; else return }
			lower = r
			range = undefined
		} else {
			var msg = "QBN.range: invalid range spec " + JSON.stringify(ranges)
			msg += ": may only contain strings and numbers."
			throw new Error(msg)
		}
	}
	return range
}

Macro.add('range', {
	handler: function() {
		var range
		try {
			range = QBN.range(this.args[0], this.args.slice(1))
		} catch(e) {
			return this.error('<<range>>: ' + (e.message || e))
		}

		var name = firstWord(this.args.raw)
		setVar('_' + range + '_' + name.substring(1), true)
		setVar('_' + name.substring(1) + '_range', range)
	}
})

QBN.value = function(name) {
	var v = State.variables, t = State.temporary
	return t[name] != null ? t[name] : v[name]
}

QBN.requirementMet = function(req) {
	var yes = null
	for(var name in QBN.functions) if(QBN.functions.hasOwnProperty(name)) {
		var fn = QBN.functions[name]
		var m = fn.match.exec(req)
		if(m) { yes = fn.action(m); break }
	}
	if(yes === null) yes = QBN.value(req)
	return !!yes
}

QBN.description = function(req) {
	var desc = null
	for(var k in QBN.functions) if(QBN.functions.hasOwnProperty(k)) {
		var fn = QBN.functions[k]
		var m = fn.match.exec(req)
		if(m) { desc = fn.description(m); break }
	}
	if(desc === null) desc = req
	return desc
}

QBN.tagsMatch = function(p, re) {
	p = toPassage(p)
	for(var i=0; i<p.tags.length; ++i) {
		var tag = p.tags[i]
		var prefix = re.exec(tag)
		if(prefix) tag = tag.substring(prefix[0].length)
		else continue
		if(!QBN.requirementMet(tag)) return false
	}
	return true
}

QBN.requirements = function(p) {
	var re = /^(req|also)-/
	var requirements = [];
	for(var i=0; i<p.tags.length; ++i) {
		var tag = p.tags[i]
		var prefix = re.exec(tag)
		if(prefix) tag = tag.substring(prefix[0].length)
		else continue
		var desc = QBN.description(tag)
		if(desc != null) requirements.push(desc)
	}
	return requirements
}

QBN.status = function(p) {
	return passageType(toPassage(p))
}

QBN.visible = function(p) {
	p = toPassage(p)
	if(!passageType(p)) return false
	return QBN.tagsMatch(p, /^req-/)
}

QBN.available = function(p) {
	p = toPassage(p)
	if(!passageType(p)) return false
	return QBN.tagsMatch(p, /^(req|also)-/)
}

Macro.add('addcard', {
	handler: function() {
		var p = toPassage(this.args[0])
		var type = this.args[1] ? 'sticky-card' : 'card'
		passageType(p, type)
	}
})

Macro.add('removecard', {
	handler: function() {
		var p = toPassage(this.args[0])
		var type = this.args[1] === false ? false : null
		passageType(p, type)
	}
})

Macro.add('includecard', {
	handler: function() {
		var p = toPassage(this.args[0])
		var $output = $(this.output)
		let old = QBN.current;  QBN.current = p.title
		$output.wiki(Passage.prototype.processText.call(p))
		QBN.current = old
	}
})

function list(l) {
	return (typeof l !== 'object' || l.length == null) ? [l] : l
}

Macro.add('includeall', {
	handler: function() {
		var cards = list(this.args[0])
		var wrap = this.args[1] || 'content'
		if(!Macro.has(wrap)) {
			return this.error("No such widget " + JSON.stringify(wrap) + ".")
		}
		var separate = this.args[2]
		var $output = $(this.output)
		for(var i=0; i<cards.length; ++i) {
			var c = cards[i], p = toPassage(c)
			$output.wiki('<<'+wrap+' '+toArgument(c)+'>>')
			if(separate && i < cards.length - 1) {
				// This is a really bad idea: what if you want to
				// use the name of a macro as a separator string?
				if(Macro.has(separate)) {
					$output.wiki('<<'+separate+' '+(i===cards.length-2)+'>>')
				} else {
					$output.append(document.createTextNode(separate))
				}
			}
		}
	}
})

Macro.add('requirements', {
	handler: function() {
		var $output = $(this.output)
		var p = toPassage(this.args[0] || QBN.current)
		var wrap = this.args[1]
		if(wrap && !Macro.has(wrap)) {
			return this.error("No such widget "+JSON.stringify(wrap)+".")
		}
		var separate = this.args[2] || 'comma'
		var reqs = QBN.requirements(p)
		for(var i=0; i<reqs.length; ++i) {
			var req = reqs[i]
			if(wrap) $output.wiki('<<'+wrap+' '+JSON.stringify(req)+'>>')
			else $output.wiki(req)
			if(separate && i < reqs.length - 1) {
				if(Macro.has(separate)) {
					$output.wiki('<<'+separate+' '+(i===reqs.length-2)+'>>')
				} else {
					$output.append(document.createTextNode(separate))
				}
			}
		}
	}
})

function addTo(set, passage) {
	var title = (typeof passage === 'string') ? passage : passage.title
	var newPassage = !set[title]
	if(newPassage) set[title] = true
	return newPassage
}

function firstWord(string) {
	var i = string.indexOf(" ")
	return string.substring(0, i == -1 ? string.length : i)
}

Macro.add('fillhand', {
	handler: function() {
		try {
			var hand = this.args[0], n = this.args[1], passages = this.args[2]
			if(!hand) {
				// Only handles actual variables, not backquoted
				// expressions or whatever. WHY isn't there a way
				// to use Sugarcube's parser for this??!?
				hand = []
				var name = firstWord(this.args.raw).substring(1)
				if(!setVar(name, hand)) {
					return this.error('<<fillhand>>: failed to set hand "' + name + '".')
				}
			}
			var i, set = {}
			for(i=0; i<hand.length; ++i) addTo(set, hand[i])
			passages = passages.filter(function(p){ return addTo(set, p) })
			passages = choose(passages, n - hand.length)
			for(i=0; i<passages.length; ++i) hand.push(passages[i])
		} catch(err) {
			return this.error('<<fillhand>>: ' + (typeof err === 'object' ? err.message : err))
		}
	}
})

// Break a card into two parts: cover and contents.
Macro.add('card', {
	tags: ['contents'],
	handler: function() {
		var $output = $(this.output)
		if(getVar('_qbn_cover')) {
			$output.wiki(this.payload[0].contents)
		} else {
			for(var i=1; i<this.payload.length; ++i) {
				$output.wiki(this.payload[i].contents)
			}
		}
	}
})

function partialChoice(cards) {
	return cards.length > 0 && cards[cards.length-1].text == null
}

function beginChoice(choices, title, tags) {
	// If you don't specify the type, make it a `card`.
	if(tags.indexOf('card') < 0 && tags.indexOf('sticky-card') < 0) {
		tags.push('card')
	}
	// Create a new choice which doesn't have any text yet.
	choices.push({
		title: JSON.stringify([passage(), title, choices.length]),
		tags: tags
	})
}

Macro.add('choices', {
	tags: ['when', 'offer'],
	handler: function() {
		var name = this.args.raw
		var msg = invalidName(name)
		if(msg) return this.error(msg)

		var choices = []
		for(var i=0; i<this.payload.length; ++i) {
			var section = this.payload[i]
			var msg = false
			switch(section.name) {
				case 'choices':
					if(section.contents.trim() !== '') {
						return this.error('All <<choices>> content must be in sub-tags.')
					}
					break
				case 'when':
					if(partialChoice(choices)) {
						return this.error('This choice already has a "when" clause (section '+i+', '+section.name+').')
					}
					var tags = section.contents.trim()
					tags = (tags === '') ? [] : tags.split(/\s+/)
					beginChoice(choices, name, tags)
					break
				case 'offer':
					if(!partialChoice(choices)) beginChoice(choices, name, [])
					choices[choices.length-1].text = section.contents.trim()
					if(section.args[0] !== '') {
						choices[section.args[0]] = choices[choices.length-1]
					}
					break
			}
		}

		setVar(name, choices)
	}
})

// ---------------------------------------------------------------------
// Progress variables.

// Find the index of `value` in `setup.name`.
QBN.progress = function(name, value) {
	name = name.replace(/^[$_]/, '')
	let order = setup[name]
	if(order == null) {
		throw("No such progress sequence " + JSON.stringify(name) + ".")
	}
	let i = order.indexOf(value)
	if(i === -1) {
		throw("No such progress value " + JSON.stringify(value) + " in " + JSON.stringify(name) + ".")
	}
	return i
}

// <<progress "$var" value1 ... >>
Macro.add('progress', {
	handler: function() {
		const name = this.args[0]
		let msg = invalidName(name)
		if(msg) return this.err(msg)

		let values = []
		setup[name.replace(/^[$_]/, '')] = values
		for(let i=1; i<this.args.length; ++i) {
			values.push(this.args[i])
		}

		setVar(name, values[0])
	}
})

// <<advance "$var" n=1>>
Macro.add('advance', {
	handler: function() {
		const name = this.args[0]
		let msg = invalidName(name)
		if(msg) return this.err(msg)
		const n = +this.args[1] || 1

		let values = setup[name.replace(/^[$_]/, '')]
		let value = getVar(name)
		let index = QBN.progress(name, value)
		index = Math.min(index+n, values.length - 1)
		setVar(name, values[index])
	}
})
