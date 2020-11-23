const Discord = require('discord.js');
const config = require("./../../config.json");
var express = require('express'),
    app = express();

exports.run = async(client, message, args, config) => {
    resetBot(message.channel);



    // Turn bot off (destroy), then turn it back on
    function resetBot(channel) {
        // send channel a message that you're resetting bot [optional]
        channel.send('Restarting...')
            .then(msg => client.destroy())
            .then(() => client.login(config.token))
            .then(() => process.exit(1));
    }

}