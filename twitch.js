const axios = require("axios");

class Client 
{
    id = null;
    secret = null;
    tag_id = null;
    auth = null;

    constructor(id, secret, tag_id)
    {
        this.id = id;
        this.secret = secret;
        this.tag_id = tag_id;
    }

    _authByClientCreds(id, secret)
    {
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
        if (this.auth === null)
        {
            return this._authByClientCreds(this.id, this.secret)
            .then(this._updateAuth.bind(this));
        }
        console.debug("Return old token");
        return new Promise(_ => this.auth);
    }

    _updateAuth(response)
    {
        console.debug("Authentication: success");
        this.auth = new Token(response.data);
        console.log(this.auth);
        setTimeout(() => {
            console.debug("Token expired");
            this.auth = null;
        }, 3600 * 24 * 1000);
        return this.auth;
    }

    findStreams(gameName)
    {
        return this._getToken()
        .then(token => {

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
            .then(this._processStreamsData.bind(this))
            .catch(e => console.error(e));
        });
    }

    _processStreamsData(response)
    {
        const streams = response.data.data;
        return streams.filter(stream => {
            return stream.tag_ids.indexOf(this.tag_id) !== -1;
        });
    }
}

class Token {

    access_token = null;
    expires_in = null;
    token_type = null;

    constructor(data)
    {
        this.access_token = data.access_token;
        this.expires_in = data.expires_in;
        this.token_type = data.token_type;
    }
}

exports.Client = Client;