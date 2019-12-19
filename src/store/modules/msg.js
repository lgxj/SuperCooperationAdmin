const state = {
  num: 0,
  IMLogin: false
}

const mutations = {
  CHANGE_VALUE: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeValue({ commit }, data) {
    commit('CHANGE_VALUE', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

