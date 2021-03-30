require('dotenv').config();

const {Client} = require('./twitch.js');

// 'Drops Enabled' tag
const DROPS_TAG_ID = 'c2542d6d-cd10-4532-919b-3d19f30a768b'

const api = new Client(
    process.env.TW_CLIENT_ID, 
    process.env.TW_CLIENT_SECRET, 
    DROPS_TAG_ID
);

api.findStreams(process.env.GAME_NAME)
    .then(processStreams);


function processStreams(streams)
{
    streams => console.log(streams)
}