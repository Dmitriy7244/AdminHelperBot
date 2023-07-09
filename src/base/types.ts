import { BaseContext } from "core/types.ts"

export type State = "sale:channels" | "sale:date" | "sale:time" | "sale:post"
export type Command = "start" | "add_sale" | "channels" | "userbot" | "test"

export type QueryPrefix =
  | "channel"
  | "➕ Выбрать все"
  | "✅ Готово"
  | "Запланировать пост"
  | "asForward"
  | "noSound"

export type MySession = {
  messageIds: number[]
  channels: string[]
  asForward: boolean
  noSound: boolean
  state?: State
  date?: Date
  lastMessageId?: number
}

export type MyContext = BaseContext<MySession>
