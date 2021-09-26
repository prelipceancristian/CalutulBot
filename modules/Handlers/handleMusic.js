const MusicController = require('../Controllers/MusicController')
const musicController = new MusicController()

async function handlePlay (msg) {
  const args = msg.content
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')

  if (!args[1]) {
    msg.reply('You need to provide a search term!')
    return
  }

  if (!msg.member.voice.channel) {
    msg.reply('You are not in a voiceChannel!')
    return
  }

  await musicController.play(msg)
}

function handleStop (msg) {
  musicController.stop(msg)
  msg.reply('Stopping the music queue!')
}

function handleSkip (msg) {
  musicController.skip(msg)
  msg.reply('Skipping current song!')
}

function handlePause (msg) {
  msg.reply('pass')
}

function handleQueue (msg) {
  const titleQueue = musicController.getTitleQueue(msg)
  if (titleQueue.length) {
    let answer = ''
    for (let i = 1; i <= titleQueue.length; i++) {
      let currentLine = `${i}. ${titleQueue[i - 1]}\n`
      answer += currentLine
    }
    msg.reply(answer)
  } else {
    msg.reply('There are no songs in queue right now')
  }
}

exports.handlePlay = handlePlay
exports.handleStop = handleStop
exports.handlePause = handlePause
exports.handleSkip = handleSkip
exports.handleQueue = handleQueue
