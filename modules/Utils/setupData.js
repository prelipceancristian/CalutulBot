/**
 * This model handles loading data into the the bot memory
 * @exports setupData module
 */
const fs = require('fs');

module.exports = {
    /**
     * The function synchronosly reads the available songs from a given txt file, converting them into an array of music titles(strings)
     * @returns {string|Array} The array of music bites titles
     */
    //TODO: this entire thing might be useless lmao
    loadOutputMisc: function(){
        fs.readFile('./Music/outputMisc.txt', 'utf8', function (err,data) {
            if (err) {
              return console.error(err);
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
        }).catch(e => {
            if(e.code === 'ENOENT')
                console.error("Error: file not found. Make sure the outputMisc.txt file is in the correct location in the ./Music folder!");
            else
                console.error(e);
        }); 
    },
    /**
     * The function returns the content found in the ./Dialogue/help.txt file
     * @returns {string} the content of the help.txt file
     */
    loadHelpFile: () => {
        try{
            return fs.readFileSync('./Dialogue/help.txt', 'utf8')
        }
        catch(e){
            if(e.code === 'ENOENT')
                console.error("Error: file not found. Make sure the help.txt file is in the correct location in the ./Dialogue folder!");
            else
                console.error(e);
        }
    },
    /**
     * The function returns an array of the lines found in the replies.txt file
     * @returns {Array|string} the array of text replies
     */
    loadRepliesFile: () => {
        try{
            return fs.readFileSync('./Dialogue/replies.txt', 'utf8').split('\n')
        }
        catch(e){
            if(e.code === 'ENOENT')
                console.error("Error: file not found. Make sure the replies.txt file is in the correct location in the ./Dialogue folder!");
            else
                console.error(e);
        }
    },
    
    /**
     * The function returns an array of the lines found in the rareReplies.txt file
     * @returns {Array|string} the array of text replies
     */
    loadRareRepliesFile: () => {
        try{
            return fs.readFileSync('./Dialogue/rareReplies.txt', 'utf8').split('\n')
        }
        catch(e){
            if(e.code === 'ENOENT')
                console.error("Error: file not found. Make sure the rareReplies.txt file is in the correct location in the ./Dialogue folder!");
            else
                console.error(e);
        }
    },
    
    /**
     * The function sets up a relation between commands and actual soundbites 
     * @param {Array|str} predefinedCommandsList 
     * @param {Array|str} predefinedPathList 
     * @returns {Array|Array|str} - the modified command list and the path list
     */
    //TODO: the arguments might be redundant
    loadPredefined: (predefinedCommandsList, predefinedPathList) => {
        try{
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
        }
        catch(e){
            if(e.code === 'ENOENT')
                console.error("Error: file not found. Make sure the predefinedCommandsAndPaths.csv' file is in the correct location in the ./Music folder!");
            else
                console.error(e);
        }
    },

    //TODO:arguments might be redundant
    /**
     * The function creates a list of music titles from the outputMisc.txt file and creates a string of sound bites from the given text, read for discord message display.
     * @param {Array|string} miscMusicTitles - the list of music titles
     * @param {string} autoReply - the message
     * @returns {*} - an array which contains the music titles and the resulting message
     */
    loadOutputMisc: (miscMusicTitles, autoReply) => {
        try{
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
        }
        catch(e){
            if(e.code === 'ENOENT')
                console.error("Error: file not found. Make sure the outputMisc.txt file is in the correct location in the ./Music folder!");
            else
                console.error(e);
        }
    },

    /**
     * The function makes a list of kanye soundbites from the outputKanye.txt file
     * @returns {Array|string} the list of soundbites
     */
    loadKanyeMusic: () => {
        try{
        let temp = fs.readFileSync('./Music/outputKanye.txt', 'utf8').split('\n');
        let whatev = temp.pop();
        for(let i = 0; i < temp.length; i++){
            temp[i] = temp[i].replace('\r', '');
            temp[i] = temp[i].replace(' ', '');
            temp[i] = temp[i].toLowerCase();
        }
        return temp;
        }
        catch(e){
            if(e.code === 'ENOENT')
                console.error("Error: file not found. Make sure the outputKanye.txt file is in the correct location in the ./Music folder!");
            else
                console.error(e);
        }
    },

    /**
     * The function makes a list of banned words form the bannedWords.txt file
     * @returns A list of banned words
     */
    loadBannedWords: () => {
        try{
        let temp = fs.readFileSync('./Dialogue/bannedWords.txt', 'utf8').split('\n');
        for(let i = 0; i < temp.length; i++){
            temp[i] = temp[i].replace('\r', '');
        }
        return temp;
        }
        catch(e){
            if(e.code === 'ENOENT')
                console.error("Error: file not found. Make sure the bannedWords.txt file is in the correct location in the ./Dialogue folder!");
            else
                console.error(e);
        }
    }
}