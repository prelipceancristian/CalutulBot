module.exports = {
  handleKick: function (msg) {
    args = msg.content.split(' ')
    let myUser = msg.mentions.users.first()
    if (myUser) {
      let myMember = msg.guild.member(myUser)
      if (myMember) {
        if (myMember.hasPermission('ADMINISTRATOR')) {
          myMember
            .kick('get nay nayed(u were really bad and got kicked)')
            .then(() => {
              msg.reply(`${myUser} succesfully got nay nayed(kicked)!`)
            })
            .catch(err => {
              msg.reply('Unable to ban the member!')
              console.error(err)
            })
        } else msg.reply("You don't have the permission to kick others!")
      }
    } else {
      msg.reply('You forgot to mention the user!')
    }
  }
}
