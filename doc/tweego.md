Tweego and VSCode
=================

[Twee](https://github.com/iftechfoundation/twine-specs/blob/master/twee-3-specification.md) is a text-based format for writing Twine stories. Creating stories this way doesn't give the the convenient visualization of the graphical editor. But you're not always popping in and out of different passages: all the text is right there (though you can break it into multiple files if you like). And storing your code in text files allows you to use version control for easier collaboration with other authors.

And the Twee format is pretty simple. The following line begins a passage named "Blah blah blah" with tags "boring" and "uncomfortable":

	:: Blah blah blah [boring uncomfortable]

That's two colons at the beginning of the line, followed by the name of the passage. You can leave a space or tuck the name right up against the colons. If you want to add tags, put them inside a set of square brackets after the passage name.

All text following this line goes in this passage until you start another one.

-----

Here's an overview of the setup you need to do. You *can* use any text editor,
but I'm going to use Visual Studio Code and set it up to build your story for
you so you don't have to use the command line yourself.

* Install [Tweego](https://www.motoslave.net/tweego/).
* Install [Visual Studio Code](https://code.visualstudio.com/) (VSCode for short).
* Run VSCode and get the Twee syntax-highlighting extension.
* Unzip my [minimal template](tweego-vscode.zip) to create a new blank project.

Note that this is a very simple setup. If you're up for something more complex, ChapelR has a [project template with all the trimmings](https://github.com/ChapelR/tweego-setup) and Em Lazer-Walker has a [workflow that auto-builds and hosts your story on GitHub](https://dev.to/lazerwalker/a-modern-developer-s-workflow-for-twine-4imp).


Install Tweego
--------------


Start by getting [Tweego](https://www.motoslave.net/tweego/). If you're on Windows you can use [ChapelR's tweego-installer](https://github.com/ChapelR/tweego-installer/releases) to automate the installation for you. On Mac, try [this script](https://gist.github.com/JoshuaGrams/845eb0e0cd8e8fb42668028792b37ce7) (I don't have any way to test it, but I forked it from an apparently working script and updated it to the new version of Tweego, so it *should* be ok...).


Install VSCode
--------------

[Download Visual Studio Code](https://code.visualstudio.com/Download). This is a text editor designed for various kinds of code. Install and run it.

Open up the Extensions panel. There's a bar on the left: the bottom icon (four squares with one slightly removed) toggles the extensions panel open and closed. As far as I can tell that's the only way to close it. Type "twee" into the search box and install the "Twee 3 Language Tools" extension. Then close the panel.


Unzip Blank Project Template
----------------------------

Unzip my [minimal Tweego/VSCode template](tweego-vscode.zip) to get a new blank project. Rename the directory to whatever you like.

And finally, if you want to store a copy of the story format with your project, you can make a sub-folder "storyformats" and copy the appropriate story format into it (you can grab this from the Tweego zip file, or from wherever Tweego is installed).

In VSCode, go to File and then Open Folder to open the  project. The first time you try to build your project, Tweego will complain that your story doesn't have an IFID. It will generate one for you, so copy and paste that into your source file.

Tweego uses the SugarCube 2 story format by default. A lot of people recommend this format, but if you'd like to use the Twine editor's default format, you can open `tasks.json` in the `.vscode` folder and add `-f harlowe-3` to the tweego command.

If you have code that would have gone in the Story JavaScript or Story Stylesheet sections, put it in a `.js` (for JavaScript) or `.css` (for stylesheet rules) file in your source directory.


Doing the Setup by Hand
-----------------------

OK, that was the easy version. If one of those parts doesn't work for you, here are some notes of how to do things more manually.

### Tweego


The basic idea is that you need to put Tweego and its copy of the story formats somewhere, and then add its directory to the `PATH` environment variable so you can just type `tweego` to run it instead of having to type out the whole name of the directory where it is. Or you can unzip Tweego anywhere, but you'll have to write out the whole path to it when you set up your build task in VSCode. On Windows 10, you can Shift+right-click the file and choose "Copy as Path". Or on most operating systems you can open the properties and copy the location, then add the directory separator (`\` on Windows, `/` everywhere else) and tweego to the end.

### VSCode

To start a new project, Choose File -> Open Folder, and create a new folder for your story. This will open the "Explorer" panel on the left: create a "source" directory to hold your source code. Or you can name it something else, but be sure to use that name in the build command below.

Then you can create a build task for the project. From the Terminal menu, choose "Configure Build Tasks", then "Create task.json from a template," then "Others." Change the "label" from "echo" to "Tweego" or "Build my Game" or something that you will recognize. Change the "command" from `"echo Hello"` to `"tweego -o index.html source"`. This tells Tweego to take all the files in the `source` directory and build them into `index.html`.

Go to the Terminal menu again and "Configure Default Built Task" so that you can build your game with Ctrl-Shift-B.

With this setup, you will have to build your project manually each time you want to view it, and then go reload it in the browser. But Tweego can also "watch" a directory and auto-rebuild the story when any of the source files changes. To do that, open the `tasks.json` file and add a `-w` to the command: `"tweego -w -o index.html source"`. You also have to tell VSCode that this is a "background" task that keeps running, so it shouldn't wait for it to quit. Add an extra line (just before or just after the "command" line is good) that says:

	"isBackground": true,

Then you'll only have to tell VSCode to build the story when you start working on it, and for the rest of your session it should auto-build and you'll just have to switch to your browser and reload. Note that if you make changes to your StoryInit you may have to restart the game for the changes to take effect.

You can now create a file in the source directory. Give it a '.tw' extension so VSCode will know that it's Twee code.

### Twee

You need a passage named `StoryTitle`. It should contain one line that gives the title of your game.

You also need a passage named `Start`. This is where your story starts. If you really want to call it something else, there are a couple of ways to choose another name: see the [Twee specification](https://github.com/iftechfoundation/twine-specs/blob/master/twee-3-specification.md) or the [Tweego documentation](https://www.motoslave.net/tweego/docs/) for details.
