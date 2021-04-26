//TODO: add parsing and presetting function
//TODO: do a switch case instead of this very long if
require('dotenv').config(); // use environment files

const Discord = require('discord.js');
const client = new Discord.Client();
const dPS = require('./modules/defaultPlaySound');
const mC = require('./modules/multicastPlay');
const sD = require('./modules/setupData');
const mt = require('./modules/mute');
const lat = require('./modules/latin');
const em = require('./modules/emojify');
const rep = require('./modules/replyLongText');
const tp = require('./modules/tip');

let predefinedCommandsList = [];
let predefinedPathList = [];
const numberOfBasicVoiceReplies = 10;
const numberOfUltraRareVoiceReplies = 5;
//TODO: remake load and unload
let burpTimer = new Date(2020, 1, 1, 0, 0, 0);
const numberOfBurpFiles = 3;
let enableChatFilter = false;
let bannedWords = sD.loadBannedWords();
//console.log(bannedWords);
const adminName = "monkey king";
let isLoaded = false;
let miscMusicTitles = [];
let kanyeMusicTitles = [];
let autoReply = "Automatically generated commands:\n";
let alwaysOn = false;

const BankAccount = require("./modules/CalutulBank/Domain/BankAccount");
const Repo = require("./modules/CalutulBank/Repository/Repo");
const Service = require("./modules/CalutulBank/Business/Service");
const KeyError = require("./modules/CalutulBank/Errors/KeyError");
const RepoFile = require("./modules/CalutulBank/Repository/RepoFile");
const { indexOf } = require('ffmpeg-static');
const ServiceError = require('./modules/CalutulBank/Errors/ServiceError');
let repo = new RepoFile("./bank.json")
//let repo = new Repo();
let service = new Service(repo);


[predefinedCommandsList, predefinedPathList] = sD.loadPredefined(predefinedCommandsList, predefinedPathList);
[miscMusicTitles, autoReply] = sD.loadOutputMisc(miscMusicTitles, autoReply);
kanyeMusicTitles = sD.loadKanyeMusic();
//console.log(kanyeMusicTitles);
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

function stringDate(){
    var currentDate = new Date();
    return currentDate.getDate() + "." 
    + (currentDate.getMonth() + 1) + "." 
    + currentDate.getFullYear() + " " 
    + currentDate.getHours() + ":" 
    + currentDate.getMinutes() + ":" 
    + currentDate.getSeconds();
}

function readyDiscord() {
    console.log('\nConnected at ' + stringDate());
}

client.on('message', gotMessage);

