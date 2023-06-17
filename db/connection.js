require('dotenv').config()
const mysql = require('mysql2');

class Database {
  connection
  constructor() {
    // singleton
    if (Database.created) return Database.instance

    Database.instance = this
    Database.created = true

    console.log('DB connection established, production status: ' + process.env.DEPLOYMENT_STATUS);

    if (process.env.DEPLOYMENT_STATUS === 'dev') {
      this.connection = mysql.createPool({ host: 'localhost', user: 'root', database: 'ilyaizr_maps' })
    } else {
      this.connection = mysql.createPool({
        host: process.env.DBSERVER, user: process.env.DBUSER,
        database: process.env.DBNAME, password: process.env.DBSERVERP
      })
    }
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      // execute for https://www.npmjs.com/package/mysql2#using-prepared-statements
      this.connection.query(sql, args, (err, rows) => {
        if (err) {
          console.log('error while calling MySql')
          console.log('sql: ', sql)
          console.log('args: ', args)
          return reject(err);
        }
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
