import { Message, Observer } from "deps"
import { BaseContext, Composer } from "new/deps.ts"
import { Command, MySession, QueryPrefix, State } from "types"
import { parseUrls as _parseUrls } from "../packages/manager/MsgManager.ts"
export * from "new/events.ts"
export * from "new/methods.ts"

export type MyContext = BaseContext<MySession>

export const createComposer = () => new Composer<MyContext>()
export const createObserver = () =>
  new Observer<MyContext, Command, State, QueryPrefix>(createComposer())

export function parseUrls(message: Message) {
  return _parseUrls(message.text ?? "", message.entities ?? [])
}
