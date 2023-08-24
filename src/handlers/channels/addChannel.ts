import { parseLink } from "api"
import { addChannel } from "db"
import { askNext, finish, replyError, setState } from "lib"
import { messages } from "messages"
import { editText } from "my_grammy_lib"
import observers from "observers"

const o = observers.channels.addChannel
const m = messages.channels.addChannel

o._.handler = async (ctx) => {
  setState(ctx, "channels_post")
  await editText(ctx, m.askPost)
}

o.channelPost.handler = async (ctx) => {
  const channelId = ctx.msg.forward_from_chat?.id
  if (!channelId) await replyError(ctx, "Не вижу источника поста")
  await askNext(ctx, m.askLink, "channels_link", { channelId })
}

o.link.handler = async (ctx) => {
  const link = parseLink(ctx.msg.text, ctx.msg.entities ?? [])
  if (!link) await replyError(ctx, "В сообщении не найдена ссылка")
  await askNext(ctx, m.askTitle, "channels_title", { link })
}

o.title.handler = async (ctx) => {
  const { link, channelId } = ctx.session
  const title = ctx.msg.text
  await addChannel(channelId!, title, link!)
  await finish(ctx, m.success)
}
