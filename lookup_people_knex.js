const pg = require('pg');
const settings = require('./settings'); //settings.json

const knex = require('knex')({
  client: 'pg',
  connection: {
    'user' : settings.user,
    'password' : settings.password,
    'database' : settings.database,
    'hostname': settings.hostname,
    'port': settings.port,
    'ssl': settings.ssl
  }
});

const search = process.argv[2];

knex.count().from('famous_people').where('first_name', search).orWhere('last_name', search).asCallback((err, res) => {
  if (err) {
    console.log('Count Err: ', err);
  } else {
    let count = res[0].count;
    console.log(`Found ${count} person(s) by the name ${search}:`);
  }
});

knex.select().from('famous_people').where('first_name', search).orWhere('last_name', search).asCallback((err, res) => {
  if (err) {
    console.log('Select Err: ', err);
  } else {
    for (let key in res) {
      const person = res[key];
      const date = person.birthdate.toDateString();
      const counter = Number(key);
      console.log(`- ${counter + 1}: ${person.first_name} ${person.last_name}, born ${date}`);
    }
    knex.destroy((err, res) => {
      if (err) {
        console.log('Destroy Err: ', err);
      } else {
        console.log('Done!');
      }
    });
  }
});


// function searchPeople (db, search) {
//   let firstName;
//   let lastName;
//   let dateOfBirth;
//
//   db.query(`SELECT * FROM famous_people WHERE first_name ILIKE '${search}' OR last_name ILIKE '${search}';`, (err, res) => {
//     if (err) {
//       console.error('Search error', err);
//     }
//     for (let key in res.rows) {
//       const person = res.rows[key];
//       const date = person.birthdate.toDateString();
//       const counter = Number(key);
//       console.log(`- ${counter + 1}: ${person.first_name} ${person.last_name}, born ${date}`);
//     }
//     db.end();
//   });
// }

// TODO: Remove below
// client.connect((err) => {
//   if (err) {
//     return console.error('Connection error: ', err);
//   }
//   if (search === undefined) {
//     console.log('Please enter a name to search for.');
//   }
//   console.log('Searching...');
//   console.log(knex);
//   // countResults(knex, search);
//   // searchPeople(knex, search);
// });
