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
    if (args[0] != undefined) {
        try {
            var user = getUserFromMention(args[0]);
            var uid = user.id;

            
            var sql = 'CALL bal_cache_fast(?)';

            // data
            db.query(sql, [uid], function(err, result) {
                if (err) throw err;
                embedbal(
                    result[0][0].joined,
                    result[0][0].real_money,
                    result[0][0].dailycount,
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
            embedbal(
                result[0][0].joined,
                result[0][0].real_money,
                result[0][0].dailycount,
                user
            );
        });
    }


    function embedbal(date, real_money, daily, uid) {
        // message.reply(uid.id);
        let member = guild.member(uid);
        let nickname = member ? member.displayName : null;
        console.log(daily);
        var star = rankstar(daily);

        money = real_money;


        var copper = money % 100;

        // silver
        var m = (money - copper) / 100;
        var silver = m % 100;

        // gold
        var gold = (m - silver) / 100;


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
            .setDescription(`**Account Number:**\n${uid.id}     \n`+
            				`────────  ⋅⋆ ─ ⋆⋅  ────────\n`+
            				`• **Rank**: ${star}\n`+
            				`────────  ⋅⋆ ─ ⋆⋅  ────────\n`+
            				`**☆ Gold:** ${gold} <a:gold:750883258245578942>\n`+
            				`**☆ Silver:** ${silver} <a:silver:750883235776561243>\n`+
            				`**☆ Copper:** ${copper} <a:copper:750895306392207361>\n`+
            				`────────  ⋅⋆ ─ ⋆⋅  ────────`)
            .setFooter('The Shack PH ™ | Server Credit Card Balance', "https://cdn.discordapp.com/attachments/739149373308534784/746488384612073593/1596097943017_copy_387x387.png")
        message.channel.send(embed);
    }

    function rankstar(daily) {
        // ranking algo
        var star;
        if (daily >= 3 && daily <= 9) {
            star = ":star:";
        } else if (daily >= 10 && daily <= 24) {
            star = ":star::star:";
        } else if (daily >= 25 && daily <= 54) {
            star = ":star::star::star:";
        } else if (daily >= 55 && daily <= 89) {
            star = ":star::star::star::star:";
        } else if (daily > 90) {
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