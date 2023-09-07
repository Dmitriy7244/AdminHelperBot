import { Channel, channelRepo, Post, postRepo, saleRepo } from "models"

function findChannel(title: string) {
  return channelRepo.find({ title })
}

async function deleteChannel(title: string) {
  await channelRepo.deleteBy({ title })
  CHANNELS = CHANNELS.filter((c) => c.title != title)
}

async function deleteSalePost(saleId: string) {
  const sale = await saleRepo.get(saleId)
  sale.text = undefined
  sale.buttons = []
  sale.deleteTimerHours = undefined
  sale.scheduledPosts = []
  await saleRepo.save(sale)
}

function getSale(saleId: string) {
  return saleRepo.get(saleId)
}

async function findChannels(titles: string[]) {
  const channels = []
  for (const title of titles) {
    channels.push(await findChannel(title))
  }
  return channels
}

function getChannels() {
  return channelRepo.findAll()
}

async function addChannel(id: number, title: string, url: string) {
  const channel = new Channel(id, title, url)
  await channelRepo.save(channel)
  CHANNELS.push(channel)
}

async function findSale(text: string) {
  const sales = await saleRepo.findAll({ text })
  if (!sales.length) return
  return sales[sales.length - 1]
}

function findPosts() {
  return postRepo.findAll()
}

function deletePost(post: Post) {
  return postRepo.delete(post)
}

let CHANNELS = await getChannels()

export {
  addChannel,
  CHANNELS,
  deleteChannel,
  deletePost,
  deleteSalePost,
  findChannel,
  findChannels,
  findPosts,
  findSale,
  getChannels,
  getSale,
}
