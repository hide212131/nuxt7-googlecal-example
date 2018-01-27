import Env from '~/env.js'

export const state = () => ({
  user: null,
  eventTitle: Env.event.DEFAULT_TITLE,
  error: null
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user || null
  },
  ERROR(state, error) {
    state.error = { errorMessage: error[0], error: error[1] }
    console.log("ERROR", state.error)
    console.trace()
  }
}

export const getters = {
  isAuthenticated(state) {
    return !!state.user
  },
  loggedUser(state) {
    return state.user
  },
  isError(state) {
    return !!state.error    
  }
}
