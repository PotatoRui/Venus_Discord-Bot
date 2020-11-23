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
    let embed = new Discord.MessageEmbed()
        .setColor("#ffdf00")
        .setFooter('The Shack PH ™ | Server Leaderboard', "https://cdn.discordapp.com/attachments/739149373308534784/746488384612073593/1596097943017_copy_387x387.png");
    var sql = 'CALL lb()';
    var leaderboard_db = new Array();
    var leaderboard = new Array();
    var i, ei;
    var prev=0;
    var next=10;

    // data
    db.query(sql, function(err, result) {
        if (err) throw err;
        if (result.length === 0) {
            embed.setDescription(`**:bank: Credit Ranking**\n*Leaderboard via Cash*\n\nNo Records Found!\n\n`);
        } else {
            for (i = 0; i <= result[0].length - 1; i++) {
                leaderboard_db.push(`${i+1} . <@${result[0][i].userid}>\n`)
            };


            var divide = result[0].length / 10;
            var rounded = (divide + "").split(".");

            const generateEmbed = start => {
                const current = leaderboard_db.slice(start, start + 10)
              
                // you can of course customise this embed however you want
                const embed = new Discord.MessageEmbed()
                  .setTitle(`Showing Leaderboards ${start + 1}-${start + current.length} out of ${leaderboard_db.length}`)
                .setDescription(`**:bank: Credit Ranking**\n*Leaderboard via Cash*\n\n${current.join('')}\n\n`)
                return embed
            }


            // leaderboard_db.slice(0, 10).map((item, i) => {
            //     leaderboard.push(item);
            // });

            // embed.setDescription(`**:bank: Top Players**\n*Leaderboard via Cash*\n\n${leaderboard.join('')}\n\n`)

            // edit: you can store the message author like this:
            const author = message.author

            // send the embed with the first 10 guilds
            message.channel.send(generateEmbed(0)).then(message => {
                // exit if there is only one page of guilds (no need for all of this)
                if (leaderboard_db.length <= 10) return
                // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
                message.react('➡️')
                const collector = message.createReactionCollector(
                    // only collect left and right arrow reactions from the message author
                    (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === author.id,
                    // time out after a minute
                    {time: 60000}
                )

                let currentIndex = 0
                collector.on('collect', reaction => {
                    // remove the existing reactions
                    message.reactions.removeAll().then(async () => {
                    // increase/decrease index
                    reaction.emoji.name === '⬅️' ? currentIndex -= 10 : currentIndex += 10
                    // edit message with new embed
                    message.edit(generateEmbed(currentIndex))
                    // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
                    if (currentIndex !== 0) await message.react('⬅️')
                    // react with right arrow if it isn't the end
                    if (currentIndex + 10 < leaderboard_db.length) message.react('➡️')
                    })
                })
            })
        }

        


        // message.channel.send(embed);




        // embedbal(
        //     result[0][ei].joined,
        //     result[0][ei].real_money,
        //     result[0][ei].dailycount,
        //     result[0][ei].rownum,
        //     user
        // );
    });


    function embedbal(date, lenght, daily, leaderboard, uid) {
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
            star = "**NO RANK**";
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