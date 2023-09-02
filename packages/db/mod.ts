import { error } from "deps"
import { Channel, channelModel, saleModel } from "models"

async function findChannel(title: string) {
  const doc = await channelModel.findOne({ title }).exec()
  if (!doc) error("Channel not found", { title })
  return new Channel(doc.id, doc.title, doc.url)
}

async function deleteChannel(title: string) {
  await channelModel.deleteOne({ title }).exec()
  CHANNELS = CHANNELS.filter((c) => c.title != title)
}

async function deletePost(saleId: string) {
  const doc = await saleModel.findById(saleId).exec()
  if (!doc) error("Sale not found", { saleId })
  doc.text = undefined
  doc.buttons = []
  doc.deleteTimerHours = undefined
  doc.scheduledPosts = []
  doc.save()
}

async function getSale(saleId: string) {
  const doc = await saleModel.findById(saleId).exec()
  if (!doc) error("Sale not found", { saleId })
  return doc
}

async function findChannels(titles: string[]) {
  const channels = []
  for (const title of titles) {
    channels.push(await findChannel(title))
  }
  return channels
}

async function getChannels() {
  const docs = await channelModel.find().exec()
  return docs.map((doc) => new Channel(doc.id, doc.title, doc.url))
}

async function addChannel(id: number, title: string, url: string) {
  const channel = new Channel(id, title, url)
  await channelModel.create(channel)
  CHANNELS.push(channel)
}

let CHANNELS = await getChannels()

export {
  addChannel,
  CHANNELS,
  deleteChannel,
  deletePost,
  findChannel,
  findChannels,
  getChannels,
  getSale,
}
