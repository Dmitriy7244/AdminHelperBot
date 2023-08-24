import { error } from "deps"
import { Channel, channelModel } from "models"

async function findChannel(title: string) {
  const doc = await channelModel.findOne({ title }).exec()
  if (!doc) error("Channel not found", { title })
  return new Channel(doc.id, doc.title, doc.url)
}

async function deleteChannel(title: string) {
  await channelModel.deleteOne({ title }).exec()
  CHANNELS = CHANNELS.filter((c) => c.title != title)
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
  findChannel,
  findChannels,
  getChannels,
}
