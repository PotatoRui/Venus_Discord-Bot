const config = require("./../../config.json");
const Discord = require("discord.js");
const mysql = require("mysql");
var humanizeDuration = require('humanize-duration');



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
    if (args[0] != undefined) {
        try {
            var user = getUserFromMention(args[0]);
            var uid = user.id;

            var sql = 'CALL bal_cache_fast(?)';

            // data
            db.query(sql, [uid], function(err, result) {
                if (err) throw err;
                // console.log(result[0][2].userid);
                embedbal(
                    result[0][0].joined,
                    result[0][0].dailycount,
                    result[0][0].msgcount,
                    user
                );
            });
        } catch (err) {
            message.reply("Wrong input! `sv!bal <mention user> `")
                .then(msg => {
                    msg.delete({
                        timeout: 2000
                    })
                });
        }
    } else {
        var user = message.author;
        var uid = user.id;

        var sql = 'CALL bal_cache_fast(?)';

        // data
        db.query(sql, [uid], function(err, result) {
            if (err) throw err;
            // console.log(result[0][2].userid);
            embedbal(
                result[0][0].joined,
                result[0][0].dailycount,
                result[0][0].msgcount,
                user
            );
        });
    }


    function embedbal(date, daily, msgcount, uid) {
        let member = guild.member(uid);
        let nickname = member ? member.displayName : null;
        console.log(daily);
        var star = rankstar(daily);



        var month_name = function(dt) {
            mlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
            .setColor("#ffdf00")
            .setFooter('The Shack PH ™ | Daily Chat Quest', "https://cdn.discordapp.com/attachments/739149373308534784/746488384612073593/1596097943017_copy_387x387.png")
        
        var ohr,thr,rhr;
        if(Number(msgcount) >= 100 && Number(msgcount) <= 199) {
            ohr = "★ ~~100 Messages Sent\nReward: 50 Copper~~\n";
            thr = "☆ **200 Messages Sent**\nReward: **1 Silver and 50 Copper**\n";
            rhr = "☆ **300 Messages Sent**\nReward: **3 Silvers**\n";
            checkuserquestlogs(uid.id,"v1hr","50c");
        } else if(Number(msgcount) >= 200 && Number(msgcount) <= 299) {
            ohr = "★ ~~100 Messages Sent\nReward: 50 Copper~~\n";
            thr = "★ ~~200 Messages Sent\nReward: 1 Silver and 50 Copper~~\n";
            rhr = "☆ **300 Messages Sent**\nReward: **3 Silvers**\n";
            checkuserquestlogs(uid.id,"v1hr","50c");
            checkuserquestlogs(uid.id,"v2hr","150c");
        } else if(Number(msgcount) > 300) {
            ohr = "★ ~~100 Messages Sent\nReward: 50 Copper~~\n";
            thr = "★ ~~200 Messages Sent\nReward: 1 Silver and 50 Copper~~\n";
            rhr = "★ ~~300 Messages Sent\nReward: 3 Silvers~~\n";
            checkuserquestlogs(uid.id,"v1hr","50c");
            checkuserquestlogs(uid.id,"v2hr","150c");
            checkuserquestlogs(uid.id,"v3hr","300c");
        } else {
            ohr = "☆ **100 Messages Sent**\nReward: **50 Copper**\n";
            thr = "☆ **200 Messages Sent**\nReward: **1 Silver and 50 Copper**\n";
            rhr = "☆ **300 Messages Sent**\nReward: **3 Silvers**\n";
        }

        

        embed.setDescription(`────────  ⋅⋆ ─ ⋆⋅  ────────\n`+
                            `**:scroll: Daily Quest:**\n`+
                            `────────  ⋅⋆ ─ ⋆⋅  ────────\n`+
                            `${ohr}`+
                            `─────────────────────\n`+
                            `${thr}`+
                            `─────────────────────\n`+
                            `${rhr}`+
                            `─────────────────────\n`+
                            `• Total Messages: ${msgcount}\n`+
                            `────────  ⋅⋆ ─ ⋆⋅  ────────`)

        message.channel.send(embed);
    }

    function checkuserquestlogs(uid,type,amount) {
        var letters = /^[A-Za-z]+$/;
        var numericdata = amount.replace(/\D/g,'');
        var money = numericdata;


        var copper = money % 100;

        // silver
        var m = (money - copper) / 100;
        var silver = m % 100;

        // gold
        var gold = (m - silver) / 100;

        var sql = 'SELECT * FROM quest_chat WHERE userid = ? AND type = ?';
        db.query(sql, [uid,type], function(err, result) {
            if (err) throw err;

            if (result.length === 0) {
                var sql = 'INSERT INTO quest_chat (userid,type) VALUES (?,?)';

                db.query(sql, [uid,type], function(err, result) {
                    if (err) throw err;

                        sql = "INSERT INTO money (userid,value) VALUES (?,?)";

                        db.query(sql, [uid,numericdata], function(err, result) {
                            if (err) throw err;
                            message.channel.send(`Hey <@${uid}>, you have been rewarded ${gold} Gold, ${silver} Silver, ${copper} Copper for completing a quest!`);
                        });
                    
                })

            } 
        })
    }

    function rankstar(daily) {
        // ranking algo
        var star;
        if (daily >= 3 && daily <= 6) {
            star = ":star:";
        } else if (daily >= 7 && daily <= 14) {
            star = ":star::star:";
        } else if (daily >= 15 && daily <= 29) {
            star = ":star::star::star:";
        } else if (daily >= 30 && daily <= 59) {
            star = ":star::star::star::star:";
        } else if (daily > 60) {
            star = ":star::star::star::star::star:";
        } else {
            star = "*NO RANK*";
        }
        return star;
        // end ranking algo
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