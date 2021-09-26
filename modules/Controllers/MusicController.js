const ytdl = require('ytdl-core')
const YoutubeController = require('./YoutubeController')

class MusicController {
  servers = {}
  youtubeController = new YoutubeController();

  /**
   * The function adds the new song to the queue and plays all the songs in the queue
   * @param {Message} msg -  the message that issued the command 
   */
  playLoop (msg) {
    let server = this.servers[msg.guild.id]
    const stream = ytdl(server.queue[0], { filter: 'audioonly' })

    server.dispatcher = server.currentConnection.play(stream)
    msg.channel.send(`*Now playing ${server.titleQueue[0]}*`)

    server.dispatcher.on('finish', () => {
      server.queue.shift()
      server.titleQueue.shift()
      if (server.queue[0]) {
        this.playLoop(msg)
      } else {
        debugger
        server.currentConnection.disconnect()
        server.currentConnection = null
      }
    })
  }

  /**
   * The function prepares the play routine and establishes the connection with the voiceChannel
   * @param {Message} msg - the message that issued the command
   */
  async play (msg) {
    if (!this.servers[msg.guild.id]) {
      this.servers[msg.guild.id] = {
        queue: [],
        titleQueue: [],
        dispatcher: null,
        currentConnection: null
      }
    }
    const link = await this.getLink(msg)
    const title = await this.getTitle(link)
    msg.reply(`Added ${title} to the queue!`)
    this.addToQueue(msg, link, title)
    this.connectToVoice(msg)  
  }

  pause (args) {
    //idk lol
  }

  skip (msg) {
    let server = this.servers[msg.guild.id]
    if (server.dispatcher) {
      server.dispatcher.end();
    }
  }

  addToQueue (msg, link, title) {
    let server = this.servers[msg.guild.id]
    server.queue.push(link)
    server.titleQueue.push(title)
  }

  async getTitle(link) {
    return (await ytdl.getInfo(link)).videoDetails.title;
  }

  getTitleQueue (msg) {
    return this.servers[msg.guild.id].titleQueue
  }

  connectToVoice(msg) {
    let server = this.servers[msg.guild.id]
    //TODO: already in use on another channel
    if (!msg.guild.me.voice.channel) {
      msg.member.voice.channel.join().then(connection => {
        server.currentConnection = connection
        this.playLoop(msg)
      })
    } else {
      //TODO: what happens when the bot is already talking?
      if (!server.currentConnection) {
        msg.guild.me.voice.channel.leave()
        msg.member.voice.channel.join().then(connection => {
          server.currentConnection = connection
          this.playLoop(msg)
        })
      }
    }
  }

  stop(msg) {
    let server = this.servers[msg.guild.id]
    if(msg.guild.me.voice.channel) {
      for (let i = server.queue.length -1; i >= 0; i--) {
        server.queue.splice(i, 1)
        server.titleQueue.splice(i, 1)
      }
      server.dispatcher.end()
      console.log('stops the queue')
    }
    if(msg.guild.me.voice.channel) {
      msg.guild.me.voice.channel.leave()
      //server.currentConnection = null
    }
  }

  checkIfYtLink(msg) {
    return msg.match(/^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|m\.youtube\.com\/|youtube\.com\/)?(?:ytscreeningroom\?vi?=|youtu\.be\/|vi?\/|user\/.+\/u\/\w{1,2}\/|embed\/|watch\?(?:.*\&)?vi?=|\&vi?=|\?(?:.*\&)?vi?=)([^#\&\?\n\/<>"']*)/i)
  }

  async getLink(msg) {
    const searchTerm = msg.content.split(/ (.+)/)[1]
    if(this.checkIfYtLink(searchTerm)){
      return searchTerm;
    } else {
      return await this.youtubeController.getLinkResult(searchTerm)
    }
  }
}

module.exports = MusicController
