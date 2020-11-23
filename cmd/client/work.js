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

    var user = message.author;
    var uid = user.id;

    var sql = 'CALL bal_cache_fast(?)';

    // data
    db.query(sql, [uid], function(err, result) {
        if (err) throw err;

        var c_value = rankstar(result[0][0].dailycount);
        // console.log(c_value);
        initdaily(c_value);
    });



    let member = guild.member(message.author.id);
    let nickname = member ? member.displayName : null;

    // start
    function initdaily(c_value) {

        var copper = c_value % 100;

        // silver
        var m = (c_value - copper) / 100;
        var silver = m % 100;

        // gold
        var gold = (m - silver) / 100;

        console.log(talkedRecently);

        if (talkedRecently.has(message.author.id) === true) {
            // message.channel.send(`Awe <@${uid}> (｡•́︿•̀｡) ! Wait for 10 secs before getting typing this again. -` + );

            const talkedRecentlyv = talkedRecently.get(message.author.id);
            if (talkedRecentlyv) {
                const remaining = humanizeDuration(talkedRecentlyv - Date.now());

                let embed = new Discord.MessageEmbed()
                    .setAuthor(`${nickname}`, `${message.author.displayAvatarURL()}`, 'https://www.facebook.com/otakunityofficial')
                    .setDescription(`Awe <@${uid}> (｡•́︿•̀｡), You have to wait **${remaining}** before you can work again.`)
                    .setColor("#e63912")    
                return message.channel.send(embed).catch(console.error);
            }
        } else {
            talkedRecently.set(message.author.id, Date.now() + 300000);
            // Adds the user to the set so that they can't talk for a minute
            insertwork(c_value, copper, silver, gold);
            setTimeout(() => {
                // Removes the user from the set after a minute
                talkedRecently.delete(message.author.id);
            }, 300000);
        }
    }


    function insertwork(c_value, copper, silver, gold) {
        // sql
        var sql;
        var currency;

        sql = "INSERT INTO money (userid,value) VALUES (?,?)";

        db.query(sql, [uid, c_value], function(err, result) {
            if (err) throw err;
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${nickname}`, `${message.author.displayAvatarURL()}`, 'https://www.facebook.com/otakunityofficial')
                .setDescription(`Cheers ${message.author}, You earned **${gold} Gold, ${silver} Silver, ${copper} Copper** for completing your work in saving the universe !`)
                .setColor("#f7b0ee")
            message.channel.send(embed)
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


    function rankstar(daily) {
        // ranking algo
        var star;
        if (daily >= 3 && daily <= 9) {
            star = Math.floor(Math.random() * (12 - 6 + 1) + 6); // 9-20 random number. whatever you'd like
        } else if (daily >= 10 && daily <= 24) {
            star = Math.floor(Math.random() * (20 - 9 + 1) + 9); // 9-20 random number. whatever you'd like
        } else if (daily >= 25 && daily <= 54) {
            star = Math.floor(Math.random() * (32 - 18 + 1) + 18); // 9-20 random number. whatever you'd like
        } else if (daily >= 55 && daily <= 89) {
            star = Math.floor(Math.random() * (50 - 26 + 1) + 26); // 9-20 random number. whatever you'd like
        } else if (daily > 90) {
            star = Math.floor(Math.random() * (100 - 46 + 1) + 46); // 9-20 random number. whatever you'd like
        } else {
            star = Math.floor(Math.random() * (9 - 1 + 1) + 1); // 9-20 random number. whatever you'd like
        }
        return star;
        // end ranking algo
    }
}