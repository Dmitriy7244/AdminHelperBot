import { addChannel } from "db"
import { MsgManager } from "manager"
import { messages } from "messages"

const m = messages.channels.addChannel

export async function channelPost(mg: MsgManager) {
  const channelId = mg.forwardFromChatId
  if (!channelId) await mg.replyError("Не вижу источника поста")
  await mg.reply(m.askLink, "channels_link", { channelId })
}

export async function link(mg: MsgManager) {
  const urls = mg.urls
  if (!urls.length) await mg.replyError("В сообщении не найдена ссылка")
  await mg.reply(m.askTitle, "channels_title", { link: urls[0] })
}

export async function title(mg: MsgManager) {
  const { link, channelId } = mg.session
  await addChannel(channelId!, mg.text, link!)
  await mg.finish(m.success)
}
