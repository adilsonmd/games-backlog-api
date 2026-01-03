import { setClientAuthentication, ClientAssertionProviderInterface } from 'nxapi';

const axios = require('axios');

// setClientAuthentication accepts an object with a client id and optional secret, or
// a function that returns a client assertion
// `scope` is always required, even though it will usually always be `ca:gf ca:er ca:dr`

// Public client
setClientAuthentication({ id: '3w8284LJBq9BnnzZpO-_hg', scope: 'ca:gf ca:er ca:dr' });

// Confidential client, using client secret
setClientAuthentication({ id: '3w8284LJBq9BnnzZpO-_hg', secret: process.env.NXAPI_AUTH_CLIENT_SECRET, scope: 'ca:gf ca:er ca:dr' });

// Confidential client, using client assertion
setClientAuthentication(new ExampleClientAssertionProvider());

class ExampleClientAssertionProvider{
    scope = 'ca:gf ca:er ca:dr';

    async create(aud, exp = 60) {
        return { assertion: '3w8284LJBq9BnnzZpO-_hg', type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer' };
    }
}