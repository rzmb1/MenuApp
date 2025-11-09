const seedrandom = require('seedrandom');

const menuPlans = require('./initial_menuplans');
const users = require('./initial_users');
const { dataDate } = require('./test-data-config');
const { dateToStandardString } = require('../utils/dateFunctions');
const DAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
const comments = {
    2:["Schlechte Bedienung","Esse ich nie wieder","Kann ich nicht empfehlen","Wird Zeit für einen neuen Koch","Nicht genießbar"],
    3:["Zu wenig gewürzt","Hätte besser sein können","Habe mir etwas anderes vorgestellt","Pizza ist besser","Definitiv nicht frisch"],
    4:["Zu viel gewürzt","War ganz ok, aber nicht mein Geschmack","Schmeckt gut","Ganz passabel","Hat sich deutlich gebessert","Musste lange warten, Essen war aber gut"],
    5:["Definitiv mein Lieblingsessen","War sehr gut","Würde ich wieder essen","Eines der besseren Gerichte","Kann ich weiterempfehlen"]
}

function weightedRandom(weights){
    let weightCum=0;
    let weightsCum=[];
    for(let i=0;i<weights.length;i++){
        weightCum+=weights[i];
        weightsCum.push(weightCum);
    }
    let random = Math.random()*weightCum;
    return weightsCum.findIndex(weight => weight >= random);
}

let customers = users.filter(user => user.roles.includes('customer'));

let signups = [];
for(let menuplan of menuPlans) {
    let publishedDate = new Date(menuplan.startDate);
    publishedDate.setDate(publishedDate.getDate()-10-Math.floor(Math.random()*4));
    for(let day in menuplan.days) {
        let date = new Date(menuplan.startDate);
        date.setDate(date.getDate()+DAYS.indexOf(day));
        let selectedCustomers = customers.filter(customers => Math.random() > 0.5);
        selectedCustomers = customers.map(customer => {return {...customer,registeredDate: Math.random()<0.5 ? new Date(publishedDate.getTime()+Math.random()*(date.getTime()-publishedDate.getTime())): publishedDate}});
        selectedCustomers = selectedCustomers.filter(customer => customer.registeredDate <= new Date(dataDate));
        date = dateToStandardString(date);
        for(let course of ["Vorspeise", "Hauptspeise", "Nachspeise"]){
            let meals = menuplan.days[day].filter(meal => meal.tags.includes(course));
            meals.push({name:'Abgemeldet',tags:[course]});
            for(let customer of selectedCustomers){
                let signup = {
                    _idUser: customer._id,
                    dish: meals[weightedRandom(meals.map(meal=>seedrandom(meal.name)()))],
                    day: date,
                    createdAt: customer.registeredDate,
                    updatedAt: customer.registeredDate
                }
                if(signup.dish.name != 'Abgemeldet' && new Date(date) < dataDate && Math.random()<0.5){
                    //signup.rating = 2+Math.floor(seedrandom(signup.dish.name)()*3+Math.random()*0.5+seedrandom(date)()*0.5);
                    signup.rating= weightedRandom(Array.from(Array(4)).map((_el,idx)=>seedrandom(signup.dish.name+idx)()+idx/15))+2;
                    if(Math.random()<0.1) {
                        signup.comment=comments[signup.rating][Math.floor(Math.random()*comments[signup.rating].length)]
                    }
                }
                signups.push(signup);
            }
        }
    }
}
// const signups = [
//     {
//         _id: "64529667bffef8c4aae81461",
//         _idUser: "507f1f77bcf86cd799439011",
//         dish: {
//             name: "Salatbuffet",
//             tags: [
//                 "Süß",
//                 "Menü A",
//                 "D",
//                 "Nachspeise"
//             ]
//         },
//         day: "2022-11-15"
//     },

//     {
//         _id: "64529667bffef8c4aae81462",
//         _idUser: "507f1f77bcf86cd799439011",
//         dish: {
//             name: "Rahm-Kren-Suppe",
//             tags: [
//                 "Gemüse",
//                 "Menü B",
//                 "Vegetarisch",
//                 "",
//                 "Hauptspeise"
//             ]
//         },
//         day: "2022-11-15"
//     },
// ]

module.exports = signups