async function gotMessage(msg){// this function right here is async, which means it allows using await for functions that return promises

        console.log(msg.author.username + " at " + stringDate() + " wrote: " + msg.content);

        if(enableChatFilter)
            msg.content.replace(/[^a-zA-Z ]/g, "").split(" ").forEach(element => {
                if(bannedWords.includes(element.toLowerCase()))
                    msg.delete({ timeout: 0, reason: "User used a banned word: " + element})
                    .then(msg => {
                        console.log(`Deleted message from ${msg.author.username}`);
                        msg.channel.send(`<@${msg.author.id}> not cool man, that is a banned word`);
                })
                    .catch(console.error);
            });
        else{
            if(typeof msg.mentions.users.first() !== "undefined"){
                if(msg.mentions.users.first().username == "CalutulBot" || msg.mentions.users.first().username == "MehiCalul")
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
                else if (chance <= 32){
                    let index = Math.floor(Math.random() * replies.length);
                    msg.reply(replies[index]);
                }
            }
        
            if(predefinedCommandsList.includes(msg.content.toLowerCase())){
                dPS.defaultPlaySound(msg, predefinedPathList[predefinedCommandsList.indexOf(msg.content)], alwaysOn);
            }

            if(miscMusicTitles.includes(msg.content.replace('!', '').toLowerCase()) && msg.content[0] == '!'){
                let miscFilePath = "./Music/Misc/" + msg.content.replace('!', '') + ".mp3";;
                dPS.defaultPlaySound(msg, miscFilePath, alwaysOn);          
            }

            if (msg.content.toLowerCase().startsWith('!calutu')){
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
                dPS.defaultPlaySound(msg, newFilePath, alwaysOn);//TODO: make this not dependent on the numberOf...
            }

            if (msg.content.toLowerCase().startsWith('!burp')){
                let timeLimit = 5;
                let now = new Date();
                let cringeFactor = now - burpTimer;
                cringeFactor = Math.ceil(cringeFactor / (1000 * 60));
                let burpMulticast = mC.calculateMulticast();
                if(cringeFactor < timeLimit){
                    msg.reply("The last burp command was " + cringeFactor.toString() + ' min ago. Kinda cringe. Try again in ' + (timeLimit - cringeFactor).toString() + ' min');
                    dPS.defaultPlaySound(msg, "./Music/Wee.mp3", alwaysOn)
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
                    }).catch(e => console.error(e))
                }
                //TODO: make multicastPlay a separate function
            }

            if(msg.content.toLowerCase().startsWith('!help')){
                return rep.replyLongText(msg, helpText);
            }

            if(msg.content.toLowerCase().startsWith("!autohelp")){
                return msg.reply(autoReply);
            }

            if(msg.content.toLowerCase().startsWith("!askkanye")){
                let f = "./Music/Kanye/" + kanyeMusicTitles[Math.floor(Math.random() * kanyeMusicTitles.length)];
                dPS.defaultPlaySound(msg, f, alwaysOn);
            }

            if(msg.content.toLowerCase().startsWith("!kick")){
                args = msg.content.split(" ");
                let myUser = msg.mentions.users.first();
                if (myUser){
                    let myMember = msg.guild.member(myUser);
                    if(myMember){
                        if(myMember.hasPermission('ADMINISTRATOR')){
                            myMember.kick('get nay nayed(u were really bad and got kicked)')
                            .then(() => {
                                msg.reply(`${myUser} succesfully got nay nayed(kicked)!`);
                            })
                            .catch(err => {
                                msg.reply("Unable to ban the member!");
                                console.error(err);
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

            if(msg.content.toLowerCase().startsWith("!mute")){
                mt.muteUser(msg);
            }

            if(msg.content.toLowerCase().startsWith("!unmute")){
                mt.unmuteUser(msg);
            }

            if(msg.content.toLowerCase().startsWith("!latin")){
                msg.reply(lat.textToLatin(msg));
            }

            if(msg.content.toLowerCase().startsWith("!emojify")){
                msg.reply(em.emojify(msg));
            }

            if(msg.content.toLowerCase().startsWith("!enablefilter")){
                if(msg.member.roles.cache.find(r => r.name === adminName)){
                    enableChatFilter = true;
                    msg.reply("The word filter is on.");
                }
                else
                    msg.reply("You are not the admin.");

            }

            if(msg.content.toLowerCase().startsWith("!disablefilter")){
                if(msg.member.roles.cache.find(r => r.name === adminName)){
                    enableChatFilter = false;
                    msg.reply("The word filter is off.");
                }
                else
                    msg.reply("You are not the admin.");
            }

            if(msg.content.toLowerCase().startsWith("!bankcreate")){
                try{
                    console.log("Creating bank account for " + msg.author.id);
                    const res = await service.createAccount(msg.author.id, 0);
                    msg.reply("Account created!");
                }
                catch(e){
                    if (e instanceof KeyError)
                        msg.reply(e.message);
                    else
                        console.error(e);
                }
            }

            if(msg.content.toLowerCase().startsWith("!bankstatus")){
                try{
                    const res = await service.readAccount(msg.author.id);

                    msg.reply("Your current balance is: " + res.amount + " CalutulCoins");
                }
                catch(e){
                    if (e instanceof KeyError)
                    msg.reply(e.message);
                else
                    console.error(e);
                }
            }

            if(msg.content.toLowerCase().startsWith("!bankgift")){
                args = msg.content.split(" ");
                service.gift(msg.author.id, msg.mentions.users.first().id, args[2])
                .catch(e => {
                    if(e instanceof ServiceError)
                        msg.reply(e.message);
                    else if(e instanceof KeyError)
                        msg.reply(e.message);
                    else
                        console.error(e.message);
                    });
                }

            if(msg.content.toLowerCase().startsWith("!tip")){
                args = msg.content.replace(/\s+/g, ' ').trim().split(" ");
                if(args.length != 2)
                    msg.reply("Command usage: !tip @user");
                else{
                    service.gift(msg.author.id, msg.mentions.users.first().id, 50)
                    .then(() => {
                        msg.channel.send({files: ["./Images/buyback.png"], embed: tp.tip(msg.author, msg.mentions.users.first(), "50")});
                        if(msg.member.voice.channel)
                            dPS.defaultPlaySound(msg, "./Music/coins.wav", alwaysOn);})
                    .catch(e => {
                        if(e instanceof ServiceError)
                            msg.reply(e.message);
                        else if(e instanceof KeyError)
                            msg.reply(e.message);
                        else
                            console.error(e.message);
                    })
                }
            }

            if(msg.content.toLowerCase().startsWith("!toggleon")){
                alwaysOn = true;
                msg.channel.send("Always on mode is activated!");
            }

            if(msg.content.toLowerCase().startsWith("!toggleoff")){
                alwaysOn = false;
                msg.channel.send("Always on mode is deactivated!");
                if(msg.guild.me.voice.channel){
                    msg.member.voice.channel.join().then(VoiceConnection => VoiceConnection.disconnect());
                }
            }

    }
}

//client.listen(process.env.PORT || 5000);