require('dotenv').config();

const {DropMonitor} = require('./drop-monitor.js');

const gameName = 'Rocket League';


const api = new DropMonitor(
    process.env.TW_CLIENT_ID, 
    process.env.TW_CLIENT_SECRET
);

api._getGameId(gameName)
    .then(id => console.log(`Game ID for ${gameName} is ${id}`))
    .catch(e => console.error(e));

api.findStreamsWithDropsEnabled(gameName)
    .then(processStreams);

function processStreams(streams)
{
    console.log(streams.length);
}