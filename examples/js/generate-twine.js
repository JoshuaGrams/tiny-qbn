nodeToHTML = (function(){
	function openTag(name, attribs) {
		let tag = '<' + name
		for(const k in attribs) if(attribs.hasOwnProperty(k)) {
			tag += ' ' + k + '=' + JSON.stringify(''+attribs[k])
		}
		return tag + '>'
	}

	function closeTag(name) { return '</' + name + '>' }

	// n = [name, {attributes}, [children...]]
	function nodeToHTML(n) {
		if(typeof n === 'string') return n
		else if(typeof n === 'object') {
			let name = n[0], attribs = n[1], children = n[2]
			let s = openTag(name, attribs)
			for(let i=0; i<children.length; ++i) {
				s += nodeToHTML(children[i])
			}
			return s + closeTag(name)
		}
	}

	return nodeToHTML
})()

storyToHTML = (function(){
	const entitiesRE = /[&<>'"]/g
	const entities = {
		"&": "&amp;",
		"<": "&lt;", ">": "&gt;",
		"'": "&apos;", '"': "&quot;"
	}
	function escapeEntity(ch) { return entities[ch] }
	function escapeEntities(string) {
		return string.replace(entitiesRE, escapeEntity)
	}

	let pid=1
	let x=100, y=100, dx=125, dy=125
	let xMin=x, xMax=x+24*dx
	function passageToNode(p) {
		let a = p[0], text = escapeEntities(p[1])
		let attribs = {}
		for(k in a) if(a.hasOwnProperty(k)) attribs[k] = a[k]
		attribs.pid = pid++
		if(attribs.tags == null) attribs.tags = ''
		if(attribs.position == null) {
			attribs.position = x + ',' + y
			x += dx
			if(x >= xMax) { x = xMin; y += dy }
		}
		if(attribs.size == null) attribs.size = '100,100'
		return ['tw-passagedata', attribs, text]
	}

	function storyToHTML(story, format) {
		let storyInfo = {
			name: story.name,
			ifid: uuidv4(),
			// IFTF's Twine spec *says* these are optional, but the
			// official Twine editor will fail to load the HTML if
			// they are missing.
			format: format.name,
			"format-version": format.version,
			zoom: 1,
			startnode: story.startnode || 1
		}
		let dataNodes = story.passages.map(passageToNode)
		if(story.scripts || story.styles) {
			if(story.styles) {
				let styles = story.styles.join('\n')
				dataNodes.unshift([
					'style', {
						role: 'stylesheet',
						id: 'twine-user-stylesheet',
						type: 'text/twine-css'
					},
					styles
				])
			}
			if(story.scripts) {
				let scripts = story.scripts.join(';\n')
				dataNodes.unshift([
					'script', {
						role: 'script',
						id: 'twine-user-script',
						type: 'text/twine-javascript'
					},
					scripts
				])
			}
		}
		let storyData = nodeToHTML([
			'tw-storydata', storyInfo, dataNodes
		])
		let storyHTML = format.source.replace(
			/{{STORY_(NAME|DATA)}}/g,
			function(m) {
				return m==='{{STORY_NAME}}'? story.name: storyData
			}
		)
		return storyHTML
	}

	return storyToHTML
})()

function generateStory(story, format) {
	setTimeout(function() {
		document.open()
		document.write(storyToHTML(story, format))
		document.close()
	}, 0)
}
