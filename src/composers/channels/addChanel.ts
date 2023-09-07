import {
  askChannelPost,
  handleChannelLink,
  handleChannelPost,
  saveChannel,
} from "composers/channels/lib.ts"
import { createComposer, onQuery, onText, parseUrls } from "new/lib.ts"

const cmp = createComposer()

onQuery(cmp, "Добавить канал").use(async (ctx) => {
  ctx.session.state = "channels_post"
  await ctx.deleteMessage()
  await askChannelPost(ctx.chat!.id)
})

onText(cmp, "channels_post").use(async (ctx) => {
  const channelId = ctx.msg.forward_from_chat?.id
  await handleChannelPost(ctx.chat.id, channelId)
  ctx.session.state = "channels_link"
  ctx.session.channelId = channelId
})

onText(cmp, "channels_link").use(async (ctx) => {
  const urls = parseUrls(ctx.msg)
  const url = await handleChannelLink(ctx.chat.id, urls)
  ctx.session.state = "channels_title"
  ctx.session.link = url
})

onText(cmp, "channels_title").use(async (ctx) => {
  ctx.session.state = undefined
  await saveChannel(ctx.chat.id, {
    id: ctx.session.channelId!,
    title: ctx.msg.text,
    link: ctx.session.link!,
  })
})

export { cmp as addChannelComposer }
