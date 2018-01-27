// import { getUserFromCookie, getUserFromLocalStorage } from '~/utils/auth'
import { googleInitClientFromLocalStorage } from "~/utils/google-api";

export default function (context) {
  // const store = context.store
  // const route = context.route
  // const redirect = context.redirect
  // // If nuxt generate, pass this middleware
  // // if (isServer && !req) return
  // // const loggedUser = isServer ? getUserFromCookie(req) : getUserFromLocalStorage()
  // // store.commit('SET_USER', loggedUser)
  // console.log("check-auth.js start:", context)

  // if (route.path.endsWith('/error/')) {
  //   console.log("redirect(/error/)")
  // } else {
  //   try {
  //     let result = googleInitClientFromLocalStorage(store)
  //     console.log("check-auth.js auth:", result, store.getters.isAuthenticated)

  //     if (route.path.endsWith('/login/')) {
  //       if (store.getters.isAuthenticated) {
  //         console.log("redirect(/login/ to /) (authenticated)")
  //         return redirect('/')
  //       } else {
  //         console.log("redirect(/login/ to /login/) (not authenticated)")
  //       }
  //     } else { // '/' etc.
  //       if (!store.getters.isAuthenticated) {
  //         console.log("redirect(to /login/) (not authenticated)")
  //         return redirect('/login/')
  //       }
  //     }

  //   } catch (e) {
  //     console.log("check-auth: error", e,)
  //     console.trace()
  //     if (!route.path.endsWith('/error/')) {
  //       console.log("check-auth: error -> redirect?")
  //       //return redirect('/error/', e)
  //     }
  //   }
  // }
}
