import { error } from "deps"
import { Channel, channelModel } from "models"

async function findChannel(title: string) {
  const doc = await channelModel.findOne({ title }).exec()
  if (!doc) error("Channel not found", { title })
  return new Channel(doc.id, doc.title, doc.url)
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

const CHANNELS = await getChannels() // TODO: update

export { CHANNELS, findChannel, findChannels, getChannels }
