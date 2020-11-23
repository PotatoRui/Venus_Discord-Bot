const Discord = require('discord.js')

exports.run = async(client, message, args, config) => {


        var h, m, s;
        setInterval(function() {
        var today = new Date();
            h = today.getHours();
        }, 1000);
        setInterval(function() {
        var today = new Date();
            m = today.getMinutes();
        }, 1000);

        setInterval(function() {
        var today = new Date();
            s = today.getSeconds();
        }, 1000);


        var nowtoday = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();

		nowtoday = mm + '/' + dd + '/' + yyyy;

        
	    let embed = new Discord.MessageEmbed()
	        .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL()}`)
	        .setDescription(`${message.author}, System Time is ${h}:${m}:${s}\n+8 GMT 24hr!\nFull: ${nowtoday}`)
	        .setColor("RANDOM")
	        .setTimestamp()
	        .setFooter('Otakunity: No weaboo wants to be alone!', 'http://drive.google.com/uc?export=view&id=1yLg-QWF-UCWVbrVwd8OIWobbNrVbePLY');
	    message.reply(embed);
    


}