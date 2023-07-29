import { findChannel, parseQuery, setState } from "lib"
import M from "messages"
import { ContentPostDoc } from "models"
import { editText, getPhotoId, reply } from "my_grammy_lib"
import O from "observers"

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
  await editText(ctx, M.content.askPosts)
}

o.photo.handler = async (ctx) => {
  const chatId = ctx.session.channelId!
  const photoId = getPhotoId(ctx)
  const entities = ctx.message.caption_entities ?? []
  const text = ctx.message.caption
  await ContentPostDoc.create({
    chatId,
    photoId,
    entities,
    text,
  })
}

o.ready.handler = async (ctx) => {
  setState(ctx)
  await ctx.editMessageText("Контент добавлен")
}
