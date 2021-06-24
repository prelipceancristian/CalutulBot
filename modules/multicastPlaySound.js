module.exports = {
  multicastPlaySound: function (msg, filepath, multicastFactor, alwaysOn) {
    if (!msg.member.voice.channel)
      return msg.reply('You are not connected to a voice channel.')

    if (msg.guild.me.voice.channel && !alwaysOn)
      return msg.reply('I am already talking, moron.')

    msg.member.voice.channel.join().then(VoiceConnection => {
      if (multicastFactor != 1)
        msg.reply('**MULTICAST X' + multicastFactor.toString() + '!!**')
      else msg.reply('Only once sadge')
      multicastPlay(VoiceConnection, filepath, multicastFactor)
    })
  }
}

function multicastPlay (VoiceConnection, soundPath, multicastFactor) {
  if (multicastFactor != 0) {
    VoiceConnection.play(soundPath).on('finish', () =>
      multicastPlay(VoiceConnection, soundPath, multicastFactor - 1)
    )
    burpTimer = new Date()
  } else VoiceConnection.disconnect()
}
