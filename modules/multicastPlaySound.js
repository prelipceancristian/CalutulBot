module.exports = {
  /**
   * Checks for conditions to play the sound and calls the play function.
   * @param {Message} msg - the message that issued the command 
   * @param {String} filepath - the location of the soundbite
   * @param {Number} multicastFactor - how many times the sound should be played
   * @param {Boolean} alwaysOn - whether the voiceconnection should stop after playing the sounds
   * @returns
   */
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
/**
 * Plays a sound multiple times.
 * @param {VoiceConnection} VoiceConnection - the voiceconnection on which to play the sound 
 * @param {*} soundPath - the location of the soundbite
 * @param {*} multicastFactor - how many times the sound should be played
 */
function multicastPlay (VoiceConnection, soundPath, multicastFactor) {
  if (multicastFactor != 0) {
    VoiceConnection.play(soundPath).on('finish', () =>
      multicastPlay(VoiceConnection, soundPath, multicastFactor - 1)
    )
    burpTimer = new Date()
  } else VoiceConnection.disconnect()
}
