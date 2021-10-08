/* eslint-disable no-undef */
import ROP from '../utils/Rop'

const mixinsDmsEntry = () => {

}

const _DMSInit = (key, topic) => {
  ROP.Leave()
  const token = "123121"
  const ramdomNum = String(Math.floor(Math.random() * 666666) + new Date().getTime())
  const clientId = token + '_' + ramdomNum
  ROP.Enter('', key, clientId, true)

  // chat连接成功后的消息
  ROP.On('enter_suc', function () {
    console.info('DMS:服务器连接成功')
    ROP.Subscribe(topic)
  })
  ROP.On('reconnect', err => {
    console.warn('DMS:重连', err)
  })
  // chat连接失败后的消息
  ROP.On('enter_fail', err => {
    console.error('DMS:服务器连接失败', err)
  })
  // chat接收到的消息
  ROP.On('publish_data', (str, topic) => {
    const data = JSON.parse(str)
    switch (topic) {
      case "autoDeploy":
        if (data.cmd === 'finished') {
          tableData.value[idx][item] = form[item];
          console.log(data.data)
        }
        break
      default:
        break
    }
  })
  // chat断开连接后的消息
  ROP.On('losed', function () {
    console.info('DMS:服务器断开连接')
  })
}
export {
  _DMSInit
}

