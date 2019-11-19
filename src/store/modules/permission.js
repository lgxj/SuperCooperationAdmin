import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param permissions
 * @param route
 */
function hasPermission(roles, permissions, route) {
  if (route.meta) {
    if (route.meta.roles && route.meta.permissions) {
      return roles.some(role => route.meta.roles.includes(role)) && permissions.some(permission => route.meta.permissions.includes(permission))
    } else if (route.meta.roles) {
      return roles.some(role => route.meta.roles.includes(role))
    } else if (route.meta.permissions) {
      return permissions.some(permission => route.meta.permissions.includes(permission))
    } else {
      return true
    }
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 * @param permissions
 */
export function filterAsyncRoutes(routes, roles, permissions) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles, permissions)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, { roles, permissions }) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('dev')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles, permissions)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
