import { Session } from "https://deno.land/x/my_grammy@v0.0.4/types.ts"
import { BaseContext, Observer } from "my_grammy"

export type State = "sale:channels" | "sale:date" | "sale:time" | "sale:post"
export type Command = "start" | "add_sale" | "channels" | "userbot" | "test"

export type QueryPrefix =
  | "channel"
  | "➕ Выбрать все"
  | "✅ Готово"
  | "Запланировать пост"
  | "asForward"
  | "noSound"

export type MySession = Session & {
  messageIds: number[]
  channels: string[]
  asForward: boolean
  noSound: boolean
  state?: State
  date?: Date
  lastMessageId?: number
  postText?: string
}

export type MyContext = BaseContext<MySession>
export type MyObserver = Observer<MyContext, Command, State, QueryPrefix>
