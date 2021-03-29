const fs = require('fs');

module.exports = {
    loadOutputMisc: function(){
        fs.readFile('C:/Users/Cristi/Desktop/CalutulBot/Music/outputMisc.txt', 'utf8', function (err,data) {
            if (err) {
              return console.log(err);
            }
            miscMusicTitles = data;
            //console.log(miscMusicTitles);
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
        }); //FIXME: start working asynchronosly to actually load this funcion in the main body, add comms
    },

    loadHelpFile: () => fs.readFileSync('C:/Users/Cristi/Desktop/CalutulBot/Dialogue/help.txt', 'utf8'),
    loadRepliesFile: () => fs.readFileSync('C:/Users/Cristi/Desktop/CalutulBot/Dialogue/replies.txt', 'utf8').split('\n'),
    loadRareRepliesFile: () => fs.readFileSync('C:/Users/Cristi/Desktop/CalutulBot/Dialogue/rareReplies.txt', 'utf8').split('\n'),
    loadPredefined: (predefinedCommandsList, predefinedPathList) => {
        let data = fs.readFileSync('C:/Users/Cristi/Desktop/CalutulBot/Music/predefinedCommandsAndPaths.csv', 'utf8');
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
    loadOutputMisc: (miscMusicTitles, autoReply) => {
        let temp = fs.readFileSync('C:/Users/Cristi/Desktop/CalutulBot/Music/outputMisc.txt', 'utf8');
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
    loadKanyeMusic: () => {
        let temp = fs.readFileSync('C:/Users/Cristi/Desktop/CalutulBot/Music/outputKanye.txt', 'utf8').split('\n');
        let whatev = temp.pop();
        for(let i = 0; i < temp.length; i++){
            temp[i] = temp[i].replace('\r', '');
            temp[i] = temp[i].replace(' ', '');
            temp[i] = temp[i].toLowerCase();
        }
        return temp;
    },

    loadBannedWords: () => {
        let temp = fs.readFileSync('C:/Users/Cristi/Desktop/CalutulBot/Dialogue/bannedWords.txt', 'utf8').split('\n');
        for(let i = 0; i < temp.length; i++){
            temp[i] = temp[i].replace('\r', '');
        }
        return temp;
    }
}