const { faker } = require('@faker-js/faker');

const users = [
  {
    "_id":"507f1f77bcf86cd799439004",
    "oid":"06d8f5e2-9de8-4fb4-bdf5-544f48414408",
    "firstname": "Thomas",
    "lastname": "Fischer",
    "email": "fischert@edu.htl-villach.at",
    "roles":["customer"]
  },
  {
    "_id":"507f1f77bcf86cd799439005",
    "oid":"d591dabf-4599-40ca-a1d7-8410aa86806d",
    "active": true,
    "firstname": "Felix",
    "lastname": "Reimüller",
    "email": "reimuelf@edu.htl-villach.at",
    "roles":["customer"]
  },
  {
    "_id":"507f1f77bcf86cd799439006",
    "oid":"0778603c-cee7-4a1d-87f2-213795bd9de3",
    "firstname": "Justus",
    "lastname": "Arndt",
    "email": "arndtj@edu.htl-villach.at",
    "roles":["customer"]
  },
  {
    "_id":"507f1f77bcf86cd799439007",
    "oid":"d655c9a2-1272-465b-aea9-41312677b77c",
    "firstname": "David",
    "lastname": "Weißensteiner",
    "email": "weissend@edu.htl-villach.at",
    "roles":["customer"]
  },
  {
    "_id":"507f1f77bcf86cd799439008",
    "oid":"c30c11d7-3975-4f6c-b9f0-9fa8e1bf9df5",
    "firstname": "Rubens",
    "lastname": "Zambelli",
    "email": "zambellr@edu.htl-villach.at",
    "roles":["customer"]
  },
  {
    "_id":"507f1f77bcf86cd799439009",
    "oid":"6c95d655-2b37-47ae-9cbb-7cbc890d9ac9",
    "firstname": "Achim",
    "lastname": "Karasek",
    "email": "kaa@htl-villach.at",
    "roles":["customer"]
  },
  {
    "_id":"507f1f77bcf86cd799439010",
    "oid":"798e03af-cae5-4315-87a9-aad3205a6613",
    "firstname": "Ingo",
    "lastname": "Kofler",
    "email": "kon@htl-villach.at",
    "roles":["customer"]
  },
  {
    "_id":"507f1f77bcf86cd799439011",
    "firstname": "Annabelle",
    "lastname": "Rodrigues",
    "email": "quinnpeck@ezentia.com",
    "roles":["chef","cook","admin","customer"]
  },
  {
    "_id":"507f1f77bcf86cd799439012",
    "firstname": "Janine",
    "lastname": "Gates",
    "email": "janinegates@ezentia.com",
    "roles":["chef"]
  },
  {
    "_id":"507f1f77bcf86cd799439013",
    "firstname": "Isabelle",
    "lastname": "Hinton",
    "email": "isabellehinton@ezentia.com",
    "roles":["chef","admin"]
  },
  {
    "_id":"507f1f77bcf86cd799439014",
    "firstname": "Corrine",
    "lastname": "Anthony",
    "email": "corrineanthony@ezentia.com",
    "roles":["customer"]
  },
  {
    "_id":"507f1f77bcf86cd799439015",
    "firstname": "Richardson",
    "lastname": "Reilly",
    "email": "richardsonreilly@ezentia.com",
    "roles":["admin"]
  },
  {
    "_id":"507f1f77bcf86cd799439016",
    "firstname": "Morris",
    "lastname": "Gentry",
    "email": "morrisgentry@ezentia.com",
    "roles":["admin","chef"]
  },
  {
    "_id":"507f1f77bcf86cd799439017",
    "firstname": "Betty",
    "lastname": "Owens",
    "email": "bettyowens@ezentia.com",
    "roles":[]
  },
  {
    "_id":"957f1f77bcf86cd799439018",
    "firstname": "Reeves",
    "lastname": "Castillo",
    "email": "reevescastillo@ezentia.com",
    "roles":["chef","cook","customer"]
  },
  {
    "_id":"947f1f77bcf86cd799439019",
    "firstname": "Thomas",
    "lastname": "Student",
    "email": "thomas.student@ezentia.com",
    "roles":["customer"]
  },
  {
    "_id":"927f1f77bcf86cd799439020",
    "firstname": "Thomas",
    "lastname": "Chef",
    "email": "thomas.chef@ezentia.com",
    "roles":["chef"]
  },
  {
    "_id":"917f1f77bcf86cd799439019",
    "firstname": "Thomas",
    "lastname": "Cook",
    "email": "thomas.cook@ezentia.com",
    "roles":["cook"]
  },
  {
    "_id":"907f1f77bcf86cd799439019",
    "firstname": "Thomas",
    "lastname": "Admin",
    "email": "thomas.admin@ezentia.com",
    "roles":["admin"]
  },
  {
    "_id":"807f1f77bcf86cd799439019",
    "firstname": "Thomas",
    "lastname": "User",
    "email": "thomas.user@ezentia.com",
    "roles":["customer","chef","admin","cook"]
  },
  {
    "_id":"717f1f77bcf86cd799439019",
    "firstname": "Felix",
    "lastname": "Student",
    "email": "felix.student@ezentia.com",
    "roles":["customer"]
  },
  {
    "_id":"518f1f77bcf86cd799439020",
    "firstname": "Felix",
    "lastname": "Chef",
    "email": "felix.chef@ezentia.com",
    "roles":["chef"]
  },
  {
    "_id":"518f1f77bcf86cd799439019",
    "firstname": "Felix",
    "lastname": "Cook",
    "email": "felix.cook@ezentia.com",
    "roles":["cook"]
  },
  {
    "_id":"517f1f87bcf86cd799439039",
    "firstname": "Felix",
    "lastname": "Admin",
    "email": "felix.admin@ezentia.com",
    "roles":["admin"]
  },
  {
    "_id":"517f1f77bcf86cd799439439",
    "firstname": "Felix",
    "lastname": "User",
    "email": "felix.user@ezentia.com",
    "roles":["customer","chef","admin","cook"]
  },
  {
    "_id":"517f1f77bcf86cd799439239",
    "firstname": "Rubens",
    "lastname": "Student",
    "email": "rubens.student@ezentia.com",
    "roles":["customer"]
  },
  {
    "_id":"517f1f77bcf86cd799439021",
    "firstname": "Rubens",
    "lastname": "Chef",
    "email": "rubens.chef@ezentia.com",
    "roles":["chef"]
  },
  {
    "_id":"517f1f77bcf86cd799439010",
    "firstname": "Rubens",
    "lastname": "Cook",
    "email": "rubens.cook@ezentia.com",
    "roles":["cook"]
  },
  {
    "_id":"517f1f77bcf86cd799439017",
    "firstname": "Rubens",
    "lastname": "Admin",
    "email": "rubens.admin@ezentia.com",
    "roles":["admin"]
  },
  {
    "_id":"517f1f77bcf86cd799439018",
    "firstname": "Rubens",
    "lastname": "User",
    "email": "rubens.user@ezentia.com",
    "roles":["customer","chef","admin","cook"]
  },
  {
    "_id":"51711f77bcf86cd799439018",
    "firstname": "Guest",
    "lastname": "01",
    "email": "guest01@ezentia.com",
    "roles":["customer"]
  },
  {
    "_id":"51711277bcf86cd799439018",
    "firstname": "Guest",
    "lastname": "02",
    "email": "guest02@ezentia.com",
    "roles":["customer"]
  },
  {
    "_id":"51711377bcf86cd799439018",
    "firstname": "Chef",
    "lastname": "01",
    "email": "chef01@ezentia.com",
    "roles":["chef","admin","cook"]
  },
  {
    "_id":"51711777bcf86cd799439018",
    "firstname": "Chef",
    "lastname": "02",
    "email": "chef02@ezentia.com",
    "roles":["chef","admin","cook"]
  },
];

for (let i = 100; i < 300; i++) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName().split("-").slice(-1)[0];

  users.push({
    "_id": "51711777bcf86cd799439" + i,
    "firstname": firstName,
    "lastname": lastName,
    "email": `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@ezentia.com`,
    "roles": ["customer"]
  });
}

module.exports = users;