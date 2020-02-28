Tweego and VSCode
=================

[Twee](https://github.com/iftechfoundation/twine-specs/blob/master/twee-3-specification.md) is a text-based format for writing Twine stories. Creating stories this way doesn't give the the convenient visualization of the graphical editor. But you're not always popping in and out of different passages: all the text is right there (though you can break it into multiple files if you like). And storing your code in text files allows you to use version control for easier collaboration with other authors.

And the Twee format is pretty simple. The following line begins a passage named "Blah blah blah" with tags "boring" and "uncomfortable":

	:: Blah blah blah [boring uncomfortable]

All text following this line goes in this passage until you start another one.

That's pretty much all you need to know. To start a new passage, put two colons at the beginning of a line and follow it with the name of the passage. If you want to add tags, put them inside a set of square brackets after the passage name. You can tuck the name right against the colons or leave space in between.

-----

It *does* take a bit of setup, but it's not too bad. You can use any text
editor, but this guide is going to use Visual Studio Code. Here's the
overview, and then I'll walk through it in detail:

* Install [Tweego](https://www.motoslave.net/tweego/).
* Install [Visual Studio Code](https://code.visualstudio.com/) (VSCode for short).
* Run VSCode and get the Twee syntax-highlighting extension.
* Create a project directory with:
	* A subdirectory for your game's source code.
	* A build task that runs Tweego to turn your code into HTML that you can play (or import into the Twine editor).
	* Optionally a copy of the story format you're using.


-----


So. Start by getting [Tweego](https://www.motoslave.net/tweego/). If you're on Windows you can use [ChapelR's tweego-installer](https://github.com/ChapelR/tweego-installer/releases) to automate the installation for you. On Mac, try [this script](https://gist.github.com/JoshuaGrams/845eb0e0cd8e8fb42668028792b37ce7) (I don't have any way to test it, but I forked it from an apparently working script and updated it to the new version of Tweego, so it *should* be ok...).

The basic idea is that you need to put Tweego and its copy of the story formats somewhere, and then add its directory to the `PATH` environment variable so you can just type `tweego` to run it instead of having to type out the whole name of the directory where it is.

-----

[Download Visual Studio Code](https://code.visualstudio.com/Download). This is a text editor designed for various kinds of code. Install and run it.

Open up the Extensions panel. There's a bar on the left: the bottom icon (four squares with one slightly removed) toggles the extensions panel open and closed. As far as I can tell that's the only way to close it. Type "twee" into the search box and install the Twee2 Syntax extension. Then close the panel.

To start a new project, Choose File -> Open Folder, and create a new folder for your story. This will open the "Explorer" panel on the left: create a "source" directory to hold your source code. Or you can name it something else: just be sure to use that name in the build command below.

Then you can create a build task for the project. From the Terminal menu, choose "Configure Build Tasks", then "Create task.json from a template," then "Others." Change the "label" from "echo" to "Tweego" or "Build my Game" or something that you will recognize. Change the "command" from `"echo Hello"` to `"tweego -o index.html source"`. This tells Tweego to take all the files in the `source` directory and build them into `index.html`.

Go back in to the Terminal menu and "Configure Default Built Task" so that you can build your game with Ctrl-Shift-B.

With this setup, you will have to build your project manually each time you want to view it, and then go reload it in the browser. But Tweego can also "watch" a directory and auto-rebuild the story when any of the source files changes. To do that, open the `tasks.json` file and add a `-w` to the command: `"tweego -w -o index.html source"`. You also have to tell VSCode that this is a "background" task that keeps running, so it shouldn't wait for it to quit. Add an extra line (just before or just after the "command" line is good) that says:

	"isBackground": true,

Then you'll only have to tell VSCode to build the story when you start working on it, and for the rest of your session it should auto-build and you'll just have to switch to your browser and reload. Note that if you make changes to your StoryInit you may have to restart the game for the changes to take effect.

And finally, if you want to store a copy of the story format with your project, you can make a folder "storyformats" and copy the appropriate story format into it (you can grab this from the Tweego zip file, or from wherever Tweego is installed).

-----

You should be all set! You can now create a file in the source directory. Give it a '.tw' extension so VSCode will know that it's Twee code.

Tweego requires a special `StoryTitle` passage. It should contain a single line with the title of your story.

Then the first time you try to build your project, Tweego will complain that your story doesn't have an IFID. It will generate one for you, so just copy and paste that into your source file.

You also need a passage named `Start`. This is where your story starts. If you really want to call it something else, there are a couple of ways to choose another name: see the [Twee specification](https://github.com/iftechfoundation/twine-specs/blob/master/twee-3-specification.md) or the [Tweego documentation](https://www.motoslave.net/tweego/docs/) for details.

If you have code that would have gone in the Story JavaScript or Story Stylesheet sections, just put it in a `.js` (for JavaScript) or `.css` (for stylesheet rules) file in your source directory.
