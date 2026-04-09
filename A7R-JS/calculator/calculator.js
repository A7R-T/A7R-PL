const prompt = require('prompt-sync')();

let num1, num2, opr

num1 = prompt("Num1: ");
opr = prompt("Opr: ");
num2 = prompt("Num2: ");

switch (opr) {
    case '+':
        console.log(Number(num1) + Number(num2));
        break;
    case '-':
        console.log(Number(num1) - Number(num2));
        break;
    case '*':
        console.log(Number(num1) * Number(num2));
        break;
    case '/':
        console.log(Number(num1) / Number(num2));
        break;
    case '%':
        console.log(Number(num1) % Number(num2));
        break;
    case '^':
        console.log(Number(num1) ** Number(num2));
        break;
    default:
        console.log("wrong opeerator try again");
}


