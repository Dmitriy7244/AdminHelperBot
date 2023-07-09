import { editReplyMarkup, setState } from "core/mod.ts"
import K from "kbs"
import { Channel } from "models"
import O from "observers"
import { MyContext } from "types"
import { copyMessages } from "userbot"

O.schedulePost.handler = async (ctx) => {
  setState(ctx, "sale:post")
  ctx.session.asForward = false
  ctx.session.noSound = false
  ctx.session.messageIds = []
  await ctx.editMessageText(`Отправь пост, затем нажми "Готово"`, {
    reply_markup: K.postOptions(ctx.session.asForward, ctx.session.noSound),
  })
}

O.message.state("sale:post").handler = (ctx) => {
  if (!ctx.session.messageIds) ctx.session.messageIds = []
  ctx.session.messageIds.push(ctx.msg.message_id)
  console.log(ctx.session.messageIds)
}

O.asForward.handler = async (ctx) => {
  await updateOptions(ctx, !ctx.session.asForward, ctx.session.noSound)
}

O.noSound.handler = async (ctx) => {
  await updateOptions(ctx, ctx.session.asForward, !ctx.session.noSound)
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

async function updateOptions(
  ctx: MyContext,
  asForward = false,
  noSound = false,
) {
  ctx.session.asForward = asForward
  ctx.session.noSound = noSound
  await editReplyMarkup(ctx, K.postOptions(asForward, noSound))
}
