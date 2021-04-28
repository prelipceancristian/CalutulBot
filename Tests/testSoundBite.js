const errorMsg = "Error in testSoundBite";

const SoundBite = require('../modules/Shop/SoundBite');

console.log("\x1b[32m%s\x1b[0m", "Testing SoundBite objects");

let mySoundBite1 = new SoundBite(1, "RandomObject", "This is a simple example of a description and serves little to no purpose", "Cathegory1", "filePath1");
let mySoundBite2 = new SoundBite(2, "AlsoRandomObject", "I am bored", "Cathegory1", "filePath2");



console.assert(mySoundBite1.id === 1, errorMsg, "id error");
console.assert(mySoundBite2.id === 2, errorMsg, "id error");
console.assert(mySoundBite1.name === "RandomObject", errorMsg, "name error");
console.assert(mySoundBite1.cathegory === "Cathegory1", errorMsg, "cathegory error");
console.assert(mySoundBite2.cathegory === mySoundBite1.cathegory, errorMsg, "cathegory error");