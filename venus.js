var config = require("./config.json"),
    Discord = require("discord.js"),
    mysql = require("mysql"),
    client = new Discord.Client(),
    db = mysql.createConnection({
        host: config.mysqlHost,
        user: config.mysqlUser,
        password: config.mysqlPass,
        database: config.mysqlDB,
        charset: "utf8mb4"
    }),
    prefix = config.prefix,
    channel = client.channels.cache.get(config.serverid),
    server = config.serverid,
    admincmd = ["reward", "setupshop", "reload", "setting", "help", "deduct", "showdate"],
    express = require('express'),
    app = express(),
    humanizeDuration = require('humanize-duration');



// RESET START

var reset = resettimer();

// if 7 then reset
function resettimer() {
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


    setInterval(function() {
        // console.log(h + "" + m + "" + s);
        if (h == 7 && m == 0 && s == 0) {
            console.log("preparing to reset");
            resetdaily();
        }
    }, 1000);
}

function resetdaily() {
    console.log("resetting");
    // sql
    var sql;

    sql = "TRUNCATE daily_c";

    db.query(sql, function(err, result) {
        if (err) throw err;
    });


    sql = "TRUNCATE quest_chat";

    db.query(sql, function(err, result) {
        if (err) throw err;
    });


    sql = "TRUNCATE quest_chat_logs";

    db.query(sql, function(err, result) {
        if (err) throw err;
    });


    sql = "TRUNCATE quest_voice";

    db.query(sql, function(err, result) {
        if (err) throw err;
    });

    sql = "TRUNCATE voicechannel";

    db.query(sql, function(err, result) {
        if (err) throw err;
    });
}
// RESET END

// START CONN
client.on('ready', () => {
    console.log('Shack: Venus Bot is ready.');
    db.connect(function(err) {
        if (err) throw err;
        console.log(`DB name: (${config.mysqlDB}) Connected!`);
    });

    client.user.setStatus("online");
    client.user.setActivity(" the Universe! [sv.]", {
        type: 3
    });

    return (console.error);
});
// END CONN

// START VOICE
var usersinvoicechannels = new Map();

client.on('voiceStateUpdate', async(oldState, newState) => {
    if (!oldState || !newState) return;
    const oldChannel = oldState.channel ? oldState.channel.id : null;
    const newChannel = newState.channel ? newState.channel.id : null;

    var username, userid;

    client.users.fetch(newState.id).then(user => {
        if (oldChannel === null && newChannel !== null) {
            // USER JOINS
            var sql = "SELECT * FROM users WHERE userid = ?";
            db.query(sql, [user.id], function(err, result) {
                if (err) throw err;
                if (result.length === 0) {
                    // if not registered
                    var sql = "INSERT INTO users (userid) VALUES (?)";
                    db.query(sql, [user.id], function(err, result) {
                        if (err) throw err;
                        client.guilds.cache.get("591859735976869888").channels.cache.get("593101941656256524").send(`<@${user.id}>, Successfully Registered`);
                    });

                    usersinvoicechannels.set(user.id, Date.now());
                    client.guilds.cache.get("713005672244969562").channels.cache.get("753533096346910741").send(`${user.username} joins at the server vc`);
                } else {
                    usersinvoicechannels.set(user.id, Date.now());
                    client.guilds.cache.get("713005672244969562").channels.cache.get("753533096346910741").send(`${user.username} joins at the server vc`);
                }
            });

            console.log(`${user.username} JOINS`);
        } else if (newChannel === null && usersinvoicechannels.has(user.id) === true) {
            console.log(`${user.username} LEAVES`);
            // USER LEAVES
            var sql = "SELECT * FROM users WHERE userid = ?";
            db.query(sql, [user.id], function(err, result) {
                if (err) throw err;
                if (result.length === 0) {
                    // if not registered
                    var sql = "INSERT INTO users (userid) VALUES (?)";
                    db.query(sql, [user.id], function(err, result) {
                        if (err) throw err;
                        client.guilds.cache.get("591859735976869888").channels.cache.get("593101941656256524").send(`<@${user.id}>, Successfully Registered`);
                    });

                    var invoicechannelsminutesstayed = usersinvoicechannels.get(user.id);
                    var timespend = Date.now() - invoicechannelsminutesstayed;
                    insertvoicequest(user.id, timespend);
                    
                    client.guilds.cache.get("713005672244969562").channels.cache.get("753533096346910741").send(`${user.username} spent ${timespend} at the server vc`);
                } else {
                    var invoicechannelsminutesstayed = usersinvoicechannels.get(user.id);
                    var timespend = Date.now() - invoicechannelsminutesstayed;
                    insertvoicequest(user.id, timespend);
                    client.guilds.cache.get("713005672244969562").channels.cache.get("753533096346910741").send(`${user.username} spent ${timespend} at the server vc`);
                }
            });
        } 
        // else {
        //     client.guilds.cache.get("713005672244969562").channels.cache.get("753533096346910741").send(`${user.username} Moved VC`);
        // }

    });


    function insertvoicequest(uid, time) {
        console.log(time);
        var sql = "INSERT INTO voicechannel (userid,value) VALUES (?,?)";
        db.query(sql, [uid, time], function(err, result) {
            if (err) throw err;
        });
    }
});
// END VOICE

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

