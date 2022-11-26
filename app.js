// Require necessary node modules
// Make the variables inside the .env element available to our Node project
require('dotenv').config();

const tmi = require('tmi.js');
const JSONdb = require('simple-json-db');
const randomChoice = require('random-choice')
const banTime = 60

const db = new JSONdb('boulotDB.json');
const stringArray = ["RATIO + CHEH !!!", "C'est moi jte fais un boulot oui !!", "Oh mais ça va pas la tête tu t'es cru où ? AU GABON ?!", "Tiens va boire de l'eau ça va te détendre !"]

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
    identity: {
        username: `${process.env.TWITCH_USERNAME}`,
        password: `oauth:${process.env.TWITCH_OAUTH}`
    },
    channels: [`${process.env.TWITCH_CHANNEL}`]
    });
    
    // Connect to the channel specified using the setings found in the configurations
    // Any error found shall be logged out in the console
    client.connect().catch(console.error);

    // We shall pass the parameters which shall be required
    client.on('message', (channel, tags, message, self) => {
    // Lack of this statement or it's inverse (!self) will make it in active
    if (self) return;
    
    if (message.toLowerCase().includes("boulot")) {
        if (db.has(tags.username)) 
        {
            var count = db.get(tags.username)
            ++count
            db.set(tags.username, count)

            if (randomChoice([true, false], [(0.1+ count/1000), 1])) {
                client.say(channel, `/timeout ${tags.username} ${banTime}`)
            var randomNumber = Math.floor(Math.random()*stringArray.length)
                client.say(channel, `@${tags.username} ` + stringArray[randomNumber])
            }
              
        } else {
            db.set(tags.username, 1)

            if (randomChoice([true, false], [(0.1+ 1/1000), 1])) {
                client.say(channel, `/timeout ${tags.username} ${banTime}`)
                var randomNumber = Math.floor(Math.random()*stringArray.length)
                client.say(channel, `@${tags.username} ` + stringArray[randomNumber])
            }
        }
    } else {
        switch (message.toLowerCase()) {
            case '!msgcount':
                if (db.has(tags.username)) {
                    var count = db.get(tags.username)
                    var percentage = (0.1 + count/1000) * 100 /((0.1 + count/1000) + 1)
                    client.say(channel, `@${tags.username} tu as ${count} messages contenent le b-word! Tu as donc ${percentage.toFixed(2)}% de chance de te faire ban !`)
                } else {
                    var percentage = (0.1+ 1/1000) * 100 / ((0.1+ 1/1000) + 1)
                    client.say(channel, `@${tags.username} tu as 0 messages contenent le b-word! Tu as donc ${percentage.toFixed(2)}% de chance de te faire ban !`)
                }
                break;
            default:
                break;
        }
    }

});