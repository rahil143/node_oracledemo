'use strict';

const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');

async function run() {

  let connection;

  try {
    // Get a non-pooled connection

    connection = await oracledb.getConnection(dbConfig);

    await demoSetup.setupBf(connection);  // create the demo table

    const result = await connection.execute(
      // The statement to execute
      `SELECT farmer, picked, ripeness
       FROM no_banana_farmer
       where id = :idbv`,

      // The "bind value" 3 for the bind variable ":idbv"
      [3],

      // Options argument.  Since the query only returns one
      // row, we can optimize memory usage by reducing the default
      // maxRows value.  For the complete list of other options see
      // the documentation.
      {
        maxRows: 1
        //, outFormat: oracledb.OUT_FORMAT_OBJECT  // query result format
        //, extendedMetaData: true                 // get extra metadata
        //, fetchArraySize: 100                    // internal buffer allocation size for tuning
      });

    console.log(result.metaData); // [ { name: 'FARMER' }, { name: 'PICKED' }, { name: 'RIPENESS' } ]
    console.log(result.rows);     // [ [ 'Mindy', 2019-07-16T03:30:00.000Z, 'More Yellow than Green' ] ]

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        // Connections should always be released when not needed
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();