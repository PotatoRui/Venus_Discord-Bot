const config = require("./../../config.json");
const Discord = require("discord.js");
const mysql = require("mysql");
const humanizeDuration = require('humanize-duration');


// database connection
var db = mysql.createConnection({
    host: config.mysqlHost,
    user: config.mysqlUser,
    password: config.mysqlPass,
    database: config.mysqlDB,
    charset: "utf8mb4",

    dateStrings: true
});


const talkedRecently = new Map();

exports.run = async(client, message, args, config, guild) => {
    function doRandHT() {
        var rand = ['heads', 'tails'];
        return rand[Math.floor(Math.random() * rand.length)];
    }


    let member = guild.member(message.author.id);
    let nickname = member ? member.displayName : null;

    var user = message.author;
    var uid = user.id;

    console.log(coinflipmap);

    if (talkedRecently.has(message.author.id)) {
        var coinflipmap = talkedRecently.get(message.author.id);
        const remaining = humanizeDuration(coinflipmap - Date.now());

        let embed = new Discord.MessageEmbed()
            .setAuthor(`${nickname}`, `${message.author.displayAvatarURL()}`, 'https://www.facebook.com/otakunityofficial')
            .setDescription(`Awe <@${uid}> (｡•́︿•̀｡), You have to wait **${remaining}** before you can use the coinflip again.`)
            .setColor("#e63912")
        return message.channel.send(embed).catch(console.error);

    } else {
        talkedRecently.set(message.author.id, Date.now() + 60000);
        message.reply(`you got ${Number(args[2])*2}`);
        setTimeout(() => {
            // Removes the user from the set after a minute

            if (coinflipmap.get(message.author.id)) {
                talkedRecently.delete(message.author.id);

            } else {
                message.reply(`better luck next time.`);
            }
        }, 60000);
    }




}