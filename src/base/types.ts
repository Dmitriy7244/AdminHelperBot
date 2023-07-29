import { Button } from "models"
import { BaseContext, BaseSession, Observer } from "my_grammy"

export type State =
  | "sale:channels"
  | "sale:date"
  | "sale:time"
  | "sale:post"
  | "sale:buttons"
  | "content:channel"
  | "content:posts"
export type Command =
  | "start"
  | "add_sale"
  | "channels"
  | "check_rights"
  | "test"
  | "content"

export type QueryPrefix =
  | "channel"
  | "➕ Выбрать все"
  | "✅ Готово"
  | "Запланировать пост"
  | "asForward"
  | "noSound"
  | "Добавить кнопки"

export type MySession = BaseSession & {
  messageIds: number[]
  filedIds: string[]
  channels: string[]
  asForward: boolean
  noSound: boolean
  channelId?: number
  state?: State
  date?: Date
  lastMessageId?: number
  postText?: string
  saleId?: string
  saleButtons: Button[][]
}

export type MyContext = BaseContext<MySession>
export type MyObserver = Observer<MyContext, Command, State, QueryPrefix>
