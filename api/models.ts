import { connectToMongoFromEnv } from "my_mongo"
import { MessageEntity } from "tg"
import { getModelForClass, prop } from "typegoose"

connectToMongoFromEnv()

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

export class ScheduledPost {
  @prop()
  chatId: number
  @prop({ type: Number })
  messageIds: number[]
}

export const SaleDoc = getModelForClass(Sale)
export const PostDoc = getModelForClass(Post)
export const ContentPostDoc = getModelForClass(ContentPost)
export const ScheduledPostDoc = getModelForClass(ScheduledPost)
