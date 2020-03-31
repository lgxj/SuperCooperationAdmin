// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'

/**
 * 判断是否为空
 */
export const isEmpty = (data) => {
  if (!data) return true
  if (data === 'null' || data === 'undefined') return true
  if (JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]') return true
  return false
}

/**
 * 格式化地址显示
 * @param addr
 * @returns {string}
 */
export function formatAddress(addr) {
  if (!addr) return ''
  let str = ''
  if (addr.street.indexOf(addr.region) >= 0) {
    str += addr.street
  } else {
    str += addr.region + addr.street
  }

  str += addr.address_detail

  return str
}

/**
 * 去左右空格
 * @param s
 * @returns {*}
 */
export function trim(s) {
  return s.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
