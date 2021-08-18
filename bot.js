//TODO: add parsing and presetting function
//TODO: do a switch case instead of this very long if
require('dotenv').config() // use environment files

const Discord = require('discord.js')
const client = new Discord.Client()

const MessageHandler = require('./MessageHandler')
const Utils = require('./modules/Utils/Utils')

const utils = new Utils()
let messageHandler = new MessageHandler()

client.login(process.env.BOTTOKEN)
client.on('ready', readyDiscord)

function readyDiscord () {
  console.log('\nConnected at ' + utils.stringDate())
}

client.on('message', messageHandler.handleMessage)
