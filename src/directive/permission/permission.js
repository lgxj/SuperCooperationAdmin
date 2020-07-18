import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const permissions = store.getters && store.getters.permissions

    if (value) {
      if (value instanceof Array) {
        const permissionRoles = value

        const hasPermission = permissions.some(permission => {
          return permissionRoles.includes(permission)
        })

        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      } else {
        console.log(value, permissions.includes(value))
        if (!permissions.includes(value)) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      }
    } else {
      throw new Error(`need permission! Like v-permission="['add','edit']" or v-permission="'add'"`)
    }
  }
}
