require('dotenv').config()
const mysql = require('mysql2');

class Database {
  connection
  constructor() {
    console.log('constructut did run');
    this.connection = mysql.createPool({ host: 'localhost', user: 'root', database: 'maps' });
    // this.connection = mysql.createPool({ host: 'ilyaizr.beget.tech', user: 'ilyaizr_maps', 
    // database: 'ilyaizr_maps', password: 'ToE6**dR' });
    // console.log(this.connection);
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err)
          return reject(err);
        resolve(rows);
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if (err)
          return reject(err);
        resolve();
      });
    });
  }
}

module.exports = Database;
