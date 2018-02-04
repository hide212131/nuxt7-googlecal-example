import Env from '~/env.js'

export const state = () => ({
  user: null,
  eventTitle: Env.event.DEFAULT_TITLE,
  inProgress: false,
  error: null
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user || null
  },
  SET_PROGRESS(state, inProgress) {
    state.inProgress = inProgress
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
  inProgress(state) {
    return state.inProgress
  },
  isError(state) {
    return !!state.error    
  }
}
