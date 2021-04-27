**CalutulBot**

This is a very simple (and probably lacking) guide on setting up your very own CalutulBot replica on your local machine.
At the end of the file there is a list of useful links in which people with way more skill and time than me go into detail regarding how certain packages should be installed and how possible errors can be handled.


**Prerequisites:**
1. Node.js v14.15.3, check installation by writing "node --version" in the command prompt / terminal
2. Discord.js (*"npm install discord.js"* once you have installed node.js)
3. Generating your own list .txt and .mp3 files (I chose not to include my own as they contain personalised information about me and my friend. A list of all missing .txt files will be down below)
4. Obtain your own BOTTOKEN and TENORKEY and add them to a local .env file
5. Ffmpeg

**How to setup:**
1. Clone the github project at your desired location.
2. Instantiate your node project by running *"npm init"* (skip through by pressing enter and press *ok*) to generate your config file.
3. Edit the package.json config file and replace the "main" value from *"index.js"* to *"bot.js"*.
4. Enter the working folder and select one of the following:
	- runMeWin (for Windows, a batch file which updates the local data files on run)
	- runMeLin (for Linux, a bash script which does the same thing, you might need to change permissions with "chmod u+x runMeLin.sh")
5. ?
6. Profit


Possbile errors and useful links:
	- *Installing node*: https://nodejs.org/en/download/package-manager/
	- *Installing discord.js*: https://discord.js.org/#/docs/main/stable/general/welcome
	- *Setting up discord bots with your discord dev account*: https://discord.com/developers/applications
	- *Installing ffmpeg*: https://ffmpeg.org/download.html
	- MISSING .TXT FILES
		./Dialogue/bannedWords.txt
		./Dialogue/help.txt
		./Dialogue/rareReplies.txt
		./Dialogue/replies
		./Music

