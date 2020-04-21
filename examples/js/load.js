load = (function(){
	function newRequest(uri, responseHandler) {
		let req = new XMLHttpRequest()
		req.onreadystatechange = responseHandler
		req.open('GET', uri)
		return req
	}

	function load(filenames, done) {
		let files = {}
		let keys = Object.keys(filenames)
		let k=0, i=0
		let req
		function next(evt) {
			if(req.readyState === 4) {
				if(req.status === 200) {
					if(files[keys[k]] == null) files[keys[k]] = []
					files[keys[k]][i] = req.responseText
				} else {
					throw new Error(req.status + ': ' + req.responseURL)
				}
				++i; if(i === files[keys[k]].length) { ++k; i=0 }
				if(k < keys.length) {
					req = new XMLHttpRequest()
					req.onreadystatechange = next
					req.open('GET', filenames[keys[k]][i])
					req.send()
				} else {
					done(files)
				}
			}
		}
		files[keys[k]] = []
		req = new XMLHttpRequest()
		req.onreadystatechange = next
		req.open('GET', filenames[keys[k]][i])
		req.send()
	}

	return load
})()
