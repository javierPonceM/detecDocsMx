const config = require("config");
const Pool = require('pg').Pool;

const pool = new Pool({
  user: config.get("db.user"),
  host: config.get("db.url"),
  database: config.get("db.database"),
  password: config.get("db.password"),
  port: config.get("db.port")
});

// CREATE TABLE infoFromDocs ( ID SERIAL PRIMARY KEY, documento VARCHAR(30), nombres VARCHAR(50), apellidos VARCHAR(50), fechaNacimiento DATE, direccion VARCHAR(100), cp INT, rostro BYTEA, validez BOOL) 
