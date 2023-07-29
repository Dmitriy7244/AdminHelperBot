import { getPhotoId } from "core/mod.ts"
import { findChannel, parseQuery, setState } from "lib"
import M from "messages"
import { ContentPostDoc } from "models"
import { editText, reply } from "my_grammy_lib"
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

o.photo.handler = (ctx) => {
  const photoId = getPhotoId(ctx)
  ctx.session.filedIds.push(photoId)
  console.log(ctx.session.filedIds)
}

o.ready.handler = async (ctx) => {
  const chatId = ctx.session.channelId!
  ctx.session.filedIds.forEach((photoId) =>
    ContentPostDoc.create({ chatId, photoId })
  )
  await ctx.editMessageText("Контент добавлен")
}
