import { resolveDate } from "api"
import { addButtonsComposer } from "composers/addSale/addButtons.ts"
import { addPostComposer } from "composers/addSale/addPost.ts"
import { schedulePostComposer } from "composers/addSale/schedulePost.ts"
import M from "messages"
import {
  createComposer,
  onCommand,
  onQuery,
  onQueryWithState,
  onText,
  sendMessage,
} from "new/lib.ts"
import {
  askPickChannels,
  handleDeletePost,
  handleTime,
  onSaleDate,
} from "./lib.ts"
import { pickChannelsComposer } from "./pickChannels.ts"

const cmp = createComposer()

onCommand(cmp, "add_sale").use(async (ctx) => {
  ctx.session.state = "sale:channels"
  ctx.session.channels = []
  await askPickChannels(ctx.chat.id)
  await ctx.deleteMessage()
})

cmp.use(pickChannelsComposer)

onText(cmp, "sale:date").use(async (ctx) => {
  try {
    ctx.session.date = resolveDate(ctx.msg.text)
  } catch {
    await sendMessage(ctx.chat.id, M.dateError)
    return
  }
  await onSaleDate(ctx)
})

onQueryWithState(cmp, "Сегодня", "sale:date").use(async (ctx) => {
  ctx.session.date = new Date()
  ctx.session.lastMessageId = undefined // TODO: check
  await onSaleDate(ctx)
})

onQueryWithState(cmp, "Завтра", "sale:date").use(async (ctx) => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  ctx.session.date = date
  ctx.session.lastMessageId = undefined // TODO: check
  await onSaleDate(ctx)
})

onText(cmp, "sale:time").use(handleTime)
onQuery(cmp, "Удалить посты").use(handleDeletePost)

cmp.use(schedulePostComposer)
cmp.use(addButtonsComposer)
cmp.use(addPostComposer)

export { askPickChannels, cmp as addSaleComposer }
