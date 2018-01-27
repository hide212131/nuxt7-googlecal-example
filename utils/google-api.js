import Env from '~/env.js'
import localStorage from 'store'

const CLIENT_ID = Env.google.CLIENT_ID
const API_KEY = Env.google.API_KEY
// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
]
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/calendar"

/**
 * The Auth2 parameters, as seen on
 * https://developers.google.com/identity/sign-in/web/reference#gapiauth2initparams.
 * As the very least, a valid client_id must present.
 * @type {Object}
 */
export const googleSignInParams = {
    client_id: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
    apiKey: API_KEY
}

export const googleInitClientFromLocalStorage = async (store) => {
    // let googleUser = localStorage.get("login")
    // console.log("googleInitClientFromLocalStorage googleUser=", googleUser)
    // if (googleUser != null) {
    //     //await googleInitAuth()
    //     //console.log("gapi.auth2", gapi)
    //     // gapi.auth2.setToken({
    //     //     access_token: googleUser.getAuthResponse().id_token
    //     // })
    //     await googleInitClient(googleUser, store)
    //     //gapi.client.setToken(googleUser.getAuthResponse().id_token)
    // }
}

export const googleInitClientNew = async (googleUser, store) => {
    localStorage.set("login", googleUser)
    await googleInitClient(googleUser, store)
}

const googleInitAuth = async () => {
    console.log("googleInitAuth")
    console.log("googleInitAuth: gapi.load(auth2) start")
    await gapi_load('auth2')
    console.log("googleInitAuth: gapi.load(auth2) success")
    gapi.auth2.init(googleSignInParams)
}

const googleInitClient = async (googleUser, store) => {
    console.log("googleInitClient")

    console.log("googleInitClient: gapi.load(client) start")
    await gapi_load('client')
    console.log("googleInitClient: gapi.load(client) success")
    console.log("googleInitClient: gapi.init(client) start")
    await gapi_await(gapi.client.init, {
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    })
    console.log("googleInitClient: gapi.init(client) success")
    store.commit("SET_USER", googleUser)
}

const gapi_load = async (module) => {
    return new Promise((resolve, reject) => {
        gapi.load(module, {
            callback: function () {
                console.log("gapi_load: success")
                // Handle gapi.client initialization.
                resolve();
                //reject(new Error('TEST reject'));
            },
            onerror: function () {
                // Handle loading error.
                console.log("gapi_load: failure")
                reject(new Error('gapi.client failed to load!'));
            },
            timeout: 5000, // 5 seconds.
            ontimeout: function () {
                // Handle timeout.
                console.log("gapi_load: timeout")
                reject(new Error('gapi.client could not load in a timely manner!'));
            }
        })
    })
}

const gapi_await = async (api, module) => {
    return new Promise((resolve, reject) => {
        api.call(this, module).then(() => { resolve() }, (err) => { reject(err) })
    })
}
