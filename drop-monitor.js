const { ApiClient } = require('twitch');
const { ClientCredentialsAuthProvider } = require('twitch-auth');

// 'Drops Enabled' tag
const DROPS_TAG_ID = 'c2542d6d-cd10-4532-919b-3d19f30a768b';

class DropMonitor 
{
    /** @var ApiClient */
    client = null;
    gameId = null;

    constructor(id, secret)
    {
        const authProvider = new ClientCredentialsAuthProvider(id, secret);
        this.client = new ApiClient({ authProvider });
    }

    async findStreamsWithDropsEnabled(gameName)
    {
        const gameId = await this._getGameId(gameName);

        const streams = await this.client.helix.streams.getStreams({
            game: gameId,
            limit: 100,
        });

        return this._filterStreamsWithDrops(streams);
    }

    _filterStreamsWithDrops = streams => {
        console.log(streams.data.length);
        return streams.data.filter(stream => {
            return stream.tagIds.indexOf(DROPS_TAG_ID) !== -1;
        });
    }

    async _getGameId(gameName)
    {
        if (this.gameId !== null) {
            return this.gameId;
        }

        const game = await this.client.helix.games.getGameByName(gameName);
        if (!game)
        {
            throw new Error("Game not found");
        }
        this.gameId = game.id;
        return this.gameId;
    }
}

exports.DropMonitor = DropMonitor;