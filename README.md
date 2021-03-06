# EasyGoCal

[Nuxt7](https://github.com/nuxt-community/nuxt7) Sample GoogleCalendar Application

![demo](https://github.com/hide212131/nuxt7-googlecal-example/wiki/images/readme.gif)

- iOS style look and feel web application.
- Use Google Signin authentication.
- Calendar data works with Google Calendar.
- Register and delete the fixed schedule by tapping.

## Build Setup

Before running, you need to go to [Google Cloud Platform](https://console.cloud.google.com/) >
"APIs & Services" > "Credentials" and create the Client ID and API Key. See the below.
https://developers.google.com/google-apps/calendar/quickstart/js

After, set environment variables.

```bash
export GOOGLE_API_KEY=
export GOOGLE_CLIENT_ID=
export EVENT_DEFAULT_TITLE=  // event title (registered as all-day-event).
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
