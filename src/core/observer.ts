import { bot } from "./bot.ts"
import { Command, Composer, Context, State } from "types"

class Observer<C extends Context> {
  constructor(public composer: Composer<C>) {}

  // deno-lint-ignore no-explicit-any
  set handler(callback: (ctx: C) => Promise<any>) {
    this.composer.use(callback)
  }

  state(value: State) {
    return new Observer(
      this.composer.filter((ctx) => ctx.session.state == value),
    )
  }
  command(value: Command) {
    return new Observer(this.composer.command(value))
  }
  text() {
    return new Observer(this.composer.on("message:text"))
  }
  message() {
    return new Observer(this.composer.on("message"))
  }
  button(prefix: string) {
    return new Observer(
      this.composer.filter((ctx) => {
        const data = ctx.callbackQuery?.data
        return data ? data.startsWith(prefix) : false
      }),
    )
  }
}

export const observer = new Observer(bot)
