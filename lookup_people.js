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

function searchPeople (db, search) {
  db.query(`SELECT * FROM famous_people WHERE first_name ILIKE '${search}' OR last_name ILIKE '${search}';`, (err, res) => {
    console.log('err', err);
    console.log('res', res.rows);
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
  searchPeople(client, search);
});
