const dPS = require('./modules/defaultPlaySound')
const mC = require('./modules/multicastPlay')
const sD = require('./modules/setupData')
const mt = require('./modules/mute')
const lat = require('./modules/latin')
const em = require('./modules/emojify')
const rep = require('./modules/replyLongText')
const tp = require('./modules/tip')
const kick = require('./modules/kick')
const burp = require('./modules/burp')

const Utils = require('./Utils')

const Service = require('./modules/CalutulBank/Business/Service')
const KeyError = require('./modules/CalutulBank/Errors/KeyError')
const RepoFile = require('./modules/CalutulBank/Repository/RepoFile')
const ServiceError = require('./modules/CalutulBank/Errors/ServiceError')
const Shopkeeper = require('./modules/Shopkeeper/Shopkeeper')
const FileShopRepo = require('./modules/ShopRepo/FileShopRepo')
const TransactionLogger = require('./modules/TransactionLogger/TransactionLogger')
const FileInventory = require('./modules/Inventory/FileInventory')
const ShopController = require('./modules/Controllers/ShopController')

let transactionLogger = new TransactionLogger('./logs.log')
let repo = new RepoFile('./bank.json')
let service = new Service(repo)
let shoprepo = new FileShopRepo('./shopItems.json')
let inventory = new FileInventory('./inventory.json')
let shopkeeper = new Shopkeeper(repo, shoprepo, transactionLogger, inventory)
let shopController = new ShopController(shopkeeper)

const utils = new Utils()

kanyeMusicTitles = sD.loadKanyeMusic()
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

;[miscMusicTitles, autoReply] = sD.loadOutputMisc(miscMusicTitles, autoReply)

/**
 * The function allows for playing a soundbite multiple times
 * @param {VoiceConnection} VoiceConnection
 * @param {string} soundPath
 * @param {number} multicastFactor
 */
function multicastPlay (VoiceConnection, soundPath, multicastFactor) {
  if (multicastFactor != 0) {
    VoiceConnection.play(soundPath).on('finish', () =>
      multicastPlay(VoiceConnection, soundPath, multicastFactor - 1)
    )
    burpTimer = new Date()
  } else VoiceConnection.disconnect()
}

class MessageHandler {
  constructor () {
    this.numberOfBasicVoiceReplies = 10
    this.numberOfUltraRareVoiceReplies = 5
    this.burpTimer = new Date(2020, 1, 1, 0, 0, 0)
    this.enableChatFilter = false
    this.isLoaded = false
    this.kanyeMusicTitles = []
    this.alwaysOn = false
  }

