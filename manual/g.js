const config = require("./../config.json");
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


	if(args[0] != undefined && args[1] != undefined && args[2] != undefined) {
		var user = getUserFromMention(args[0]);
		var c_type = args[1];
		var c_value = args[2];

		var uid = user.id;

		// identify if copper , gold, silver
		var sql;
		var currency;
		if(c_type === "c") {
			sql = "INSERT INTO copper (userid,value) VALUES (?,?)";
			currency = "copper";
		} else if(c_type === "s") {
			sql = "INSERT INTO silver (userid,value) VALUES (?,?)";
			currency = "silver";
		} else if(c_type === "g") {
			sql = "INSERT INTO gold (userid,value) VALUES (?,?)";
			currency = "gold";
		}	

		db.query(sql, [uid,c_value], function(err, result) {
		    if (err) throw err;
		    message.channel.send(`Added ${c_value} ${currency} to <@${uid}>!`)
		});
	} else {
		message.reply("Wrong input! `sv!g <mention user> <currency> <value>`")
		.then(msg => {
		    msg.delete(
		    	{ timeout: 2000 }
		    )
		});
	}


	function embedbal(date,copper,silver,gold) {

  		var month_name = function(dt){
			mlist = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		  	return mlist[dt.getMonth()];
		};
  		var d = new Date(date);

  		var day = d.getDate();
		var month = month_name(d);
		var year = d.getFullYear();
		 
		var dateStr = month + " " + day + " " + year;

		let embed = new Discord.MessageEmbed()
		.setColor("RANDOM")
		.setTitle(`User Info:`)
		.setDescription(`Username: ${message.author.tag}\nJoined: ${dateStr}`)
		.setThumbnail(message.author.displayAvatarURL())
		.addFields(
			{ name: '\u200B', value: '\u200B' },
			{ name: 'Gold', value: `${gold}`, inline: true },
			{ name: 'Silver', value: `${silver}`, inline: true },
			{ name: 'Copper', value: `${copper}`, inline: true },
			{ name: '\u200B', value: '\u200B' },
		)
		.setTimestamp()
		.setFooter('Otakunity: No weaboo wants to be alone!', 'http://drive.google.com/uc?export=view&id=1yLg-QWF-UCWVbrVwd8OIWobbNrVbePLY');
		message.channel.send(embed);
	}
 	
 	function getUserFromMention(mention) {
		if (!mention) return;

		if (mention.startsWith('<@') && mention.endsWith('>')) {
			mention = mention.slice(2, -1);

			if (mention.startsWith('!')) {
				mention = mention.slice(1);
			}

			return client.users.cache.get(mention);
		}
	}
}