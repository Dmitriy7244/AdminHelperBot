import { Composer } from "grammy"
import { Context } from "core/types.ts"

class Observer<
  C extends Context,
  Command extends string,
  State extends string,
> {
  constructor(public composer: Composer<C>) {}

  branch<_C extends C>(composer: Composer<_C>) {
    return new Observer<_C, Command, State>(composer)
  }

  set handler(callback: (ctx: C) => any) {
    this.composer.use(callback)
  }

  filter(predicate: (ctx: C) => boolean) {
    return this.branch(this.composer.filter(predicate))
  }

  state = (value: State) => this.filter((c) => c.session.state == value)
  command = (value: Command) => this.branch(this.composer.command(value))
  text = () => this.branch(this.composer.on("message:text"))
  message = () => this.branch(this.composer.on("message"))
  button = (text: string) => this.filter((c) => c.message?.text == text)

  query = <Prefix extends string>(prefix: Prefix) =>
    this.filter((ctx) => {
      const data = ctx.callbackQuery?.data
      return data ? data.startsWith(prefix) : false
    })
}

export default Observer
