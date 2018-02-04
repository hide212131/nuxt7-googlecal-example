import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Env from '~/env.js'


Vue.use(VueI18n)

export default ({ app, store }) => {
    app.i18n = new VueI18n({
        locale: Env.lang || window.navigator.language,
        fallbackLocale: 'en',
        messages: {
            'en': require('~/locales/en.json'),
            'ja': require('~/locales/ja.json')
        }
    })
}