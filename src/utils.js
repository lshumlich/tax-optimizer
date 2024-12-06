

export function dollarFormatter(s) {
    return Number(s.replace(/[$,\s]/g, "")).toLocaleString();
}


console.log("Hello world from utils.js");
// console.log("Hello world from utils.js", require.main);
// console.log("Hello world from utils.js", module);

// if (require.main === module) {
//     runTests();
// }

if (typeof module !== 'undefined' && !module.parent) {
    console.log('This is the main');
    // this is the main module
  } else {
    console.log('This is not the main');
  }

function runTests() {
    console.log('******** Running runTests');
}