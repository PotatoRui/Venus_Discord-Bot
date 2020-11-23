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


// let guildid = message.guild.id; // ID of the guild the message was sent in



exports.run = async (client, message, args, config, guild) => {

	if(args[0] != undefined) {
		var user = getUserFromMention(args[0]);
		var uid = user.id;

		var sql = 'CALL bal(?)';

		db.query(sql, [uid], function(err, result) {
		    if (err) throw err;
		    console.log(result);
		    embedbal(
		    	result[0][0].joined,
		    	result[0][0].copper,
		    	result[0][0].silver,
		    	result[0][0].gold,
		    	user
		    );
		});
	} else {
		var user = message.author;
		var uid = user.id;

		var sql = 'CALL bal(?)';

		// data
		db.query(sql, [uid], function(err, result) {
		    if (err) throw err;
		    console.log(result);
		    embedbal(
		    	result[0][0].joined,
		    	result[0][0].copper,
		    	result[0][0].silver,
		    	result[0][0].gold,
		    	user
		    );
		});
	}


	function embedbal(date,copper,silver,gold,uid) {
		let member = guild.member(uid);
		let nickname = member ? member.displayName : null;

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
		.setAuthor(`${nickname}`, `${uid.displayAvatarURL()}`, 'https://www.facebook.com/otakunityofficial')
		.setThumbnail(`${uid.displayAvatarURL()}`)
		.setColor("RANDOM")
		.addFields(
			{ name: 'Gold', value: `${gold}`},
			{ name: 'Silver', value: `${silver}`},
			{ name: 'Copper', value: `${copper}`},
		);
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