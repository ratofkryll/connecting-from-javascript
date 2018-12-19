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

const addFirstName = process.argv[2];
const addLastName = process.argv[3];
const addBirthdate = process.argv[4];

knex.insert([{first_name: addFirstName, last_name: addLastName, birthdate: addBirthdate}]).into('famous_people').asCallback((err, res) => {
  if (err) {
    console.log('Insert Err: ', err);
  } else {
    console.log('Inserting');
  }
  knex.destroy((err, res) => {
    if (err) {
      console.log('Destroy Err: ', err);
    } else {
      console.log('Done!');
    }
  });
});
