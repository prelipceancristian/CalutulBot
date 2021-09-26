const dPS = require('./modules/Utils/defaultPlaySound')
const mC = require('./modules/MultiPlay/multicastPlay')
const sD = require('./modules/Utils/setupData')
const mt = require('./modules/Utils/mute')
const lat = require('./modules/Utils/latin')
const em = require('./modules/Utils/emojify')
const rep = require('./modules/Utils/replyLongText')
const tp = require('./modules/Utils/tip')
const kick = require('./modules/Utils/kick')
const burp = require('./modules/MultiPlay/burp')
const handleMusic = require('./modules/Handlers/handleMusic')
const yt = require('./modules/Controllers/YoutubeController')

const Utils = require('./modules/Utils/Utils')

const Service = require('./modules/CalutulBank/Business/Service')
const KeyError = require('./modules/CalutulBank/Errors/KeyError')
const RepoFile = require('./modules/CalutulBank/Repository/RepoFile')
const ServiceError = require('./modules/CalutulBank/Errors/ServiceError')
const Shopkeeper = require('./modules/Shopkeeper/Shopkeeper')
const FileShopRepo = require('./modules/ShopRepo/FileShopRepo')
const TransactionLogger = require('./modules/TransactionLogger/TransactionLogger')
const FileInventory = require('./modules/Inventory/FileInventory')
const ShopController = require('./modules/Controllers/ShopController')

let transactionLogger = new TransactionLogger('./Logs/logs.log')
let repo = new RepoFile('./Storage/bank.json')
let service = new Service(repo)
let shoprepo = new FileShopRepo('./Storage/shopItems.json')
let inventory = new FileInventory('./Storage/inventory.json')
let shopkeeper = new Shopkeeper(repo, shoprepo, transactionLogger, inventory)
let shopController = new ShopController(shopkeeper)

const utils = new Utils()

const kanyeMusicTitles = sD.loadKanyeMusic()
let helpText = sD.loadHelpFile()
let replies = sD.loadRepliesFile()
let ultraRareReplies = sD.loadRareRepliesFile()
let numberOfBurpFiles = 3

let predefinedCommandsList = []
let predefinedPathList = []

;[predefinedCommandsList, predefinedPathList] = sD.loadPredefined(
  predefinedCommandsList,
  predefinedPathList
)

let miscMusicTitles = []
let autoReply = 'Automatically generated commands:\n'
const adminName = 'monkey king'

let bannedWords = sD.loadBannedWords()
let alwaysOn = false
let burpTimer = new Date(2020, 1, 1, 0, 0, 0)

;[miscMusicTitles, autoReply] = sD.loadOutputMisc(miscMusicTitles, autoReply)

const numberOfBasicVoiceReplies = 10
const numberOfUltraRareVoiceReplies = 5
let enableChatFilter = false
const isLoaded = false

function handleKeywordCalutu (msg) {
  let rarity = Math.floor(Math.random() * 100)
  let newIndex = 0
  let newFilePath = ''
  if (rarity < 10) {
    newIndex = Math.floor(Math.random() * numberOfUltraRareVoiceReplies) + 1
    newFilePath = './Music/UltraRare/Calutul' + newIndex.toString() + '.mp3'
  } else {
    newIndex = Math.floor(Math.random() * numberOfBasicVoiceReplies) + 1
    newFilePath = './Music/Basic/Calutul' + newIndex.toString() + '.mp3'
  }
  dPS.defaultPlaySound(msg, newFilePath, alwaysOn) //TODO: make this not dependent on the numberOf...
}

function handleKeywordBurp (msg) {
  burpTimer = burp.handleBurp(msg, burpTimer, alwaysOn, numberOfBurpFiles)
}

function handleKeywordHelp (msg) {
  return rep.replyLongText(msg, helpText)
}

function handleKeywordAutohelp (msg) {
  return msg.reply(autoReply)
}

function handleKeywordAskkanye (msg) {
  const path =
    './Music/Kanye/' +
    kanyeMusicTitles[Math.floor(Math.random() * kanyeMusicTitles.length)]
  dPS.defaultPlaySound(msg, path, alwaysOn)
}

function handleKeywordKick (msg) {
  kick.handleKick(msg)
}

function handleKeywordMute (msg) {
  mt.muteUser(msg)
}

function handleKeywordUnmute (msg) {
  mt.unmuteUser(msg)
}

function handleKeywordLatin (msg) {
  msg.reply(lat.textToLatin(msg))
}

function handleKeywordEmojify (msg) {
  msg.reply(em.emojify(msg))
}

function handleKeywordEnablefilter (msg) {
  if (msg.member.roles.cache.find(r => r.name === adminName)) {
    enableChatFilter = true
    msg.reply('The word filter is on.')
  } else {
    msg.reply('You are not the admin.')
  }
}

function handleKeywordDisablefilter (msg) {
  if (msg.member.roles.cache.find(r => r.name === adminName)) {
    enableChatFilter = false
    msg.reply('The word filter is off.')
  } else msg.reply('You are not the admin.')
}

