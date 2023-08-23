import { parseLink } from "api"
import { addChannel } from "db"
import { setState } from "lib"
import { messages } from "messages"
import { editText, reply } from "my_grammy_lib"
import observers from "observers"

const o = observers.channels.addChannel
const m = messages.channels.addChannel

o._.handler = async (ctx) => {
  setState(ctx, "channels_post")
  await editText(ctx, m.askPost)
}

o.channelPost.handler = async (ctx) => {
  const channelId = ctx.msg.forward_from_chat?.id
  if (!channelId) {
    await ctx.reply("Не вижу источника поста")
    return
  }
  ctx.session.channelId = channelId
  setState(ctx, "channels_link")
  await reply(ctx, m.askLink)
}

o.link.handler = async (ctx) => {
  const link = parseLink(ctx.msg.text, ctx.msg.entities ?? [])
  if (!link) {
    await ctx.reply("В сообщении не найдена ссылка")
    return
  }
  ctx.session.link = link
  setState(ctx, "channels_title")
  await reply(ctx, m.askTitle)
}

o.title.handler = async (ctx) => {
  const { link, channelId } = ctx.session
  const title = ctx.msg.text
  await addChannel(channelId!, title, link!)
  setState(ctx)
  await reply(ctx, m.success)
}
