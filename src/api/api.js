import request from '@/utils/request'

export const post = (url, data) => {
  return request({
    url: url,
    method: 'post',
    data
  })
}

export const get = (url, params) => {
  return request({
    url: url,
    method: 'get',
    params
  })
}

export const put = (url, data) => {
  return request({
    url: url,
    method: 'put',
    data
  })
}

export const del = (url, data) => {
  return request({
    url: url,
    method: 'delete',
    data
  })
}

