import env from "env"
import { getModelForClass, mongoose, prop } from "typegoose"

mongoose.connect(
  `mongodb://root:${env.str("MONGO_PASSWORD")}@${env.str("MONGO_HOST")}:27017/${
    env.str("MONGO_DB")
  }?authSource=admin`,
)

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

export const SaleDoc = getModelForClass(Sale)
export const PostDoc = getModelForClass(Post)
