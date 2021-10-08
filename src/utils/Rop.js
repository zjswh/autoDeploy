import ROP from '@whzcorcd/rop-client'

const rp = new ROP({
  ICS_ADDR: `mqttdms.aodianyun.com`,
  ROP_FLASH_SITE: `https://cdn.aodianyun.com/dms/`
})

export default rp
