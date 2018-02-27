
/**
 * 节流
 * @param {*} fn 回调函数
 * @param {*} threshhold 节流时间 
 */
export function throttle(fn, threshhold) {
  let last
  let timer
  threshhold || (threshhold = 250)
  return function () {
    let context = this
    let args = arguments
    let now = +new Date()
    if (last && now < last + threshhold) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        fn.apply(context, args)
      }, threshhold)
    } else {
      last = now
      fn.apply(context, args)
    }
  }
}

/**
 * 防抖动
 * @param {*} fn  回调函数
 * @param {*} delay  延迟时间
 */
export function debounce(fn, delay) {
  let timer
  return function () {
    let context = this
    let args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}
