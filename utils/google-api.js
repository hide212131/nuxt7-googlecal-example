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

export const initClientFromLocalStorage = async (store) => {
    // under construction... How can I make it...
}

export const googleInitClientNew = async (googleUser, store) => {
    localStorage.set("login", googleUser)
    await googleInitClient(googleUser, store)
}

export const newBatch = () => {
    return gapi.client.newBatch();
}

export const isAvailable = () => {
    return (gapi.client != undefined && gapi.client.calendar != undefined);
}

export const insertRequest = (resource) => {
    return gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource
    })
}

export const deleteRequest = (eventId) => {
    return gapi.client.calendar.events.delete({
        calendarId: "primary",
        eventId
    })
}

export const execute = (batch) => {
    return new Promise((resolve, reject) => {
        batch.execute((responseMap, rawBatchResponse) => {
            resolve(responseMap)
        })
    })
}

export const list = (start, end) => {
    return gapi_await(gapi.client.calendar.events.list, {
        calendarId: "primary",
        timeMin: start.toDate().toISOString(),
        timeMax: end.toDate().toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime"
    })
}

const googleInitClient = async (googleUser, store) => {
    await gapi_await(gapi.client.init, {
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    })
    store.commit("SET_USER", googleUser)
}

const gapi_await = async (api, module) => {
    return new Promise((resolve, reject) => {
        api.call(this, module).then((res) => { resolve(res) }, (err) => { reject(err) })
    })
}
