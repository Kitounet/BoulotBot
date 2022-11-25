// Require necessary node modules
// Make the variables inside the .env element available to our Node project
require('dotenv').config();

const tmi = require('tmi.js');

// Setup connection configurations
// These include the channel, username and password
const client = new tmi.Client({
    options: { debug: true, messagesLogLevel: "info" },
    connection: {
        reconnect: true,
        secure: true
    },

// Lack of the identity tags makes the bot anonymous and able to fetch messages from the channel
// for reading, supervision, spying, or viewing purposes only
    channels: [`${process.env.TWITCH_CHANNEL}`]
});