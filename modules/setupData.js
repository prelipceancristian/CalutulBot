const fs = require('fs');

module.exports = {
    /**
     * The function reads synchronosly the available songs from a given txt file, converting them into an array of music titles(strings)
     * @returns {string|Array} The array of music bites titles
     */
    loadOutputMisc: function(){
        fs.readFile('./Music/outputMisc.txt', 'utf8', function (err,data) {
            if (err) {
              return console.log(err);
            }
            miscMusicTitles = data;
            miscMusicTitles = miscMusicTitles.split("\n");
            for(let i = 0; i < miscMusicTitles.length; i++){
                miscMusicTitles[i] = miscMusicTitles[i].replace('\r', '');
                miscMusicTitles[i] = miscMusicTitles[i].replace('.mp3', '');
                miscMusicTitles[i] = miscMusicTitles[i].replace(' ', '');
            }
            miscMusicTitles.splice(miscMusicTitles.indexOf(''), 1);
            numberOfMisc = musicTitles.length;
            console.log(miscMusicTitles);
            return miscMusicTitles;
        }); 
    },

    loadHelpFile: () => fs.readFileSync('./Dialogue/help.txt', 'utf8'),

    loadRepliesFile: () => fs.readFileSync('./Dialogue/replies.txt', 'utf8').split('\n'),
    
    loadRareRepliesFile: () => fs.readFileSync('./Dialogue/rareReplies.txt', 'utf8').split('\n'),
    
    /**
     * The function sets up a relation between commands and actual soundbites 
     * @param {Array|str} predefinedCommandsList 
     * @param {Array|str} predefinedPathList 
     * @returns {Array|Array|str} - the modified command list and the path list
     */
    //TODO: the arguments might be redundant
    loadPredefined: (predefinedCommandsList, predefinedPathList) => {
        let data = fs.readFileSync('./Music/predefinedCommandsAndPaths.csv', 'utf8');
        args = data.split('\n');
        let whatev = args.pop();
        whatev = args.shift();
        let counter = 0;
        args.forEach(element => {
            temp = element.split(',');
            predefinedCommandsList[counter] = temp[0];
            predefinedPathList[counter] = temp[1].replace('\r', '');
            predefinedPathList[counter] = predefinedPathList[counter].toLowerCase();
            counter++;
        });
        return [predefinedCommandsList, predefinedPathList];
    },
    //TODO:arguments might be redundant
    /**
     * The function creates a list of music titles from the outputMisc.txt file and creates a string of sound bites from the given text, read for discord message display.
     * @param {Array|string} miscMusicTitles - the list of music titles
     * @param {string} autoReply - the message
     * @returns {*} - an array which contains the music titles and the resulting message
     */
    loadOutputMisc: (miscMusicTitles, autoReply) => {
        let temp = fs.readFileSync('./Music/outputMisc.txt', 'utf8');
        miscMusicTitles = temp.split("\n");
        for(let i = 0; i < miscMusicTitles.length; i++){
            miscMusicTitles[i] = miscMusicTitles[i].replace('\r', '');
            miscMusicTitles[i] = miscMusicTitles[i].replace('.mp3', '');
            miscMusicTitles[i] = miscMusicTitles[i].replace(' ', '');
            miscMusicTitles[i] = miscMusicTitles[i].toLowerCase();
        }
        miscMusicTitles.splice(miscMusicTitles.indexOf(''), 1);
        let ccounter = 1;
        for(let i = 0; i < miscMusicTitles.length; i++) {
            autoReply += ccounter++ +  ". **!" + miscMusicTitles[i] + "**\n";
        }
        return [miscMusicTitles, autoReply];
    },

    /**
     * The function makes a list of kanye soundbites from the outputKanye.txt file
     * @returns {Array|string} the list of soundbites
     */
    loadKanyeMusic: () => {
        let temp = fs.readFileSync('./Music/outputKanye.txt', 'utf8').split('\n');
        let whatev = temp.pop();
        for(let i = 0; i < temp.length; i++){
            temp[i] = temp[i].replace('\r', '');
            temp[i] = temp[i].replace(' ', '');
            temp[i] = temp[i].toLowerCase();
        }
        return temp;
    },

    /**
     * The function makes a list of banned words form the bannedWords.txt file
     * @returns A list of banned words
     */
    loadBannedWords: () => {
        let temp = fs.readFileSync('./Dialogue/bannedWords.txt', 'utf8').split('\n');
        for(let i = 0; i < temp.length; i++){
            temp[i] = temp[i].replace('\r', '');
        }
        return temp;
    }
}