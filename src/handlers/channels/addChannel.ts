import { addChannel } from "db"
import { Handler } from "manager"
import { messages } from "messages"
import observers from "observers"

const o = observers.channels.addChannel
const m = messages.channels.addChannel

o._.handler = Handler((mg) => mg.edit(m.askPost, "channels_post"))

o.channelPost.handler = Handler(async (mg) => {
  const channelId = mg.forwardFromChatId
  if (!channelId) await mg.replyError("Не вижу источника поста")
  await mg.reply(m.askLink, "channels_link", { channelId })
})

o.link.handler = Handler(async (mg) => {
  const urls = mg.urls
  if (!urls.length) await mg.replyError("В сообщении не найдена ссылка")
  await mg.reply(m.askTitle, "channels_title", { link: urls[0] })
})

o.title.handler = Handler(async (mg) => {
  const { link, channelId } = mg.session
  await addChannel(channelId!, mg.text, link!)
  await mg.finish(m.success)
})
