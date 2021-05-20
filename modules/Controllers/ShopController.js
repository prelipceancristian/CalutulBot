const ItemEmbed = require('../UI/ItemEmbed')

class ShopController {
  constructor (_shopkeeper) {
    this.shopkeeper = _shopkeeper
  }

  async handleTransaction (msg) {
    if (msg.content.toLowerCase().startsWith('!shoplist')) {
      const itemEmbed = new ItemEmbed()
      Array.from(await this.shopkeeper.shopRepo.getAll()).forEach(element => {
        msg.channel.send({ embed: itemEmbed.createEmbed(element) })
      })
    }

    if (msg.content.toLowerCase().startsWith('!buy')) {
      const args = msg.content.split(' ')
      try {
        await this.shopkeeper.buy(msg.author.id, args[1])
        msg.reply('Item was bought successfully!')
      } catch (err) {
        if (err.name == 'KeyError' || err.name == 'ShopkeeperError')
          msg.reply('Error: ' + err.message)
        else {
          msg.reply('Unhandled error, sorry for the inconvenience!')
          console.error(err)
        }
      }
    }

    if (msg.content.toLowerCase().startsWith('!inventory')) {
      const itemIds = await this.shopkeeper.inventory.read(msg.author.id)
      let ans = '\n'
      for (let index = 0; index < itemIds.length; index++) {
        const item = await this.shopkeeper.shopRepo.read(itemIds[index])
        ans += `${itemIds[index]} - ${item.name}\n`
      }
      if (ans === '\n') ans = 'No items in your inventory!'
      msg.reply(ans)
    }

    if (msg.content.toLowerCase().startsWith('!sell')) {
      const args = msg.content.split(' ')
      try {
        await this.shopkeeper.sell(msg.author.id, args[1])
        msg.reply('Item was sold successfully!')
      } catch (err) {
        if (err.name == 'KeyError' || err.name == 'ShopkeeperError')
          msg.reply('Error: ' + err.message)
        else {
          msg.reply('Unhandled error, sorry for the inconvenience!')
          console.error(err)
        }
      }
    }
  }
}

module.exports = ShopController
