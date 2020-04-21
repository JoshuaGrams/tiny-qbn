parseTwee = (function(){
	function specialPassage(story, p) {
		let attr = p[0], text = p[1]
		if(attr.name === 'Start') {
			if(story.startnode == null) {
				story.startnode = p
			}
		} else if(attr.name === 'StoryTitle') {
			let lines = text.split('\n')
			story.name = lines[0].trim()
			return true
		}
		return false
	}

	function parsePassage(string) {
		let pieces = string.split(/\n([^]+)/, 2)
		return [
			{name: pieces[0].trim()},
			pieces[1].trim()
		]
	}

	function addPassage(list, passage) {
		list.push(passage)
		passage.pid = list.length + 1
	}

	function parseTwee(string, options) {
		let story = {ifid: uuidv4(), passages: [], startnode: 1}
		if(options) {
			if(options.widgets) {
				string += '\n\n' + options.widgets.join('\n\n')
			}
			story.scripts = options.scripts
			story.styles = options.styles
		}
		let passages = string.split(/^::/m)
		passages.shift()
		passages = passages.map(parsePassage)

		for(let i=0; i<passages.length; ++i) {
			let p = passages[i]
			if(!specialPassage(story, p)) {
				addPassage(story.passages, p)
			}
		}
		if(typeof story.startnode === 'string') {
			story.startnode = story.startnode.pid
		}
		return story
	}

	return parseTwee
})()
