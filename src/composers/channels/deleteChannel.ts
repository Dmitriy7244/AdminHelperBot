import { askPickChannel } from "composers/channels/lib.ts"
import { deleteChannel } from "db"
import { parseQuery } from "lib"
import { createComposer, onQuery, onQueryWithState } from "new/lib.ts"

const cmp = createComposer()

onQuery(cmp, "Удалить канал").use(async (ctx) => {
  ctx.session.state = "channels_delete"
  await ctx.deleteMessage()
  await askPickChannel(ctx.chat!.id)
})

onQueryWithState(cmp, "channel", "channels_delete").use(async (ctx) => {
  const title = parseQuery(ctx, "channel")
  await deleteChannel(title)
  await ctx.deleteMessage()
  await askPickChannel(ctx.chat!.id)
})

export { cmp as deleteChannelComposer }
