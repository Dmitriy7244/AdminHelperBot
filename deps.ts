export { connectToMongoFromEnv } from "https://deno.land/x/my_mongo@v0.1.0/mod.ts"
export { default as env } from "https://deno.land/x/parse_env@v0.0.3/mod.ts"
export {
  sleep,
  sleepRandomAmountOfSeconds,
} from "https://deno.land/x/sleep@v1.2.1/sleep.ts"
export { getModelForClass, prop } from "npm:@typegoose/typegoose"
export { Document } from "npm:mongoose"

export {
  Context,
  InlineKeyboard,
  type NextFunction,
} from "https://deno.land/x/grammy@v1.17.2/mod.ts"
export type {
  BotCommand,
  Message,
  MessageEntity,
} from "https://deno.land/x/grammy@v1.17.2/types.ts"
export {
  addButtons,
  CallbackButton,
  editReplyMarkup,
  editText,
  Msg,
  parseEntity,
  parseQuery,
  reply,
  sendMessage,
  setState,
  Time,
} from "https://deno.land/x/my_grammy@v0.1.1/lib.ts"
export {
  type BaseContext,
  type BaseSession,
  bold,
  Bot,
  link,
  Observer,
} from "https://deno.land/x/my_grammy@v0.1.1/mod.ts"

export * as mgl from "https://deno.land/x/my_grammy@v0.1.1/lib.ts"

function log(header: string, data?: object) {
  console.log(`${header}:`, data)
}

function exclude<T>(array: T[], value: T) {
  return array.filter((item) => item !== value)
}

function error(header: string, data?: object): never {
  console.error(`${header}:`, data)
  throw new Error(header)
}

function filterFalsy<T>(array: (T | undefined | null)[]): T[] {
  return array.filter((i) => i != null) as T[]
}

export { error, exclude, filterFalsy, log }
