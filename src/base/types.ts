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
  | "channels_post"
  | "channels_link"
  | "channels_title"
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
  | "Сегодня"
  | "Завтра"
  | "Таймер удаления"
  | "Добавить канал"

export type MySession = BaseSession & {
  messageIds: number[]
  filedIds: string[]
  channels: string[]
  asForward: boolean
  noSound: boolean
  channelId?: number
  link?: string
  state?: State
  date?: Date
  lastMessageId?: number
  postText?: string
  saleId?: string
  saleButtons: Button[][]
  deleteTimerHours: number
}

export type MyContext = BaseContext<MySession>
export type MyObserver = Observer<MyContext, Command, State, QueryPrefix>
