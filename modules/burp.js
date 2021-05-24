mC = require('./multicastPlay')
dPS = require('./defaultPlaySound')
mPS = require('./multicastPlaySound')

module.exports = {
  handleBurp: function (msg, burpTimer, alwaysOn, numberOfBurpFiles) {
    let timeLimit = 5
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
      let burpFileIndex = Math.floor(Math.random() * numberOfBurpFiles) + 1;
      //let filepath = 'C:/Users/Cristi/Desktop/CalutulBot/Music/Burp/Burp' + burpFileIndex.toString() + '.mp3'
      let filepath = 'C:/Users/Cristi/Desktop/CalutulBot/modules/Calutul1.mp3'
      console.log(filepath);
      mPS.multicastPlaySound(msg, filepath, 2, alwaysOn)
    }
    return burpTimer
  }
}