import env from "env"
import * as grammy from "grammy"
import { hydrateReply, parseMode } from "grammy_parse_mode"
import { run } from "grammy_runner"
import { DenoKVAdapter } from "grammy_storage"
import { Context, Session } from "core/types.ts"

export default class Bot<S extends Session> extends grammy.Bot<Context<S>> {
  constructor(token: string, defaultSession: S) {
    super(token)
    this.initParseModePlugin()
    this.initSessionPlugin(defaultSession)
  }

  initParseModePlugin() {
    this.api.config.use(parseMode("HTML"))
    this.use(hydrateReply)
  }

  initSessionPlugin(defaultSession: Session) {
    this.use(createSessionMiddleware(defaultSession))
  }

  static fromEnv<S extends Session>(defaultSession: S) {
    return new Bot(env.str("TOKEN"), defaultSession)
  }

  run() {
    run(this)
  }
}

// @ts-ignore: TODO
const kv = await Deno.openKv()
const storage = new DenoKVAdapter(kv)

function getSessionKey(ctx: grammy.Context): string | undefined {
  if (ctx.from == undefined || ctx.chat == undefined) return
  return `${ctx.chat.id}/${ctx.from.id}`
}

function createSessionMiddleware(defaultSession: Session) {
  return grammy.session({
    initial: () => structuredClone(defaultSession),
    getSessionKey,
    storage,
  })
}
