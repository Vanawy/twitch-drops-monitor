const axios = require("axios");

// 'Drops Enabled' tag
const DROPS_TAG_ID = 'c2542d6d-cd10-4532-919b-3d19f30a768b';

class Client 
{
    id = null;
    secret = null;
    token = null;

    constructor(id, secret)
    {
        this.id = id;
        this.secret = secret;
    }

    async findStreamsWithDropsEnabled(gameName)
    {
        const token = await this._getToken();

        const endpoint = new URL('https://api.twitch.tv/helix/search/channels');
        endpoint.searchParams.set('query', gameName);
        endpoint.searchParams.set('first', 100);
        endpoint.searchParams.set('live_only', true);

        return axios({
            method: 'get',
            url: endpoint.toString(),
            headers: {
                'Authorization': `Bearer ${token.access_token}`,
                'Client-ID': this.id,
            }
        })
        .then(this._filterStreamsWithDrops);
    }

    _authByClientCreds = (id, secret) => {
        console.debug("Authentication...");
        const url = new URL('https://id.twitch.tv/oauth2/token');
        url.searchParams.set('client_id', this.id);
        url.searchParams.set('client_secret', this.secret);
        url.searchParams.set('grant_type', 'client_credentials');

        return axios.post(url.toString());
    }

    _getToken()
    {
        console.debug("Getting token...");
        if (this.token === null || this.token.isExpired())
        {
            return this._authByClientCreds(this.id, this.secret)
            .then(this._updateToken);
        }
        console.debug("Return old token");
        return new Promise(_ => this.token);
    }

    _updateToken = response => {
        console.debug("Authentication: success");
        this.token = new Token(response.data);
        return this.token;
    }

    _filterStreamsWithDrops = response => {
        const streams = response.data.data;
        return streams.filter(stream => {
            return stream.tag_ids.indexOf(DROPS_TAG_ID) !== -1;
        });
    }
}

class Token {

    access_token = null;
    expires_in = null;
    token_type = null;
    timestamp = null;

    constructor(data)
    {
        this.access_token = data.access_token;
        this.expires_in = data.expires_in;
        this.token_type = data.token_type;
        this.timestamp = Date.now();
    }

    isExpired()
    {
        const elapsed = Date.now() - this.timestamp;
        return (elapsed / 1000) > this.expires_in;
    }
}

exports.Client = Client;