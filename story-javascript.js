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
setVar('$QBN', {type: {}})

// Remove single-use cards when visited.
$(document).on(':passagestart', function(evt) {
	passageType(evt.passage, false)
})

function toArgument(card) {
	if(typeof card === 'string') card = JSON.stringify(card)
	else if(typeof card === 'object') card = '`'+JSON.stringify(card)+'`'
	else {
		throw new Error('Cards must be passed as titles or passage-like objects (got ' + (typeof card) + ').')
	}
	return card
}

function toPassage(card) {
	if(typeof card === 'string') card = Story.get(card)
	else if(typeof card !== 'object') {
		throw new Error('Cards must be passed as titles or passage-like objects (got ' + (typeof card) + ').')
	}
	return card
}

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

// Choose `count` random values from `array`.
function choose(array, count) {
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
	}
	return selected
}

QBN.passages = function(extraVars, n) {
	if(n == null && typeof extraVars === 'number') {
		n = extraVars; extraVars = {}
	} else if(extraVars == null) extraVars = {}
	var passages = Story.lookupWith(function(p) {
		return QBN.passageVisible(p, extraVars)
	})
	if(n) passages = choose(passages, n)
	for(var i=0; i<passages.length; ++i) passages[i] = passages[i].title
	return passages
}

var operators = {
	eq: function(a, b) { return a == b },
	ne: function(a, b) { return a != b },
	lt: function(a, b) { return a < b },
	gt: function(a, b) { return a > b },
	le: function(a, b) { return a <= b },
	ge: function(a, b) { return a >= b },
}

QBN.functions = [
	{
		match: /^not-(.+)/,
		action: function(m, extraVars) {
			return !QBN.requirementMet(m[1], extraVars)
		}
	},
	{
		match: /^random-([0-9]+)/,
		action: function(m, extraVars) {
			return State.random() < m[1] / 100
		}
	},
	{
		match: /^(.*)-(eq|ne|lt|gt|le|ge)-(.*)/,
		action: function(m, extraVars) {
			var actual = QBN.value(m[1], extraVars)
			var op = operators[m[2]]
			var expected = m[3]
			if(typeof actual === 'number') {
				expected = expected.replace('_', '.')
			}
			return op(actual, expected)
		}
	}
]

QBN.range = function(name, ranges) {
	if(typeof name !== 'string') {
		var msg = "QBN.range: name must be a string"
		msg += " (got " + (typeof name) + ")."
		throw new Error(msg)
	}
	if(!/^[$_][_a-zA-Z][_a-zA-Z0-9]*$/.test(name)) {
		var msg = "QBN.range: invalid name " + JSON.stringify(name) + "."
		throw new Error(msg)
	}
	var value = getVar(name)
	if(typeof value === 'undefined') {
		var msg = "QBN.range: no such variable " + JSON.stringify(name) + "."
		throw new Error(msg)
	}
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
	setVar('_' + range + '_' + name.substring(1), true)
}

QBN.value = function(name, extraVars) {
	var v = State.variables, t = State.temporary
	var value = extraVars[name]
	if(value == null) value = t[name]
	if(value == null) value = v[name]
	return value
}

QBN.requirementMet = function(req, extraVars) {
	var v = State.variables, t = State.temporary
	var yes = null
	for(var j=0; j<QBN.functions.length; ++j) {
		var  fn= QBN.functions[j]
		var m = fn.match.exec(req)
		if(m) { yes = fn.action(m, extraVars); break }
	}
	if(yes === null) {
		if(extraVars[req] != null) yes = extraVars[req]
		else if(t[req] != null) yes = t[req]
		else yes = v[req]
	}
	return !!yes
}

QBN.passageVisible = function(p, extraVars) {
	if(!passageType(p)) return false
	for(var i=0; i<p.tags.length; ++i) {
		var tag = p.tags[i]
		var prefix = /^req-/.exec(tag)
		if(prefix) tag = tag.substring(prefix[0].length)
		else continue
		if(!QBN.requirementMet(tag, extraVars)) return false
	}
	return true
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

Macro.add('includepassage', {
	handler: function() {
		var p = toPassage(this.args[0])
		var $output = $(this.output)
		$output.wiki(Passage.processText.call(p))
	}
})

function list(l) {
	return (typeof l !== 'object' || l.length == null) ? [l] : l
}

Macro.add('includeall', {
	handler: function() {
		var passages = list(this.args[0])
		var wrap = this.args[1], remove = false
		if(!wrap) { wrap = 'includepassage'; remove = true }
		if(!Macro.has(wrap)) {
			return this.error("No such widget " + JSON.stringify(this.args[1]) + ".")
		}
		var separate = this.args[2]
		var $output = $(this.output)
		for(var i=0; i<passages.length; ++i) {
			var p = passages[i]
			if(remove) passageType(toPassage(p), false)
			$output.wiki('<<'+wrap+' '+toArgument(p)+'>>')
			if(separate && i < passages.length - 1) {
				if(Macro.has(separate)) {
					$output.wiki('<<'+separate+' '+(i===passages.length-2)+'>>')
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
	return string.substr(0, i == -1 ? string.length : i)
}

Macro.add('drawcards', {
	handler: function() {
		try {
			var hand = this.args[0], n = this.args[1], passages = this.args[2]
			if(!hand) {
				// Only handles actual variables, not backquoted
				// expressions or whatever. WHY isn't there a way
				// to use Sugarcube's parser for this??!?
				hand = []
				var name = firstWord(this.args.raw)
				if(!setVar(name, hand)) {
					return this.error('<<drawcards>>: failed to set hand "' + name + '".')
				}
				console.log('Empty Hand: setting ' + name + ' to [].')
			}
			var i, set = {}
			for(i=0; i<hand.length; ++i) addTo(set, hand[i])
			passages = passages.filter(function(p){ return addTo(set, p) })
			passages = choose(passages, n - hand.length)
			for(i=0; i<passages.length; ++i) hand.push(passages[i])
		} catch(err) {
			return this.error('<<drawcards>>: ' + (typeof err === 'object' ? err.message : err))
		}
	}
})

// Break a card into two parts: cover and content.
Macro.add('card', {
	tags: ['content'],
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
