// import { getUserFromCookie, getUserFromLocalStorage } from '~/utils/auth'

export default function ({ store, req ,route, app, redirect}) {
   // If nuxt generate, pass this middleware
  // if (isServer && !req) return
  // const loggedUser = isServer ? getUserFromCookie(req) : getUserFromLocalStorage()
  // store.commit('SET_USER', loggedUser)
  console.log("check-auth.js:route, auth ", route, store.getters.isAuthenticated)
  if (route.path != '/login/' && !store.getters.isAuthenticated) {
    console.log('redirect(/login)')
    return redirect('/login/')
//    return redirect('/googlesignin')
  }
}
