const config = require("./../../config.json");
const Discord = require("discord.js");
const mysql = require("mysql");


// database connection
var db = mysql.createConnection({
    host: config.mysqlHost,
    user: config.mysqlUser,
    password: config.mysqlPass,
    database: config.mysqlDB,
    charset: "utf8mb4",

    dateStrings: true
});



exports.run = async (client, message, args, config) => {


 	if(args[1] != "undefined") {
		console.log(args[1]);
		// identify if copper , gold, silver
		var sql;
		if(args[0] === "m") {
			var sql = "UPDATE settings SET maintenance = ?"
		}


		db.query(sql, [args[1]], function(err, result) {
		    if (err) throw err;
		    message.reply(`Success!`)
		});
 	}
}