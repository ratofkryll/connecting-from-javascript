const pg = require('pg');
const settings = require('./settings'); //settings.json

const client = new pg.Client({
  user: settings.user,
  password: settings.password,
  database: settings.database,
  host: settings.hostname,
  port: settings.port,
  ssl: settings.ssl
});

const search = process.argv[2];

function countResults (db, search) {
  let count;
  db.query(`SELECT count(*) FROM famous_people WHERE first_name ILIKE '${search}' OR last_name ILIKE '${search}';`, (err, res) => {
    if (err) {
      console.error('Search error', err);
    }
    count = res.rows[0]['count'];
    console.log(`Found ${count} person(s) by the name ${search}:`);
  });
}

function searchPeople (db, search) {
  let firstName;
  let lastName;
  let dateOfBirth;

  db.query(`SELECT * FROM famous_people WHERE first_name ILIKE '${search}' OR last_name ILIKE '${search}';`, (err, res) => {
    if (err) {
      console.error('Search error', err);
    }
    for (let key in res.rows) {
      const person = res.rows[key];
      const date = person.birthdate.toDateString();
      const counter = Number(key);
      console.log(`- ${counter + 1}: ${person.first_name} ${person.last_name}, born ${date}`);
    }
    db.end();
  });
}

client.connect((err) => {
  if (err) {
    return console.error('Connection error: ', err);
  }
  if (search === undefined) {
    console.log('Please enter a name to search for.');
  }
  console.log('Searching...');
  countResults(client, search);
  searchPeople(client, search);
});
