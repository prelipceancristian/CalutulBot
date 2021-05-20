const BankRepo = require('../CalutulBank/Repository/Repo')
const BankRepoFile = require('../CalutulBank/Repository/RepoFile')
const ShopRepo = require('../ShopRepo/ShopRepo')
const FileShopRepo = require('../ShopRepo/FileShopRepo')
const TransactionLogger = require('../TransactionLogger/TransactionLogger')
const Inventory = require('../Inventory/Inventory')
const FileInventory = require('../Inventory/FileInventory')
const ShopkeeperError = require('./ShopkeeperError')
const BankAccount = require('../CalutulBank/Domain/BankAccount')

class Shopkeeper {
  constructor (_bankRepo, _shopRepo, _transactionLogger, _inventory) {
    this.bankRepo = _bankRepo
    this.shopRepo = _shopRepo
    this.transactionLogger = _transactionLogger
    this.inventory = _inventory
  }

  async availableItems () {
    return await this.shopRepo.getAll()
  }

  async filterItemsByCathegory (givenCathegory) {
    var res = await this.shopRepo.getAll()
    return res.filter(item => item.cathegory == givenCathegory)
  }

  /**
   * The function handles the buying operation
   * - creates an account if needed
   * - checks that the user does not have the item and enough money
   * - updates the bankAccount
   * - adds the item to the inventory
   * - log the transaction
   * @param {string} userId - the id of the user
   * @param {string} itemId - the id of the item
   */
  async buy (userId, itemId) {
    const userBankAccount = await this.bankRepo.read(userId)
    const boughtItem = await this.shopRepo.read(itemId)
    if (!(await this.inventory.hasAcc(userId)))
      await this.inventory.create(userId) //create an inventory just in case

    if (await this.inventory.hasItem(userId, itemId))
      //check first if the user already has the item
      throw new ShopkeeperError('You already have this item!')

    if (userBankAccount.amount < boughtItem.price)
      // if not, make sure that the user has enough money
      throw new ShopkeeperError('You do not have enough money for this item!')

    const newUserBankAccount = new BankAccount(
      userId,
      userBankAccount.amount - boughtItem.price
    ) // the bank account after paying for the item
    await this.inventory.add(userId, itemId) // add the item to the inventory of the user
    await this.bankRepo.update(newUserBankAccount) // update the new tem account
    await this.transactionLogger.logToFile(
      userId,
      await this.shopRepo.read(itemId),
      true
    ) // log the transaction
  }

  async sell (userId, itemId) {
    const sellIndex = 0.5
    const userBankAccount = await this.bankRepo.read(userId)
    const soldItem = await this.shopRepo.read(itemId)
    if (!(await this.inventory.hasAcc(userId)))
      await this.inventory.create(userId) //create an inventory just in case

    if (!(await this.inventory.hasItem(userId, itemId)))
      //check first if the user already has the item
      throw new ShopkeeperError('You do not have this item!')

    const newUserBankAccount = new BankAccount(
      userId,
      userBankAccount.amount + sellIndex * soldItem.price
    ) // the bank account after selling the item
    await this.inventory.remove(userId, itemId) // add the item to the inventory of the user
    await this.bankRepo.update(newUserBankAccount) // update the new tem account
    await this.transactionLogger.logToFile(
      userId,
      await this.shopRepo.read(itemId),
      false
    ) // log the transaction
  }
}

module.exports = Shopkeeper
