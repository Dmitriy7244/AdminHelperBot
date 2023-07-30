import { nextYear } from "api"
import { findChannel, parseQuery, setState } from "lib"
import M from "messages"
import { ScheduledPostDoc } from "models"
import { editText, reply } from "my_grammy_lib"
import O from "observers"
import { MyContext } from "types"
import { copyMessages } from "userbot"

const o = O.content

o.command.handler = async (ctx) => {
  setState(ctx, "content:channel")
  await reply(ctx, M.content.askChannel)
}

o.pickChannel.handler = async (ctx) => {
  const title = parseQuery(ctx, "channel")
  const channel = findChannel(title)
  setState(ctx, "content:posts")
  ctx.session.channelId = channel.id
  ctx.session.filedIds = []
  ctx.session.messageIds = []
  await editText(ctx, M.content.askPosts)
}

o.postMessage.handler = (ctx) => {
  ctx.session.messageIds.push(ctx.msg.message_id)
}

o.ready.handler = async (ctx) => {
  setState(ctx)
  const date = nextYear(new Date())
  const chatId = ctx.session.channelId!
  const messageIds = ctx.session.messageIds
  if (!messageIds.length) {
    await ctx.editMessageText("Сообщений не найдено")
    return
  }
  console.log(messageIds)
  const result = await tryCopyMessages(ctx, chatId, messageIds, date)
  if (!result) return
  await ctx.editMessageText("Контент добавлен")
  await ScheduledPostDoc.create({ chatId, messageIds: result })
}

async function tryCopyMessages(
  ctx: MyContext,
  chatId: number,
  messageIds: number[],
  date: Date,
) {
  try {
    return await copyMessages(
      chatId,
      ctx.chat!.id,
      messageIds,
      date,
    )
  } catch (e) {
    await ctx.reply(`<b>[Ошибка]</b> <code>${e}</code>`)
    return false
  }
}
