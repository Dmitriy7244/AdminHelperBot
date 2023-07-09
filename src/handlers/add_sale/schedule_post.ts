import { editText } from "core/mod.ts"
import { resetSalePost, setState, updatePostOptions } from "lib"
import M from "messages"
import { Channel } from "models"
import O from "observers"
import { copyMessages } from "userbot"

O.schedulePost.handler = async (ctx) => {
  setState(ctx, "sale:post")
  resetSalePost(ctx)
  const m = M.postOptions(ctx.session.asForward, ctx.session.noSound)
  await editText(ctx, m)
}

O.salePostMessage.handler = (ctx) => {
  if (!ctx.session.messageIds) ctx.session.messageIds = []
  ctx.session.messageIds.push(ctx.msg.message_id)
}

O.asForward.handler = async (ctx) => {
  await updatePostOptions(ctx, !ctx.session.asForward, ctx.session.noSound)
}

O.noSound.handler = async (ctx) => {
  await updatePostOptions(ctx, ctx.session.asForward, !ctx.session.noSound)
}

O.salePostReady.handler = async (ctx) => {
  for (const c of ctx.session.channels!) {
    const channel = Channel.fromTitle(c)
    try {
      await copyMessages(
        channel.id,
        ctx.chat!.id,
        ctx.session.messageIds!,
        ctx.session.date!,
        ctx.session.asForward,
        ctx.session.noSound,
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
