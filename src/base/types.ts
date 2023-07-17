import { Sale } from "models"
import { BaseContext, BaseSession, Observer } from "my_grammy"

export type State =
  | "sale:channels"
  | "sale:date"
  | "sale:time"
  | "sale:post"
  | "sale:buttons"
export type Command =
  | "start"
  | "add_sale"
  | "channels"
  | "check_rights"
  | "test"

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
  channels: string[]
  asForward: boolean
  noSound: boolean
  state?: State
  date?: Date
  lastMessageId?: number
  postText?: string
  sale?: Sale
}

export type MyContext = BaseContext<MySession>
export type MyObserver = Observer<MyContext, Command, State, QueryPrefix>
