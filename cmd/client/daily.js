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

    var user = message.author;
    var uid = user.id;

    

    let member = guild.member(message.author.id);
    let nickname = member ? member.displayName : null;

    var user = message.author;
    var uid = user.id;

    // start
    var c_value = Math.floor(Math.random() * (200 - 100 + 1) + 100);
    var copper = c_value % 100;

    // silver
    var m = (c_value - copper) / 100;
    var silver = m % 100;

    // gold
    var gold = (m - silver) / 100;


    var sql = 'SELECT * FROM daily_c WHERE userid = ?';
    db.query(sql, [uid], function(err, result) {
        if (err) throw err;

        if (result.length === 0) {
            insertdaily(c_value, copper, silver, gold);
        } else {

            let embed = new Discord.MessageEmbed()
                .setAuthor(`${nickname}`, `${message.author.displayAvatarURL()}`, 'https://www.facebook.com/otakunityofficial')
                .setDescription(`Awe <@${uid}> (｡•́︿•̀｡) ! You have already claimed today's Daily. Try again tomorrow !`)
                .setColor("#f7bef0")
            message.channel.send(embed);
        }

        // if (hours >= 7 && hours <= 24) {
        //     if (result.length === 0) {
        //         insertdaily();
        //     } else {
        //         message.reply("Aweeee :< . You have already claimed today's Daily.");
        //     }
        // } else {
        //     message.reply("Sorry, but `sv.daily` is only available between 7AM to 12AM (+8 GMT)!")
        // }
    })

    

    function insertdaily() {
        // sql
        var sql;
        var currency;

        sql = "INSERT INTO money (userid,value) VALUES (?,?)";

        db.query(sql, [uid, c_value], function(err, result) {
            if (err) throw err;
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${nickname}`, `${message.author.displayAvatarURL()}`, 'https://www.facebook.com/otakunityofficial')
                .setDescription(`${message.author}, you got ${gold} Gold, ${silver} Silver, ${copper} Copper in your daily charm! xD`)
                .setColor("#f7bef0")
            message.channel.send(embed);
        });

        sql = "INSERT INTO daily_c (userid) VALUES (?)";

        db.query(sql, [uid], function(err, result) {
            if (err) throw err;
        });


        sql = "INSERT INTO daily_c_logs (userid) VALUES (?)";

        db.query(sql, [uid], function(err, result) {
            if (err) throw err;
        });
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