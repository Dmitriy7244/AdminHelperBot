import { resolveDate } from "api"
import { addButtonsComposer } from "composers/addSale/addButtons.ts"
import { addPostComposer } from "composers/addSale/addPost.ts"
import { schedulePostComposer } from "composers/addSale/schedulePost.ts"
import { bot } from "loader"
import M from "messages"
import {
  createComposer,
  onCommand,
  onQuery,
  onQueryWithState,
  onText,
} from "new/lib.ts"
import {
  askPickChannels,
  handleDeletePost,
  handleTime,
  onSaleDate,
} from "./lib.ts"
import { pickChannelsObserver } from "./pickChannels.ts"

const cmp = createComposer()

onCommand(cmp, "add_sale").use(async (ctx) => {
  ctx.session.state = "sale:channels"
  ctx.session.channels = []
  await askPickChannels(ctx.chat.id)
  await ctx.deleteMessage()
})

cmp.use(pickChannelsObserver.composer)

onText(cmp, "sale:date").use(async (ctx) => {
  try {
    ctx.session.date = resolveDate(ctx.msg.text)
  } catch {
    await bot.sendMessage(ctx.chat.id, M.dateError)
    return
  }
  await onSaleDate(ctx)
})

onQueryWithState(cmp, "Сегодня", "sale:date").use(async (ctx) => {
  ctx.session.date = new Date()
  await onSaleDate(ctx)
})

onQueryWithState(cmp, "Завтра", "sale:date").use(async (ctx) => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  ctx.session.date = date
  await onSaleDate(ctx)
})

onText(cmp, "sale:time").use(handleTime)
onQuery(cmp, "Удалить посты").use(handleDeletePost)

cmp.use(schedulePostComposer)
cmp.use(addButtonsComposer)
cmp.use(addPostComposer)

export { askPickChannels, cmp as addSaleComposer }
