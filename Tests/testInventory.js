const errorMsg = "Error in testInventory";
const Inventory = require("../modules/Inventory/Inventory");
const SoundBite = require("../modules/Shop/SoundBite");

console.log("\x1b[32m%s\x1b[0m", "Testing SoundBite objects");

inv = new Inventory();
let mySoundBite1 = new SoundBite(1, "RandomObject", "This is a simple example of a description and serves little to no purpose", "Cathegory1", "filePath1");
let mySoundBite2 = new SoundBite(2, "AlsoRandomObject", "I am bored", "Cathegory1", "filePath2");

inv.create(1);
inv.add(1, 1);
inv.add(1, 2);
try {
    inv.add(1, 2);
    console.assert(false, errorMsg, "shouldnt be able to add here");
} catch (e) {
    if(e.name != 'KeyError')
        console.error(e);
}
try {
    inv.add(2, 1);
} catch (error) {
    if(error.name != 'KeyError')
        console.log(e);
}




//TODO: there should be a database of all shop available objects