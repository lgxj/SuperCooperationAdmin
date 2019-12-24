import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import settings from '@/settings'
import { makeParamSource, sign } from '@/utils'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    config.headers[ 'SC-API-APP'] = settings.appId

    let data = config.data || {}
    data = Object.assign(data, config.params)
    const signSource = makeParamSource(data)
    config.headers[ 'SC-API-SIGNATURE'] = sign(signSource)

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['SC-ACCESS-TOKEN'] = store.getters.token
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (!res.success) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 3 * 1000
      })

      // 登录状态错误
      if (res.code >= 1000 && res.code <= 1100) {
        store.dispatch('admin/resetToken').then(() => {
          location.reload()
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err: ' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
