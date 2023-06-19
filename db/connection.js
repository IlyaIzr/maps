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
  query(sql, args, skipErrLog = false) {
    return new Promise((resolve, reject) => {
      // execute for https://www.npmjs.com/package/mysql2#using-prepared-statements
      this.connection.query(sql, args, (err, rows) => {
        if (err) {
          !skipErrLog && console.log('error while calling MySql')
          !skipErrLog && console.log('sql: ', sql)
          !skipErrLog && console.log('args: ', args)
          return reject(err);
        }
        if (sql.trim().startsWith('DELETE') && rows?.affectedRows === 0) {
          !skipErrLog && console.log('nothing was deleted on deletion attempt')
          !skipErrLog && console.log('sql: ', sql)
          !skipErrLog && console.log('args: ', args)
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