  /**
   * Checks the message content and acts accordingly
   * @param {Message} msg - the message sent in the discord textchannel
   */
  async handleMessage (msg) {
    console.log(
      msg.author.username +
        ' at ' +
        utils.stringDate() +
        ' wrote: ' +
        msg.content
    )

    shopController.handleTransaction(msg)

    if (this.enableChatFilter)
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
              })
              .catch(console.error)
        })
    if (!msg.author.bot) {
      let chance = Math.floor(Math.random() * 100)
      if (chance <= 2) {
        //ultrarare reply
        let index = Math.floor(Math.random() * ultraRareReplies.length)
        msg.reply('**' + ultraRareReplies[index] + '**')
      } else if (chance <= 32) {
        let index = Math.floor(Math.random() * replies.length)
        msg.reply(replies[index])
      }
    }

    if (predefinedCommandsList.includes(msg.content.toLowerCase())) {
      dPS.defaultPlaySound(
        msg,
        predefinedPathList[
          predefinedCommandsList.indexOf(msg.content)
        ],
        this.alwaysOn
      )
    }

    if (
      miscMusicTitles.includes(msg.content.replace('!', '').toLowerCase()) &&
      msg.content[0] == '!'
    ) {
      let miscFilePath = './Music/Misc/' + msg.content.replace('!', '') + '.mp3'
      dPS.defaultPlaySound(msg, miscFilePath, this.alwaysOn)
    }

    if (msg.content.toLowerCase().startsWith('!calutu')) {
      let rarity = Math.floor(Math.random() * 100)
      let newIndex = 0
      let newFilePath = ''
      if (rarity < 10) {
        newIndex =
          Math.floor(Math.random() * this.numberOfUltraRareVoiceReplies) + 1
        newFilePath = './Music/UltraRare/Calutul' + newIndex.toString() + '.mp3'
      } else {
        newIndex =
          Math.floor(Math.random() * this.numberOfBasicVoiceReplies) + 1
        newFilePath = './Music/Basic/Calutul' + newIndex.toString() + '.mp3'
      }
      dPS.defaultPlaySound(msg, newFilePath, this.alwaysOn) //TODO: make this not dependent on the numberOf...
    }

    if (msg.content.toLowerCase().startsWith('!burp')) {
      this.burpTimer = burp.handleBurp(msg, this.burpTimer, this.alwaysOn, numberOfBurpFiles)
    }

    if (msg.content.toLowerCase().startsWith('!help')) {
      return rep.replyLongText(msg, helpText)
    }

    if (msg.content.toLowerCase().startsWith('!autohelp')) {
      return msg.reply(autoReply)
    }

    if (msg.content.toLowerCase().startsWith('!askkanye')) {
      let f =
        './Music/Kanye/' +
        kanyeMusicTitles[Math.floor(Math.random() * kanyeMusicTitles.length)]
      dPS.defaultPlaySound(msg, f, this.alwaysOn)
    }

    if (msg.content.toLowerCase().startsWith('!kick')) {
      kick.handleKick(msg)
    }

    if (msg.content.toLowerCase().startsWith('!mute')) {
      mt.muteUser(msg)
    }

    if (msg.content.toLowerCase().startsWith('!unmute')) {
      mt.unmuteUser(msg)
    }

    if (msg.content.toLowerCase().startsWith('!latin')) {
      msg.reply(lat.textToLatin(msg))
    }

    if (msg.content.toLowerCase().startsWith('!emojify')) {
      msg.reply(em.emojify(msg))
    }

    if (msg.content.toLowerCase().startsWith('!enablefilter')) {
      if (msg.member.roles.cache.find(r => r.name === adminName)) {
        this.enableChatFilter = true
        msg.reply('The word filter is on.')
      } else msg.reply('You are not the admin.')
    }

    if (msg.content.toLowerCase().startsWith('!disablefilter')) {
      if (msg.member.roles.cache.find(r => r.name === adminName)) {
        this.enableChatFilter = false
        msg.reply('The word filter is off.')
      } else msg.reply('You are not the admin.')
    }

    if (msg.content.toLowerCase().startsWith('!bankcreate')) {
      try {
        console.log('Creating bank account for ' + msg.author.id)
        const res = await service.createAccount(msg.author.id, 0)
        msg.reply('Account created!')
      } catch (e) {
        if (e instanceof KeyError) msg.reply(e.message)
        else console.error(e)
      }
    }

    if (msg.content.toLowerCase().startsWith('!bankstatus')) {
      try {
        const res = await service.readAccount(msg.author.id)
        msg.reply('Your current balance is: ' + res.amount + ' CalutulCoins')
      } catch (e) {
        if (e instanceof KeyError) msg.reply(e.message)
        else console.error(e)
      }
    }

    if (msg.content.toLowerCase().startsWith('!bankgift')) {
      args = msg.content.split(' ')
      service
        .gift(msg.author.id, msg.mentions.users.first().id, args[2])
        .catch(e => {
          if (e instanceof ServiceError) msg.reply(e.message)
          else if (e instanceof KeyError) msg.reply(e.message)
          else console.error(e.message)
        })
    }

    if (msg.content.toLowerCase().startsWith('!tip')) {
      args = msg.content
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
      if (args.length != 2) msg.reply('Command usage: !tip @user')
      else {
        service
          .gift(msg.author.id, msg.mentions.users.first().id, 50)
          .then(() => {
            msg.channel.send({
              files: ['./Images/buyback.png'],
              embed: tp.tip(msg.author, msg.mentions.users.first(), '50')
            })
            if (msg.member.voice.channel)
              dPS.defaultPlaySound(msg, './Music/coins.wav', alwaysOn)
          })
          .catch(e => {
            if (e instanceof ServiceError) msg.reply(e.message)
            else if (e instanceof KeyError) msg.reply(e.message)
            else console.error(e.message)
          })
      }
    }

    if (msg.content.toLowerCase().startsWith('!toggleon')) {
      alwaysOn = true
      msg.channel.send('Always on mode is activated!')
    }

    if (msg.content.toLowerCase().startsWith('!toggleoff')) {
      this.alwaysOn = false
      msg.channel.send('Always on mode is deactivated!')
      if (msg.guild.me.voice.channel) {
        msg.member.voice.channel
          .join()
          .then(VoiceConnection => VoiceConnection.disconnect())
      }
    }
  }
}

module.exports = MessageHandler
