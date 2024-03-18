const env = {
  dbname:"sellerticket",
  dbuser:"root",
  dbpass:"19092544.Kunakron",
  dbconfig:{
    host: "localhost",
    port:"3306",
  },
  dialect: 'mysql',
  pool: {
	  max: 5,
	  min: 0,
	  acquire: 30000,
	  idle: 10000
  }
};
 
module.exports = env;

