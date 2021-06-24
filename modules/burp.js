mC = require('./multicastPlay')
dPS = require('./defaultPlaySound')
mPS = require('./multicastPlaySound')

module.exports = {
  /**
   * The function checks whether the burp sounds can be played and issues the voice channel command
   * @param {Message} msg - the message that issued the command
   * @param {Date} burpTimer - the last time the burp command was issued
   * @param {Boolean} alwaysOn - whether the bot should disconnect on end
   * @param {Number} numberOfBurpFiles - how many burp sounds are available
   * @returns {Date} now - the current date when the command was given
   */
  handleBurp: function (msg, burpTimer, alwaysOn, numberOfBurpFiles) {
    const timeLimit = 5
    let now = new Date()
    let cringeFactor = now - burpTimer
    cringeFactor = Math.ceil(cringeFactor / (1000 * 60))
    let burpMulticast = mC.calculateMulticast()
    
    if (cringeFactor < timeLimit) {
      msg.reply(
        'The last burp command was ' +
          cringeFactor.toString() +
          ' min ago. Kinda cringe. Try again in ' +
          (timeLimit - cringeFactor).toString() +
          ' min'
      )
      dPS.defaultPlaySound(msg, './Music/Wee.mp3', alwaysOn)
    } else {
      let burpFileIndex = Math.floor(Math.random() * numberOfBurpFiles) + 1
      let filepath =
        'C:/Users/Cristi/Desktop/CalutulBot/Music/Burp/Burp' +
        burpFileIndex.toString() +
        '.mp3'
      mPS.multicastPlaySound(msg, filepath, burpMulticast, alwaysOn)
    }
    return now
  }
}