async function handleKeywordBank (msg) {
  if (msg.content.toLowerCase().startsWith('!bankcreate')) {
    try {
      console.log('Creating bank account for ' + msg.author.id)
      const res = await service.createAccount(msg.author.id, 0)
      msg.reply('Account created!')
    } catch (e) {
      if (e instanceof KeyError) {
        msg.reply(e.message)
      } else {
        console.error(e)
      }
    }
  }

  if (msg.content.toLowerCase().startsWith('!bankstatus')) {
    try {
      const res = await service.readAccount(msg.author.id)
      msg.reply('Your current balance is: ' + res.amount + ' CalutulCoins')
    } catch (e) {
      if (e instanceof KeyError) {
        msg.reply(e.message)
      } else {
        console.error(e)
      }
    }
  }

  if (msg.content.toLowerCase().startsWith('!bankgift')) {
    args = msg.content.split(' ')
    service
      .gift(msg.author.id, msg.mentions.users.first().id, args[2])
      .catch(e => {
        if (e instanceof ServiceError) {
          msg.reply(e.message)
        } else {
          if (e instanceof KeyError) {
            msg.reply(e.message)
          } else {
            console.error(e.message)
          }
        }
      })
  }
}

function handleKeywordTip (msg) {
  args = msg.content
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
  if (args.length != 2) {
    msg.reply('Command usage: !tip @user')
  } else {
    service
      .gift(msg.author.id, msg.mentions.users.first().id, 50)
      .then(() => {
        msg.channel.send({
          files: ['./Images/buyback.png'],
          embed: tp.tip(msg.author, msg.mentions.users.first(), '50')
        }) //TODO: make this a Utils function
        if (msg.member.voice.channel) {
          dPS.defaultPlaySound(msg, './Music/coins.wav', alwaysOn)
        }
      })
      .catch(e => {
        if (e instanceof ServiceError) {
          msg.reply(e.message)
        } else {
          if (e instanceof KeyError) {
            msg.reply(e.message)
          } else {
            console.error(e.message)
          }
        }
      })
  }
}

function handleKeywordToggleon (msg) {
  alwaysOn = true
  msg.channel.send('Always on mode is activated!')
}

function checkFilter (msg) {
  if (enableChatFilter) {
    msg.content
      .replace(/[^a-zA-Z ]/g, '')
      .split(' ')
      .forEach(element => {
        if (bannedWords.includes(element.toLowerCase()))
          msg
            .delete({
              timeout: 0,
              reason: 'User used a banned word: ' + element
            })
            .then(msg => {
              console.log(`Deleted message from ${msg.author.username}`)
              msg.channel.send(
                `<@${msg.author.id}> not cool man, that is a banned word`
              )
              //TODO: maybe a break statement here?
            })
            .catch(console.error)
      })
  }
}

function handleKeywordToggleoff (msg) {
  alwaysOn = false
  msg.channel.send('Always on mode is deactivated!')
  if (msg.guild.me.voice.channel) {
    msg.member.voice.channel
      .join()
      .then(VoiceConnection => VoiceConnection.disconnect())
  }
}

function checkTextReply (msg) {
  if (!msg.author.bot) {
    const chance = Math.floor(Math.random() * 100)
    if (chance <= 2) {
      //ultrarare reply
      const index = Math.floor(Math.random() * ultraRareReplies.length)
      msg.reply('**' + ultraRareReplies[index] + '**')
    } else if (chance <= 32) {
      const index = Math.floor(Math.random() * replies.length)
      msg.reply(replies[index])
    }
  }
}

function checkPredefinedSounds (msg) {
  if (predefinedCommandsList.includes(msg.content.toLowerCase())) {
    dPS.defaultPlaySound(
      msg,
      predefinedPathList[predefinedCommandsList.indexOf(msg.content)],
      alwaysOn
    )
  }
}

function checkMiscSounds (msg) {
  if (
    miscMusicTitles.includes(msg.content.replace('!', '').toLowerCase()) &&
    msg.content[0] == '!'
  ) {
    let miscFilePath = './Music/Misc/' + msg.content.replace('!', '') + '.mp3'
    dPS.defaultPlaySound(msg, miscFilePath, alwaysOn)
  }
}

function logMessage (msg) {
  console.log(
    msg.author.username + ' at ' + utils.stringDate() + ' wrote: ' + msg.content
  )
}

class MessageHandler {
  constructor () {}

  /**
   * Checks the message content and acts accordingly
   * @param {Message} msg - the message sent in the discord textchannel
   */
  async handleMessage (msg) {
    logMessage(msg)
    shopController.handleTransaction(msg)
    checkFilter(msg)
    checkTextReply(msg)
    checkPredefinedSounds(msg)
    checkMiscSounds(msg)

    let keyword = msg.content.split(' ')[0].toLowerCase()

    const keywordToFunction = {
      '!calutu': handleKeywordCalutu,
      '!burp': handleKeywordBurp,
      '!help': handleKeywordHelp,
      '!autohelp': handleKeywordAutohelp,
      '!askkanye': handleKeywordAskkanye,
      '!kick': handleKeywordKick,
      '!mute': handleKeywordMute,
      '!unmute': handleKeywordUnmute,
      '!latin': handleKeywordLatin,
      '!emojify': handleKeywordEmojify,
      '!enablefilter': handleKeywordEnablefilter,
      '!disablefilter': handleKeywordDisablefilter,
      '!bankstatus': handleKeywordBank,
      '!bankcreate': handleKeywordBank,
      '!banktip': handleKeywordBank, //TODO: fix multiple calls to this handler function
      '!tip': handleKeywordTip,
      '!toggleon': handleKeywordToggleon,
      '!toggleoff': handleKeywordToggleoff,
      '!play': handleMusic.handlePlay,
      '!stop': handleMusic.handleStop,
      '!pause': handleMusic.handlePause,
      '!skip': handleMusic.handleSkip,
      '!queue': handleMusic.handleQueue,
      '!test': yt.check,
    }

    if (keyword in keywordToFunction) {
      keywordToFunction[keyword](msg)
    }
  }
}

module.exports = MessageHandler
