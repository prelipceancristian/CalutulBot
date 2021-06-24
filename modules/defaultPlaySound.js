/**
 * A module that allows the bot to play sounds in voice channels
 * @module defaultPlaySound
 */

module.exports = {
  /**
   *
   * Function takes a filePath as an argument and plays the soundbite located at the given location in the current VoiceChannel.
   * @param {Message} msg - the message that issued the command
   * @param {string} filepath - the path at which the soundbite is located
   * @param {boolean} alwaysOn - a variable which tells the bot whether to disconnect from the VoiceChannel or to remain in the room
   */
  defaultPlaySound: function (msg, filepath, alwaysOn) {
    if (!msg.member.voice.channel)
      return msg.reply('We da vezi ca nu esti in voice channel fmm.')

    if (msg.guild.me.voice.channel && !alwaysOn)
      return msg.reply('Vezi ca deja vorbesc ba')

    if (!alwaysOn)
      msg.member.voice.channel
        .join()
        .then(VoiceConnection => {
          VoiceConnection.play(filepath).on('finish', () =>
            VoiceConnection.disconnect()
          )
        })
        .catch(e => console.log(e))
    else
      msg.member.voice.channel.join().then(VoiceConnection => {
        VoiceConnection.play(filepath)
      })
  }
}
