//TODO: add parsing and presetting function
//TODO: create separate files for functions
//TODO: do a switch case instead of this very long if

//TODO: user specific commands
//TODO: text to latinus
//TODO: toggle always on mode

require('dotenv').config(); // use environment files

const Discord = require('discord.js');
const client = new Discord.Client();
const dPS = require('./modules/defaultPlaySound');
const mC = require('./modules/multicastPlay');
const sD = require('./modules/setupData');
const mt = require('./modules/mute');
const lat = require('./modules/latin');
const em = require('./modules/emojify');

let predefinedCommandsList = [];
let predefinedPathList = [];
const numberOfBasicVoiceReplies = 10;
const numberOfUltraRareVoiceReplies = 5;
//TODO: remake load and unload
let burpTimer = new Date(2020, 1, 1, 0, 0, 0);
const numberOfBurpFiles = 3;
let isLoaded = false;
let miscMusicTitles = [];
let kanyeMusicTitles = [];
let autoReply = "Automatically generated commands:\n";

[predefinedCommandsList, predefinedPathList] = sD.loadPredefined(predefinedCommandsList, predefinedPathList);
[miscMusicTitles, autoReply] = sD.loadOutputMisc(miscMusicTitles, autoReply);
kanyeMusicTitles = sD.loadKanyeMusic();
console.log(kanyeMusicTitles);
let helpText = sD.loadHelpFile(); //    WORKS!!!!
let replies = sD.loadRepliesFile();
let ultraRareReplies = sD.loadRareRepliesFile();
// maybe create one big function that does all the loading?

function multicastPlay(VoiceConnection, soundPath, multicastFactor){
    if(multicastFactor != 0)
            {
            VoiceConnection.play(soundPath).on("finish", () => multicastPlay(VoiceConnection, soundPath, multicastFactor - 1));
            burpTimer = new Date();
            }   
    else
        VoiceConnection.disconnect();
}

client.login(process.env.BOTTOKEN);
client.on('ready', readyDiscord);

function readyDiscord() {
    console.log('Connected!');
}

client.on('message', gotMessage);

async function gotMessage(msg){// this function right here is async, which means it allows using await for functions that return promises

        console.log(msg.content);
        let tokens = msg.content.split(' ');
		if(typeof msg.mentions.users.first() !== "undefined"){
            if(msg.mentions.users.first().username == "CalutulBot")
                msg.reply('🖕');
        }
        if(!msg.author.bot)
        {
            let chance = Math.floor(Math.random() * 100);
            //console.log(chance);
            if(chance <= 2){
                //ultrarare reply
                let index = Math.floor(Math.random() * ultraRareReplies.length);
                msg.reply('**' + ultraRareReplies[index] + '**');
            }
            else if (chance <= 12){
                let index = Math.floor(Math.random() * replies.length);
                msg.reply(replies[index]);
            }
        }
    
        if(predefinedCommandsList.includes(msg.content)){
            dPS.defaultPlaySound(msg, predefinedPathList[predefinedCommandsList.indexOf(msg.content)]);
        }

        if(miscMusicTitles.includes(msg.content.replace('!', '')) && msg.content[0] == '!'){
            let miscFilePath = "./Music/Misc/" + msg.content.replace('!', '') + ".mp3";;
            dPS.defaultPlaySound(msg, miscFilePath);          
        }

        if (msg.content.startsWith('!calutu')){
            let rarity = Math.floor(Math.random() * 100);
            let newIndex = 0;
            let newFilePath = "";
            if(rarity < 10){
                newIndex = Math.floor(Math.random() * numberOfUltraRareVoiceReplies) + 1;
                newFilePath = "./Music/UltraRare/Calutul" + newIndex.toString() + ".mp3";
            }
            else{
                newIndex = Math.floor(Math.random() * numberOfBasicVoiceReplies) + 1;
                newFilePath = "./Music/Basic/Calutul" + newIndex.toString() + ".mp3";
            }
            dPS.defaultPlaySound(msg, newFilePath);//TODO: make this not dependent on the numberOf...
        }

        if (msg.content.startsWith('!burp')){
            let timeLimit = 5;
            let now = new Date();
            let cringeFactor = now - burpTimer;
            cringeFactor = Math.ceil(cringeFactor / (1000 * 60));
            let burpMulticast = mC.calculateMulticast();
            if(cringeFactor < timeLimit){
                msg.reply("The last burp command was " + cringeFactor.toString() + ' min ago. Kinda cringe. Try again in ' + (timeLimit - cringeFactor).toString() + ' min');
                dPS.defaultPlaySound(msg, "./Music/Wee.mp3")
            }    
            else{
                if (!msg.member.voice.channel) return msg.reply("Yo you ain't in the channel man not cool.");

                if (msg.guild.me.voice.channel) return msg.reply("I'm already talking lmao");
    
                msg.member.voice.channel.join().then(VoiceConnection => {
                    if(burpMulticast != 1)
                        msg.reply("**MULTICAST X" + burpMulticast.toString() + "!!**");
                    else
                        msg.reply("Only once lmao");
                    let burpFileIndex = Math.floor(Math.random() * numberOfBurpFiles) + 1;
                    multicastPlay(VoiceConnection, "./Music/Burp/Burp" + burpFileIndex.toString() + ".mp3", burpMulticast);
                }).catch(e => console.log(e))
            }
            //TODO: make multicastPlay a separate function
        }

        if(msg.content.startsWith('!help')){
            return msg.reply(helpText);
        }

        if(msg.content.startsWith("!autohelp")){
            return msg.reply(autoReply);
        }

        if(msg.content.startsWith("!askKanye")){
            let f = "./Music/Kanye/" + kanyeMusicTitles[Math.floor(Math.random() * kanyeMusicTitles.length)];
            dPS.defaultPlaySound(msg, f);
        }

        if(msg.content.startsWith("!kick")){
            args = msg.content.split(" ");
            let myUser = msg.mentions.users.first();
            if (myUser){
                let myMember = msg.guild.member(myUser);
                if(myMember){
                    if(myMember.hasPermission('KICK_MEMBERS')){
                        myMember.kick('get nay nayed(u were really bad and got kicked)')
                        .then(() => {
                            msg.reply(`${myUser} succesfully got nay nayed(kicked)!`);
                        })
                        .catch(err => {
                            msg.reply("Unable to ban the member!");
                            console.log("uh oh: " + err);
                        });
                    }
                    else
                        msg.reply("You don't have the permission to kick others!");
                } 
            }
            else{
                msg.reply('You forgot to mention the user!');
            }
        }

        if(msg.content.startsWith("!mute")){
            mt.muteUser(msg);
        }

        if(msg.content.startsWith("!unmute")){
            mt.unmuteUser(msg);
        }

        if(msg.content.startsWith("!latin")){
            msg.reply(lat.textToLatin(msg));
        }

        if(msg.content.startsWith("!emojify")){
            msg.reply(em.emojify(msg));
        }
}

//client.listen(process.env.PORT || 5000);