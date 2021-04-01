# Twitch Drops Monitor
Find streams with 'Drops Enabled' tag by name of the game

# Installation
`npm i drop-monitor'

# Usage
Instantiate `DropMonitor` with Twitch API client ID and secret
```js
const dropMonitor = new DropMonitor(
    YOUR_TWITCH_CLIENT_ID, 
    YOUR_TWITCH_CLIENT_SECRET
);
```

Use `findStreamsWithDropsEnabled(gameName)` to get all streams with tag 'Drops Enabled' from top 100 streams
```js
const monitorPromise = dropMonitor.findStreamsWithDropsEnabled(gameName);
```
