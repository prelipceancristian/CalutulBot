const errorMsg = "Error in testShoppable";

const Shoppable = require('../modules/Shop/Shoppable');

let myShoppable1 = new Shoppable(1, "RandomObject", "This is a simple example of a description and serves little to no purpose", "Cathegory1");
let myShoppable2 = new Shoppable(2, "AlsoRandomObject", "I am bored", "Cathegory1");

console.log("\x1b[32m%s\x1b[0m", "Testing Shoppable objects");

console.assert(myShoppable1.id === 1, errorMsg, "id error");
console.assert(myShoppable2.id === 2, errorMsg, "id error");
console.assert(myShoppable1.name === "RandomObject", errorMsg, "name error");
console.assert(myShoppable1.cathegory === "Cathegory1", errorMsg, "cathegory error");
console.assert(myShoppable2.cathegory === myShoppable1.cathegory, errorMsg, "cathegory error");