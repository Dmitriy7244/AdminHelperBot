import { bot } from "./bot.ts"
import { Command, Composer, Context, State } from "./types.ts"

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
}

export const observer = new Observer(bot)
