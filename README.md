# EasyGoCal

[Nuxt7](https://github.com/nuxt-community/nuxt7) Sample GoogleCalendar Application

- iOS style look and feel web application.
- Use Google Signin authentication.
- Calendar data works with Google Calendar.
- Register and delete the fixed schedule by tapping.

## Build Setup

Before running, you need to go to [Google Cloud Platform](https://console.cloud.google.com/) >
"APIs & Services" > "Credentials" and create the Client ID and API Key. See the below.
https://developers.google.com/google-apps/calendar/quickstart/js

After, copy file "env.js.sample" to "env.js" and fix items.

```js
module.exports = {
    google: {
        CLIENT_ID: "....",
        API_KEY: "....",
    },
    event: {
        DEFAULT_TITLE: "MyEvent" // event title (registered as all-day-event).
    }
}
```

Install dependencies
``` bash
$ yarn install
```

Serve with hot reload at localhost:8080
``` bash
$ yarn run dev
```

Build for production and launch server
``` bash
$ yarn run build
$ yarn start
```

Generate static project
``` bash
$ yarn run generate
```