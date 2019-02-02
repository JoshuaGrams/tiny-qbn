State.initPRNG()

var QBN = {}
window.QBN = QBN

QBN.cards = {}
var cardTags = ['card', 'sticky-card']
for(var i=0; i<cardTags.length; ++i) {
	var sel = 'tw-passagedata[tags~=' + cardTags[i] + ']'
	var c = document.querySelectorAll(sel)
	for(var j=0; j<c.length; ++j) {
		var title = c[j].getAttribute('name')
		QBN.cards[title] = i
	}
}

$(document).on(':passagestart', function(evt) {
	var title = evt.passage.title
	if(QBN.cards[title] === 0) delete QBN.cards[title]
})


QBN.passages = function(extraVars) {
	if(extraVars === undefined) extraVars = {}
	return Story.lookupWith(function(p) {
		return QBN.passageMatches(p, extraVars)
	})
}

QBN.functions = [
	{
		match: /^not-(.+)/,
		action: function(m, extraVars) {
			return !QBN.has(m[1], extraVars)
		}
	},
	{
		match: /^random-([0-9]+)/,
		action: function(m, extraVars) {
			return State.random() < m[1] / 100
		}
	}
]

QBN.rangeTag = function(name, ranges) {
	var value = State.getVar(name)
	for(var i=0; i<ranges.length; i+=2) {
		var range = ranges[i], limit = ranges[i+1]
		if(limit === undefined || value < limit) {
			State.setVar('_' + name.substring(1) + range, true)
			return
		}
	}
}

QBN.has = function(tag, extraVars) {
	var v = State.variables, t = State.temporary
	var yes = null
	for(var j=0; j<QBN.functions.length; ++j) {
		var  fn= QBN.functions[j]
		var m = fn.match.exec(tag)
		if(m) { yes = fn.action(m, extraVars); break }
	}
	if(yes === null) yes = extraVars[tag] || t[tag] || v[tag]
	return !!yes
}

QBN.passageMatches = function(p, extraVars) {
	if(QBN.cards[p.title] == null) return false
	for(var i=0; i<p.tags.length; ++i) {
		var tag = p.tags[i]
		var prefix = /^req-/.exec(tag)
		if(prefix) tag = tag.substring(prefix[0].length)
		else continue
		if(!QBN.has(tag, extraVars)) return false
	}
	return true
}

Macro.add('addcard', {
	handler: function() {
		var p = Story.lookup(this.args[0])
		if(!p) return this.error('No such passage "' + this.args[0] + '".')
		QBN.cards[p.title] = (this.args[1] ? 1 : 0)
	}
})

Macro.add('removecard', {
	handler: function() {
		if(QBN.cards[this.args[0]] != null) delete QBN.cards[this.args[0]]
	}
})

function list(l) {
	return (typeof l !== 'object' || l.length == null) ? [l] : l
}

function groupOrSeparator(arg, container) {
	var out
	var sep = /^separator:/.exec(arg)
	if(sep) out = arg.substring(sep[0].length)
	else {
		var dir = 'qbn-cards__' + (arg==null ? 'vertical' : arg)
		out = $('<div/>', {class: dir + ' qbn-cards'})
		out.appendTo(container)
	}
	return out
}

function cardElement(group, container, i, n, passage) {
	var $elt
	if(typeof group === 'string') {
		$elt = container
		if(i === n-1 && group === ', ') group = ' and '
		if(i > 0) $elt.append(document.createTextNode(group))
	} else {
		var attrs = {class: 'qbn-card'}
		if(passage) {
			attrs.class += ' ' + passage.domId
			attrs['data-passage'] = passage.title
		}
		$elt = $('<div/>', attrs)
		$elt.appendTo(group)
	}
	return $elt
}

Macro.add('includecards', {
	handler: function() {
		var passages = list(this.args[0])
		var group = groupOrSeparator(this.args[1], this.output)
		for(var i=0; i<passages.length; ++i) {
			var p = passages[i]
			if(typeof p === 'string') p = Story.get(p)
			if(QBN.cards[p.title] === 0) delete QBN.cards[p.title]
			var $elt = cardElement(group, this.output, i, passages.length, p)
			$elt.wiki(p.processText())
		}
	}
})

Macro.add('linkcards', {
	handler: function() {
		var passages = list(this.args[0])
		var group = groupOrSeparator(this.args[1])
		if(typeof group !== 'string') group.appendTo(this.output)
		for(var i=0; i<passages.length; ++i) {
			var p = passages[i]
			var $elt = cardElement(group, this.output, i, passages.length)
			if(typeof p !== 'string') p = p.title
			Wikifier.createInternalLink($elt, p, p)
		}
	}
})
