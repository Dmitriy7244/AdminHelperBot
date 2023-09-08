import { env, MessageEntity } from "deps"
import { connectClient, Document, DocumentRepo } from "./deps.ts"

export class Channel extends Document {
  constructor(public id: number, public title: string, public url: string) {
    super()
  }
}

export class Seller extends Document {
  constructor(public userId: number, public name: string) {
    super()
  }
}

export class Button {
  text: string
  url: string
}

export class ScheduledPost extends Document {
  constructor(public postGroupId: string) {
    super()
  }
}

export class Sale extends Document {
  text?: string
  buttons: Button[][] = []
  deleteTimerHours?: number
  scheduledPosts: ScheduledPost[] = []
  postGroupId?: string

  constructor(
    public publishDate: Date,
    public channels: Channel[],
    public seller: Seller,
  ) {
    super()
  }
}

export class Post extends Document {
  constructor(
    public chatId: number,
    public messageIds: number[],
    public deleteTime: number,
  ) {
    super()
  }
}

export class ContentPost extends Document {
  date?: number
  entities?: MessageEntity[]
  text?: string

  constructor(
    public chatId: number,
    public photoId: string,
  ) {
    super()
  }
}

const saleRepo = new DocumentRepo(Sale)
const postRepo = new DocumentRepo(Post)
const contentPostRepo = new DocumentRepo(ContentPost)
const scheduledPostRepo = new DocumentRepo(ScheduledPost)
const channelRepo = new DocumentRepo(Channel)

connectClient([
  saleRepo,
  postRepo,
  contentPostRepo,
  scheduledPostRepo,
  channelRepo,
], env.str("MONGO_URL"))

export { channelRepo, contentPostRepo, postRepo, saleRepo, scheduledPostRepo }
