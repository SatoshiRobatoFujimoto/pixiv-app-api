/* eslint no-console:0 */
'use strict'
// eslint-disable-next-line import/no-extraneous-dependencies
const pixivImg = require('pixiv-img')
const Pixiv = require('../dist')

const wait = () => new Promise(resolve => setTimeout(() => resolve(), 100))

async function dl(json) {
  // eslint-disable-next-line no-unused-vars
  for (const illust of json.illusts) {
    console.log(JSON.stringify(illust, null, 2))
    const { orignalImgUrl } = illust.metaSinglePage
    if (orignalImgUrl) {
      // eslint-disable-next-line no-await-in-loop
      await pixivImg(orignalImgUrl)
      // eslint-disable-next-line no-await-in-loop
      await wait()
    }
  }
}

async function main() {
  const { NAME, PASSWORD } = process.env
  const pixiv = new Pixiv(NAME, PASSWORD)
  const word = '艦これ10000users入り'

  await pixiv.login()
  const json = await pixiv.searchIllust(word)
  await dl(json)
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (!pixiv.hasNext()) {
      break
    }
    // eslint-disable-next-line no-await-in-loop
    const nextJson = await pixiv.next()
    // eslint-disable-next-line no-await-in-loop
    await dl(nextJson)
  }
  console.log('finish')
}

main().catch(console.error)
