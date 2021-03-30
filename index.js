require('dotenv').config();

const {Client} = require('./drop-monitor.js');


const api = new Client(
    process.env.TW_CLIENT_ID, 
    process.env.TW_CLIENT_SECRET
);

api.findStreamsWithDropsEnabled(process.env.GAME_NAME)
    .then(processStreams);

function processStreams(streams)
{
    console.log(streams);
}