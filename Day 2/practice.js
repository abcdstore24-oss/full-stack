console.log("Hello"); //Print

//Declare let or const
let age=22;
console.log(age);
const name1="Pinkey";
age=true;
console.log(age);

//Comparison == or ===
console.log("5"==5); //Just value compare
console.log("5"===5); //both compare value & type

//number, strings, booleans, null or undefined

//template literals
console.log(`Name: ${name1}`);

// Functions
function add(a, b){
    //function work
    return a+b;
}
console.log(add(5,15));

// Arrow Function
const sub = (a,b) => {
    return a-b;
}
console.log(sub(19,2))

// Array
const fruits = ['mango', 'banana', 'apple'];
console.log(fruits[1]);

// OBJECT (JSON)
const student ={
    name:"Pinkey Prasad",
    degree: "BTECH",
    grad_year: 2026
}

console.log(student.name)

// array of objects
const students = [
    {name:"Pinkey", marks:100},
    {name:"Saheel", marks: 200},
    {name:"Rishu", marks: 90},
    {name:"Pinkey", marks:900},

]
// Iterate
const marks=students.map(s=>s.marks+1);
console.log(marks);

// Filter
const passed = students.filter(s => s.marks>99);
console.log(passed);

// Find
const pink= students.find(s => s.name="Pinkey");
console.log(pink);

// const student ={
//     name:"Pinkey Prasad",
//     degree: "BTECH",
//     grad_year: 2026
// }

// Destructing
// const name_p= student.name;
// const degree = student.degree;
const {name, degree, grad_year}=student;
console.log(`${name}, ${degree}, ${grad_year}`);

// Spread
// const fruits = ['mango', 'banana', 'apple'];
const moreFruits = [...fruits, 'orange'];
console.log(moreFruits);

// Async fetching
async function getUsers(){
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await response.json();
    const usergt9 =users.filter(users=>users.id>9)
    console.log(usergt9.map(usersgt9=>usersgt9.email));
}
// getUsers();

try{
    const res= await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await res.json();
    console.log("DONE")
} catch{
    console.log("Something went wrong")
}

// loops
for (let i=0;i<3;i++){
    console.log(i);
}
for (const fruit of fruits){
    console.log(fruit);
}

// Condition && or ||
let marks1 = 50;
if(marks1>50){
    console.log("P");
} else{
    console.log("F");
}

// Ternary
const result = marks>50 ? "P":"F";
console.log(result);

// object nested
const s={
    name:"Pinkey",
    marks: [82,89,99,100],
    address: {
        pincode: "736182"
    }
}

console.log("Student")
console.log(s.marks[2]);
console.log(s.address.pincode);

console.log(s.address.city?.market);
const city = s.address.city || "Unknown City";
console.log(city)

// array destructing
const names = ['pinkey', 'ravi','rishu', 'saheel'];
const [first,b,c]=names;
console.log(first,b);


const stu={name:"Anish", city: "Banglore"};
const updated = {...stu, degree:"BTECH"};
console.log(updated);

// const names = ['pinkey', 'ravi','rishu', 'saheel'];
const [a, ...rest]=names;
console.log(rest);

// reduce -> single value return
const mark =[82, 45, 60];
const total = mark.reduce((sum, current)=>sum+current, 0);
console.log(total)

let isloggedIn=false;
isloggedIn && console.log("Logged In");

import {product} from "./mathUtils.js";
console.log(product(5,9));

async function run(){
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await res.json();

    console.log("**************");
    // Destructure
    const {name, email} = users[0];
    console.log(name, email);
    console.log(users.length);
    const names = users.map(u=>u.name).sort();
    console.log(names);

    const nameStartA = users.filter(u=>u.name.startsWith("A"));
    console.log(nameStartA);
}
// run();


const a1=5;
const b1=10;
console.log(`${a1+b1}`);

// truthy and falsy
// Truth - "0" string [] everything else
// False - 0, "", null, undefined, NaN

console.log("1");
setTimeout(()=>{
    console.log("2");
},5000)
console.log("3")

// includes
const cities = ["KOL", "MUM","SLG"]
console.log(cities.includes("KOL"));

// SOME  and EVERY
console.log("Some and EVERY")
const marksss = [70,10,50];
console.log(marksss.some(m=>m>20)); //true or false

console.log(marksss.every(m=>m>9));  // true or false