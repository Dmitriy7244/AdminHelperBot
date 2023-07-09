import { editReplyMarkup, exclude, reply, sendMessage, setState } from "core"
import { Message } from "tg"
import { Context } from "types"
import messageCollector from "../core/messageCollector.ts"
import { copyMessages } from "../core/userbot.ts"
import { parseQuery } from "./buttons.ts"
import * as config from "./config.ts"
import { REPORT_CHAT_ID } from "./config.ts"
import K from "./kbs.ts"
import { parseChannels, resolveDate, resolveDatetime } from "./lib.ts"
import M from "./messages.ts"
import { Channel, Post, Sale, Seller } from "./models.ts"
import O from "./observers.ts"

async function tryDeleteLastMsg(ctx: Context) {
  const msgId = ctx.session.lastMessageId
  if (!msgId) return
  try {
    await ctx.api.deleteMessage(ctx.chat!.id, msgId)
  } catch (e) {
    console.error(e)
  }
}

function saveLastMsgId(ctx: Context, msg: Message) {
  ctx.session.lastMessageId = msg.message_id
}

O.start.handler = async (ctx) => {
  setState(ctx)
  await reply(ctx, M.hello)
}
O.channels.handler = (ctx) => reply(ctx, M.channels)

O.addSale.handler = async (ctx) => {
  ctx.session.channels = []
  await reply(ctx, M.askChannels)
  setState(ctx, "sale:channels")
  await ctx.deleteMessage()
}

O.pickChannel.handler = async (ctx) => {
  const channel = parseQuery(ctx, "channel")
  let channels = ctx.session.channels ?? []
  if (channels.includes(channel)) channels = exclude(channels, channel)
  else channels.push(channel)
  ctx.session.channels = channels
  await editReplyMarkup(ctx, K.channels(channels))
}

O.pickAllChannels.handler = async (ctx) => {
  let channels = ctx.session.channels ?? []
  if (channels.length == config.channels.length) channels = []
  else channels = config.channels.map((c) => c.title)
  ctx.session.channels = channels
  await editReplyMarkup(ctx, K.channels(channels))
}

O.ready.state("sale:channels").handler = async (ctx) => {
  const channels = ctx.session.channels ?? []
  if (!channels.length) {
    await ctx.answerCallbackQuery("Выбери хотя бы один канал")
    return
  }
  setState(ctx, "sale:date")
  saveLastMsgId(ctx, await reply(ctx, M.askDate))
  await ctx.deleteMessage()
}

O.text.state("sale:date").handler = async (ctx) => {
  try {
    ctx.session.date = resolveDate(ctx.msg.text)
  } catch {
    await reply(ctx, M.dateError)
    return
  }
  const msg = await reply(ctx, M.askTime)
  setState(ctx, "sale:time")
  await ctx.deleteMessage()
  await tryDeleteLastMsg(ctx)
  saveLastMsgId(ctx, msg)
}

O.text.state("sale:time").handler = async (ctx) => {
  try {
    resolveDatetime(ctx.msg.text, ctx.session.date!)
  } catch {
    await reply(ctx, M.timeError)
    return
  }
  const channels = ctx.session.channels!.map((c) => Channel.fromTitle(c))
  const post = new Post(ctx.session.date!)
  const seller = new Seller(ctx.from.id, ctx.from.first_name)
  const sale = new Sale(seller, channels, [post])
  await sendMessage(REPORT_CHAT_ID, M.sale(sale))
  const msg = await reply(ctx, M.askPost)
  setState(ctx)
  await ctx.deleteMessage()
  await tryDeleteLastMsg(ctx)
  saveLastMsgId(ctx, msg)
}

O.schedulePost.handler = async (ctx) => {
  setState(ctx, "sale:post")
  ctx.session.asForward = false
  ctx.session.noSound = false
  await ctx.editMessageText("Отправь пост")
}

O.message.state("sale:post").handler = async (ctx) => {
  const messages = await messageCollector.get(ctx)
  if (!messages.length) return
  ctx.session.messageIds = messages
  await reply(ctx, M.postOptions(ctx.session.asForward, ctx.session.noSound))
  await tryDeleteLastMsg(ctx)
}

O.asForward.handler = async (ctx) => {
  await updateOptions(ctx, !ctx.session.asForward, ctx.session.noSound)
}

O.noSound.handler = async (ctx) => {
  await updateOptions(ctx, ctx.session.asForward, !ctx.session.noSound)
}

O.ready.state("sale:post").handler = async (ctx) => {
  console.log(ctx.session.messageIds)
  for (const c of ctx.session.channels!) {
    const channel = Channel.fromTitle(c)
    try {
      await copyMessages(
        channel.id,
        ctx.chat!.id,
        ctx.session.messageIds!,
        ctx.session.date!,
        !!ctx.session.asForward,
        !!ctx.session.noSound,
      )
    } catch (e) {
      ctx.reply(`<b>[Ошибка]</b> <code>${e}</code>`)
      return
    }
  }
  setState(ctx)
  ctx.editMessageText("Пост запланирован")

  // const deleteDelta = 24 * 60 * 60
  // await prisma.post.create({
  // data: { deleteTime: Time(ctx.session.date) + deleteDelta },
  // })
}

async function updateOptions(ctx: Context, asForward = false, noSound = false) {
  ctx.session.asForward = asForward
  ctx.session.noSound = noSound
  await editReplyMarkup(ctx, K.postOptions(asForward, noSound))
}

O.text.handler = async (ctx) => {
  const channels = parseChannels(ctx.msg)
  if (!channels.length) return
  ctx.session.channels = channels
  setState(ctx, "sale:date")
  const msg = await reply(ctx, M.askDate)
  await ctx.deleteMessage()
  saveLastMsgId(ctx, msg)
}
