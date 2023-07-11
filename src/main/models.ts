import env from "env"
import { getModelForClass, mongoose, prop } from "typegoose"

mongoose.connect(
  `mongodb://root:${env.str("MONGO_PASSWORD")}@${env.str("MONGO_HOST")}:27017/${
    env.str("MONGO_DB")
  }?authSource=admin`,
)

class Sale {
  @prop()
  text!: string
}

export class Post {
  @prop()
  chatId!: number
  @prop({ type: [Number] })
  messageIds!: number[]
  @prop()
  deleteTime!: number
}

export const SaleDoc = getModelForClass(Sale)
export const PostDoc = getModelForClass(Post)
