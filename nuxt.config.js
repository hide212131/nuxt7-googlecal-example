const webpack = require('webpack')

module.exports = {
  // Nuxt modules
  modules: [
    'nuxt7'
  ],

  // PWA manifest
  // https://github.com/nuxt-community/pwa-module
  manifest: {
    name: 'EasyGoCal',
    description: 'Nuxt7 Sample App'
  },

  // Framework7 Config
  framework7: {
    // ...
    theme: 'ios',
  },

  // Build configuration
  build: {
    // Extract CSS in a separated file
    extractCSS: true,

    // You can extend webpack config here
    extend(config) {
      // ...
      // resolve: {
      //   alias: {
      //     vue$: 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
      //   }
      // }
    }
  },

  // Additional CSS configuration
  css: [
    'assets/app.css'
  ],

  mode: 'spa',

  "scripts": {
    "dev": "HOST=0.0.0.0 PORT=8080 nuxt"
  },

  head: {
    script: [
      { src: 'https://apis.google.com/js/api:client.js', async: true, defer: true}
    ]
  },

  build: {
    vendor: ['vue-google-signin-button', 'store', 'vue-i18n'],
    extend (config, ctx) {
      config.plugins.push(
        new webpack.EnvironmentPlugin(['GOOGLE_API_KEY', 'GOOGLE_CLIENT_ID', 'EVENT_DEFAULT_TITLE'])
      )
    }

  },
  plugins: ['~/plugins/googlesignin.js', '~/plugins/store.js', '~/plugins/i18n.js']
}
