'use strict';

const Joi = require('joi');
const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');
const app = express();

app.use(express.json());

async function run() {

  let connection;

  try {
    // Get a non-pooled connection
    connection = await oracledb.getConnection(dbConfig);

	console.log('Connection was successful!');
	
	const result = await connection.execute(
		`SELECT * FROM access_user` // bind value for :id
	  );
	  console.log(result.rows);

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();