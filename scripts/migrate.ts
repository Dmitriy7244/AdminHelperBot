import { env } from "deps"
import { Channel, ContentPost, Post, Sale, ScheduledPost } from "models"
import { Collection, MongoClient } from "npm:mongodb"

const client = new MongoClient(env.str("MONGO_URL"))
const db = client.db()

function deleteExtraFields(collection: Collection) {
  return collection.updateMany({}, { $unset: { __v: true } })
}

async function migrateCollection(oldName: string, newName: string) {
  const coll = db.collection(oldName)
  await deleteExtraFields(coll)
  await coll.rename(newName)
}

async function migrateChannels() {
  await migrateCollection("channels", Channel.name)
}

async function migrateSales() {
  await migrateCollection("sales", Sale.name)
}

async function migrateContentPosts() {
  await migrateCollection("contentposts", ContentPost.name)
}

async function migratePosts() {
  await migrateCollection("posts", Post.name)
}

async function migrateScheduledPosts() {
  await migrateCollection("scheduledposts", ScheduledPost.name)
}

async function migrateAll() {
  await migrateChannels()
  await migrateSales()
  await migrateContentPosts()
  await migratePosts()
  await migrateScheduledPosts()
}

await migrateAll()
await client.close()
