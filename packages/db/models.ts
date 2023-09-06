import { env, getModelForClass, MessageEntity, prop } from "deps"
import { mongoose } from "npm:@typegoose/typegoose"

const conn = await mongoose.createConnection(env.str("MONGO_URL")).asPromise()

export class Channel {
  @prop()
  id: number
  @prop()
  title: string
  @prop()
  url: string

  constructor(id: number, title: string, url: string) {
    this.id = id
    this.title = title
    this.url = url
  }
}

export class Seller {
  @prop()
  user_id: number
  @prop()
  name: string

  constructor(user_id: number, name: string) {
    this.user_id = user_id
    this.name = name
  }
}

export class Button {
  @prop()
  text: string
  @prop()
  url: string
}

export class ScheduledPost {
  @prop()
  postGroupId: string
}

export class Sale {
  @prop()
  publishDate: Date
  @prop({ type: Channel })
  channels: Channel[]
  @prop()
  seller: Seller
  @prop()
  text?: string
  @prop({ type: [[Button]] })
  buttons: Button[][]
  @prop()
  deleteTimerHours?: number
  @prop({ type: ScheduledPost })
  scheduledPosts: ScheduledPost[]
  @prop()
  postGroupId?: string

  constructor(publishDate: Date, channels: Channel[], seller: Seller) {
    this.publishDate = publishDate
    this.channels = channels
    this.seller = seller
    this.buttons = []
  }
}

export class Post {
  @prop()
  chatId: number
  @prop({ type: Number })
  messageIds: number[]
  @prop()
  deleteTime: number
}

export class ContentPost {
  @prop()
  chatId: number
  @prop()
  photoId: string
  @prop()
  date?: number
  @prop()
  entities?: MessageEntity[]
  @prop()
  text?: string
}

const saleModel = getModelForClass(Sale, { existingConnection: conn })
const postModel = getModelForClass(Post, { existingConnection: conn })
const contentPostModel = getModelForClass(ContentPost, {
  existingConnection: conn,
})
const scheduledPostModel = getModelForClass(ScheduledPost, {
  existingConnection: conn,
})
const channelModel = getModelForClass(Channel, { existingConnection: conn })

export {
  channelModel,
  contentPostModel,
  postModel,
  saleModel,
  scheduledPostModel,
}
