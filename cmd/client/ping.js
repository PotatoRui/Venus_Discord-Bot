const Discord = require('discord.js')

exports.run = async (client, message, args, config) => {
	var ping =  Math.round(client.ws.ping);

	let embed = new Discord.MessageEmbed()
	.setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL()}`) 
	.setDescription(`${message.author}, Venus ping is ${ping} ms! Japan Server!`)
	.setColor("RANDOM")
	.setTimestamp()
	.setFooter('Otakunity: No weaboo wants to be alone!', 'http://drive.google.com/uc?export=view&id=1yLg-QWF-UCWVbrVwd8OIWobbNrVbePLY');
	message.reply(embed);

}