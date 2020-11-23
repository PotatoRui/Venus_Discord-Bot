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



exports.run = async(client, message, args, config, guild) => {

		var uid = message.author;
    let member = guild.member(uid.id);
    let nickname = member ? member.displayName : null;



    var month_name = function(dt) {
        mlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return mlist[dt.getMonth()];
    };


    let embed = new Discord.MessageEmbed()
		.setTitle(`ELA's HIDDEN PORTAL... SHHH...`)
        .setAuthor(`${nickname}`, `${uid.displayAvatarURL()}`, 'https://www.facebook.com/otakunityofficial')
        .setThumbnail(`${uid.displayAvatarURL()}`)
        .setColor("#ffdf00")
        .setDescription(`
        	**⋅⋆ ✧ ADMIN COMMANDS ✧ ⋆⋅** \n\`sv.account\` or \`sv.acc <@mentionuser>\`\nTo check Account balance\n\n\`sv.reward <@mentionuser> <value><type> \`\n\`sv.remove <@mentionuser> <value><type>\`\nAdd or Remove money to someone's account\n **<type>**\n**g**-gold, **s**-silver, **c**-copper\n\n\`sv.setting <mode> <switch>\`\nTo change some bot settings\n**Modes:**\n\`m\`-Maintence\n\n\`<switch>\` - 0 (off) | 1 (on)\n\n**Client Commands**\n\n\`sv.work\`-To gain coins from working.\n\n\`sv.ping\`- To check bot accessibility and latency.\n⋅⋆ ✧  ✧ ⋆⋅
        	`)
        .setFooter('The Shack PH ™ | Server Credit Card Balance', "https://cdn.discordapp.com/attachments/739149373308534784/746488384612073593/1596097943017_copy_387x387.png")
    message.channel.send(embed);


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