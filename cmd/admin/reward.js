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
	var user,lastchar;
	 user = getUserFromMention(args[0]);
	 lastchar = args[1].charAt(args[1].length-1);
    var letters = /^[A-Za-z]+$/;
	if(user != undefined && lastchar.match(letters) ) {
		var numericdata = args[1].replace(/\D/g,'');
		var c_value;
		if(lastchar == "g") {
			c_value = numericdata * 10000;
		} else if(lastchar == "s") {
			c_value = numericdata * 100;
		} else if (lastchar == "c") {
			c_value = numericdata;
		} else {
			return;
		}

		var uid = user.id;

		// identify if copper , gold, silver
		var sql;
		var currency;

		var copper = c_value % 100;

		// silver
		var m = (c_value - copper) / 100;
		var silver =  m % 100;

		// gold
		var gold = (m - silver) / 100;



		sql = "INSERT INTO money (userid,value) VALUES (?,?)";

		db.query(sql, [uid,c_value], function(err, result) {
		    if (err) throw err;
		    message.channel.send(`Added ${gold} Gold, ${silver} Silver, ${copper} Copper to <@${uid}>!`)
		});
	} else {
		message.reply("Wrong input! `sv!add <mention user> <value>`")
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