// start
client.on('message', message => {
    // to prevent multiple instance of msgs
    if (message.author.bot) return;
    // to prevent dm cmd exec
    if (message.channel.type == "dm") {
        message.reply(`<@${message.author.id}>, awts landi ssob bawal dm. ekis yan lods.`);
        return;
    };
    var prefixt = "sve!";
    var prefixp = "sv!";
    if (message.content.startsWith(prefixt)) {
        const args = message.content.slice(prefixt.length).trim().split(/ +/g),
        cmd = args.shift().toLowerCase();
        var command;

        var format = /[#\[\]]/;

        if(format.test(cmd) === true) {
            command = cmd.replace(/[^0-9]/g, "");
        } else {
            command = cmd;
        }


        // console.log(channelid);
        if (client.guilds.cache.get(message.guild.id).channels.cache.get(command) != null) {
            // var msg = [];
            // msg.push(args.length, args);
            var msgs = args.join(" ");
            var msgsarr = args.join(" ");

            if(msgs.length == 0) {
                message.reply("Message cannot be blank!");
                return;
            } else {
                var array = [], c = 0;

                msgsarr.split(/[\[\]']+/g).filter(Boolean).forEach(e =>
                // Increase / decrease counter and push desired values to an array
                e == '(' ? c++ : e == ')' ? c-- : c > 0 ? array.push('(' + e + ')') : array.push(e)
                );
                msgs = msgs.replace(`[${array[array.length - 1]}]`,"");
        
                const announceEmbed = new Discord.MessageEmbed()
        
                    .setColor("#3471eb")
                    // .setTimestamp()
                    .setDescription(`${msgs}`)
                    // .setFooter(null, `${message.author.avatarURL()}`);
        
                console.log(msgs.length);
        
                if(validURL(array[array.length - 1]) == true) {
                    announceEmbed.setImage(array[array.length - 1]);
                } 

                client.guilds.cache.get(message.guild.id).channels.cache.get(command).send(announceEmbed);
                
                return;
            }

            
        } else {
            client.guilds.cache.get("713005672244969562").channels.cache.get("753582993536319568").send(`******** START ******** \n LOGS FROM ${message.author.tag} to CHANNEL ID ${command} (NOT FOUND) \n ${args.join(" ")} \n ******** END ********`);
            message.reply("channel not exists!");
            return;
            // console.log(command);
        }
    } else if(message.content.startsWith(prefixp)) {
        const args = message.content.slice(prefixp.length).trim().split(/ +/g),
        cmd = args.shift().toLowerCase();
        var command;

        var format = /[#\[\]]/;

        if(format.test(cmd) === true) {
            command = cmd.replace(/[^0-9]/g, "");
        } else {
            command = cmd;
        }


        // console.log(channelid);
        if (client.guilds.cache.get(message.guild.id).channels.cache.get(command) != null) {
            // var msg = [];
            // msg.push(args.length, args);
            var msgs = args.join(" ");
            var msgsarr = args.join(" ");

            if(msgs.length == 0) {
                message.reply("Message cannot be blank!");
                // client.guilds.cache.get("713005672244969562").channels.cache.get("753582993536319568").send(`******** START ******** \n LOGS FROM ${message.author.tag} to CHANNEL ID ${command} (NOT FOUND) \n ${args.join(" ")} \n ******** END ********`);
                return;
            } else {
                
                var array = [], c = 0;

                msgsarr.split(/[\[\]']+/g).filter(Boolean).forEach(e =>
                // Increase / decrease counter and push desired values to an array
                e == '(' ? c++ : e == ')' ? c-- : c > 0 ? array.push('(' + e + ')') : array.push(e)
                );
                msgs = msgs.replace(`[${array[array.length - 1]}]`,"");

                if(validURL(array[array.length - 1]) == true) {
                    client.guilds.cache.get(message.guild.id).channels.cache.get(command).send(`${msgs}`, {
                        files: [array[array.length - 1]]// Or replace with FileOptions object
                    });
                }  else {
                    client.guilds.cache.get(message.guild.id).channels.cache.get(command).send(`${msgs}`);
                    // client.guilds.cache.get(message.guild.id).channels.cache.get(command).send(`${msgs}`, {
                    //     files: ["https://cdn.discordapp.com/attachments/674511883054612492/758724563990216734/images_33.jpeg"] // Or replace with FileOptions object
                    // });
                }
                console.log(array);
                // client.guilds.cache.get("713005672244969562").channels.cache.get("753582993536319568").send(`******** START ******** \n LOGS FROM ${message.author.tag} to CHANNEL ID ${command} \n ${args.join(" ")} \n ******** END ********`);
                return;
            }

            
        } else {
            // client.guilds.cache.get("713005672244969562").channels.cache.get("753582993536319568").send(`******** START ******** \n LOGS FROM ${message.author.tag} to CHANNEL ID ${command} (NOT FOUND) \n ${args.join(" ")} \n ******** END ********`);
            message.reply("channel not exists!");
            return;
        }
    }

    var guild = client.guilds.cache.get(server),
        args = message.content.slice(prefix.length).trim().split(/ +/g),
        command = args.shift().toLowerCase();

    if (args[0] != undefined && args[0].startsWith('<@') && args[0].endsWith('>')) {
        var uid = getUserFromMention(args[0]).id;
    } else {
        var uid = message.author.id;
    }

    // shortcuts
    switch (command) {
        case "acc":
            command = "account";
            break;
        case "vq":
            command = "voicequest";
            break;
        case "cq":
            command = "chatquest";
            break;
        case "cf":
            command = "coinflip";
            break;
        case "p":
            command = "ping";
            break;
        case "d":
            command = "deduct";
            break;
        case "r":
            command = "reward";
            break;
        case "s":
            command = "setting";
            break;
        case "rel":
            command = "reload";
            break;
        case "date":
            command = "showdate";
            break;
    }


    console.log(command);

    var blockchannelmsgs = ["593101941656256524","738071388451242105","750165949017227347","603242565407473703","620061708874153988","700365387715313684"];

    if(blockchannelmsgs.includes(message.channel.id) != true) {
        var sql = "INSERT INTO quest_chat_logs (userid) VALUES (?)";
        db.query(sql, [uid], function(err, result) {
            if (err) throw err;
        });
    }

    if (message.content.startsWith(prefix) && command != "") {
        // check if someone tags a user

        // check if it is on maintenance or not
        var sql = 'SELECT * FROM settings LIMIT 1';
        db.query(sql, function(err, result) {

            // check if admin wants to change the maintenance mode
            if (command == "setting" && args[0] != undefined && args[1] != undefined) {
                checkadmin(function(msg) {
                    if (msg === true) {
                        let f = require(`./cmd/admin/${command}.js`);
                        f.run(client, message, args, config);
                    } else {
                        message.channel.send("No Admin Rights 1");
                    }
                });
            } else if (command == "shutdown") {
                // client.guilds.cache.get("722056093764681789").channels.cache.get("722056095421693963").send("shutting down! じゃあまたね❣")
                //     .then(msg => {
                //         // process.exit(1)
                //     });

                checkadmin(function(msg) {
                    if (msg === true) {
                        message.channel.send("Awts gege, bye!")
                            .then(msg => {
                                process.exit(1)
                            });
                    } else {
                        message.channel.send("No Admin Rights 2");
                    }
                });
            }

            // if not admin commands and not a trappings
            else {
                // normal user
                if (result[0].maintenance == 1) {
                    // .setDescription(`${message.author}, \nSorry but Venus is on maintenance!`)
                    let embed = new Discord.MessageEmbed()
                        .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL()}`)
                        .setDescription(`${message.author}, Maintenance is real!`)
                        .setColor("RANDOM")
                        .setFooter('The Shack PH ™ | Server Credit Card Balance', "https://cdn.discordapp.com/attachments/739149373308534784/746488384612073593/1596097943017_copy_387x387.png");
                    message.reply(embed);
                } else {

                    checkregister(function(msg) {
                        if (msg === true) {
                            // if registered
                            var sql = 'SELECT * FROM users WHERE userid = ?';
                            db.query(sql, [uid], function(err, result) {
                                if (err) throw err;
                                if (result.length != 0) {
                                    docmd();
                                }
                            });
                        } else {
                            // if not registered
                            var sql = "INSERT INTO users (userid) VALUES (?)";
                            db.query(sql, [uid], function(err, result) {
                                if (err) throw err;
                                client.guilds.cache.get("591859735976869888").channels.cache.get("593101941656256524").send(`<@${user.id}>, Successfully Registered`);
                                docmd();
                            });
                        }
                    });
                }
            }
        });



        function checkadmin(callback) {
            console.log(uid);
            var sql = "SELECT * FROM admin WHERE userid=?";
            db.query(sql, [message.author.id], function(err, result) {
                if (err) throw err;
                // console.log(result.length);
                if (result.length === 0) {
                    return callback(false);
                } else {
                    return callback(true);
                }
            });
        }

        function checkregister(callback) {
            var sql = "SELECT * FROM users WHERE userid = ?";
            db.query(sql, [uid], function(err, result) {
                if (err) throw err;
                // console.log(result.length);
                if (result.length === 0) {
                    return callback(false);
                } else {
                    return callback(true);
                }
            });

        }




        function docmd() {
            checkadmin(function(msg) {
                console.log(msg + "docmd");
                if (msg === true) {
                    // if admin
                    if (admincmd.includes(command) === true) {
                        try {
                            let f = require(`./cmd/admin/${command}.js`);
                            f.run(client, message, args, config, guild);
                        } catch (err) {
                            if (err.code === 'MODULE_NOT_FOUND') {
                                embedmsg("Admin");
                            }
                        }
                    } else {
                        try {
                            let f = require(`./cmd/client/${command}.js`);
                            f.run(client, message, args, config, guild);
                        } catch (err) {
                            if (err.code === 'MODULE_NOT_FOUND') {
                                embedmsg("User");
                            }
                        }
                    }
                } else {
                    if (admincmd.includes(command) === true) {
                        message.channel.send("No Admin Rights 3.")
                    } else {
                        try {
                            // console.log(command);
                            let f = require(`./cmd/client/${command}.js`);
                            f.run(client, message, args, config, guild);
                        } catch (err) {
                            if (err.code === 'MODULE_NOT_FOUND') {
                                embedmsg("User");
                            }
                        }
                    }
                }
            });

            function embedmsg(usertype) {
                let embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL()}`)
                    .setDescription(`${message.author}, ${usertype} Command not found!`)
                    .setColor("RANDOM")
                message.reply(embed);
            }
        }


    }

    function validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    }
})

client.login(config.token);