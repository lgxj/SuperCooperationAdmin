/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 验证用户名
 * @param rule
 * @param value
 * @param callback
 */
export const validateUsername = (rule, value, callback) => {
  const reg = /^[a-zA-Z0-9_\-@\.]{4,16}$/
  if (value === '') {
    callback(new Error('请输入用户名'))
  } else if (!reg.test(value)) {
    callback(new Error('用户名格式不正确!'))
  } else {
    callback()
  }
}

/**
 * 验证姓名
 * @param rule
 * @param value
 * @param callback
 */
export const validateName = (rule, value, callback) => {
  const reg = /^[a-zA-Z\u4e00-\u9fa5]+$/
  if (value === '') {
    callback(new Error('请输入姓名'))
  } else if (!reg.test(value)) {
    callback(new Error('姓名格式不正确!'))
  } else {
    callback()
  }
}

/**
 * 验证身份证号
 * @param rule
 * @param value
 * @param callback
 */
export const validateIDCard = (rule, value, callback) => {
  const reg15 = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/
  const reg18 =
    /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
  if (value === '') {
    callback(new Error('请输入身份证号'))
  } else if (!reg15.test(value) && !reg18.test(value)) {
    callback(new Error('身份证格式不正确!'))
  } else {
    callback()
  }
}

/**
 * 验证身份证号
 * @param rule
 * @param value
 * @param callback
 */
export const validateMobile = (rule, value, callback) => {
  const reg = /^1[3456789]{1}\d{9}$/gi
  if (value === '') {
    callback(new Error('请输入手机号'))
  } else if (!reg.test(value)) {
    callback(new Error('手机号格式不正确!'))
  } else {
    callback()
  }
}

/**
 * 验证数字
 * @param rule
 * @param value
 * @param callback
 */
export const validateNumber = (rule, value, callback) => {
  const reg = new RegExp('^\\d+$', 'gi')
  if (value === '') {
    callback(new Error('请输入值'))
  } else if (!reg.test(value)) {
    callback(new Error('数据格式不正确!'))
  } else {
    callback()
  }
}

/**
 * 验证数字
 * @param rule
 * @param value
 * @param callback
 */
export const validatePwd = (rule, value, callback) => {
  const reg = new RegExp(/^[a-zA-Z\d!@#$%^&*]{6,32}$/gi)
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (!reg.test(value)) {
    callback(new Error('密码格式不正确(6-32位数字或字母)!'))
  } else {
    callback()
  }
}

/**
 * 验证数字
 * @param rule
 * @param value
 * @param callback
 */
export const validateMoney = (rule, value, callback) => {
  const reg = new RegExp(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/)
  if (value === '') {
    callback(new Error('请输入金额'))
  } else if (!reg.test(value)) {
    callback(new Error('金额格式不正确!'))
  } else {
    callback()
  }
}

