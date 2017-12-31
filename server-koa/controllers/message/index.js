const gravatar = require('gravatar')
const message = require('../../models/message')
const _service = require('../../service')
const { getLocationInfo, getIp } = require('../../service/location')

module.exports = {
  getMessages: async (ctx) => {
    let body = {code: '01', result: ''}
    try {
      let current = ctx.request.body.current || ctx.request.query.current || 1
      let page_size = ctx.request.body.page_size || ctx.request.query.page_size || 32
      let options = {
        current,
        page_size,
        find_con: {}
      }
      let result = await _service.findAndCountAll(message, options)
      body.result = result
    } catch (e) {
      body.code = '02'
      body.result = e.message
    } finally {
      ctx.body = body
    }
  },

  findMessage: async (ctx) => {},

  addMessage: async (ctx) => {
    let body = {code: '01', result: ''}
    try {
      let nickname = ctx.request.body.nickname || ctx.request.query.nickname
      let content = ctx.request.body.content || ctx.request.query.content
      let email = ctx.request.body.email || ctx.request.query.email

      const ip = await getIp()
      console.log('ip：', ip)
      const location = await getLocationInfo(ip)
      console.log('location：', location)

      let avatar = gravatar.url(email, {s: '100'})
      const qqREG = /^(.{1,})@qq\.com$/
      if (qqREG.test(email)) {
        const qq = email.replace(qqREG, '$1')
        avatar = `//q1.qlogo.cn/g?b=qq&nk=${qq}&s=100`
      }

      let messageModel = {
        nickname,
        content,
        email,
        location: {
          ip: ip,
          country: location.country,
          province: location.province,
          city: location.city,
          district: location.district
        },
        avatar: avatar
      }
      let result = await _service.create(message, messageModel)
      body.result = result
    } catch (e) {
      body.code = '02'
      body.result = e.message
    } finally {
      ctx.body = body
    }
  },

  updateMessage: async (ctx) => {},

  destoryMessage: async (ctx) => {},

  replyMessage: async (ctx) => {}
}
