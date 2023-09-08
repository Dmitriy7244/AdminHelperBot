import { Composer } from "new/deps.ts"
import { Command, MyContext, QueryPrefix, State } from "types"

export function onQuery<C extends MyContext>(
  composer: Composer<C>,
  prefix: QueryPrefix,
) {
  return composer.on("callback_query:data").filter((ctx) => {
    const data = ctx.callbackQuery?.data
    return data ? data.startsWith(prefix) : false
  })
}

export function onCommand<C extends MyContext>(
  composer: Composer<C>,
  command: Command,
) {
  return composer.command(command)
}

export function onQueryWithState<C extends MyContext>(
  composer: Composer<C>,
  prefix: QueryPrefix,
  state: State,
) {
  return withState(onQuery(composer, prefix), state)
}

export function onMessage<C extends MyContext>(
  composer: Composer<C>,
  state: State,
) {
  return withState(composer.on("message"), state)
}

export function withState<C extends MyContext>(
  composer: Composer<C>,
  state: State,
) {
  return composer.filter((ctx) => {
    try {
      const session = ctx.session
      return session.state == state
    } catch {
      return false
    }
  })
}

export function onText<C extends MyContext>(
  composer: Composer<C>,
  state: State,
) {
  return withState(composer.on("message:text"), state)
}

export function onAnyText<C extends MyContext>(
  composer: Composer<C>,
) {
  return composer.on("message:text")
}

export function onChannelPost<C extends MyContext>(
  composer: Composer<C>,
) {
  return composer.on("channel_post")
}
