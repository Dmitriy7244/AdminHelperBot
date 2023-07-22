import { editText, reply } from "core/mod.ts";
import {
  findChannel,
  findSale,
  resetSalePost,
  saveLastMsgId,
  setState,
  tryDeleteLastMsg,
  updatePostOptions,
} from "lib";
import M from "messages";
import { Button, SaleDoc } from "models";
import { BaseContext, link } from "my_grammy";
import O from "observers";
import { copyMessages } from "userbot";

O.schedulePost.handler = async (ctx) => {
  setState(ctx, "sale:post");
  resetSalePost(ctx);
  const m = M.postOptions(ctx.session.asForward, ctx.session.noSound);
  await editText(ctx, m);
};

O.salePostMessage.handler = (ctx) => {
  ctx.session.messageIds.push(ctx.msg.message_id);
  const text = ctx.msg.text ?? ctx.msg.caption;
  const buttons = (ctx.msg.reply_markup?.inline_keyboard ?? []) as Button[][];
  if (text) ctx.session.postText = text;
  ctx.session.sale!.buttons.push(...buttons);
};

O.asForward.handler = async (ctx) => {
  await updatePostOptions(ctx, !ctx.session.asForward, ctx.session.noSound);
};

O.noSound.handler = async (ctx) => {
  await updatePostOptions(ctx, ctx.session.asForward, !ctx.session.noSound);
};

function answerQuery(ctx: BaseContext, text: string, alert = true) {
  return ctx.answerCallbackQuery({ text, show_alert: alert });
}

O.salePostReady.handler = async (ctx) => {
  const messageIds = ctx.session.messageIds!;
  if (!messageIds.length) {
    await answerQuery(ctx, "Сначала отправь пост, потом вернись к этой кнопке");
    return;
  }
  const sale = ctx.session.sale!;
  sale.text = ctx.session.postText;
  await SaleDoc.create(sale);
  for (const c of ctx.session.channels!) {
    const channel = findChannel(c);
    try {
      await copyMessages(
        channel.id,
        ctx.chat!.id,
        messageIds,
        ctx.session.date!,
        ctx.session.asForward,
        ctx.session.noSound
      );
    } catch (e) {
      ctx.reply(`<b>[Ошибка]</b> <code>${e}</code>`);
      return;
    }
  }
  setState(ctx);
  await editText(ctx, M.postScheduled);
  for (const id of messageIds) {
    await ctx.api.deleteMessage(ctx.chat!.id, id);
  }
};

O.addButtons.handler = async (ctx) => {
  setState(ctx, "sale:buttons");
  saveLastMsgId(ctx, ctx.msg!);
  await editText(ctx, M.askButtons);
};

O.buttonsToAdd.handler = async (ctx) => {
  const text = ctx.msg.text;
  let buttons: Button[][];
  try {
    buttons = parseButtons(text);
  } catch {
    await ctx.reply("Ошибка в формате кнопок, попробуй снова");
    return;
  }
  const sale = await findSale(ctx.session.sale?.text!);
  if (!sale) {
    await ctx.reply("Ошибка, зовите Дмитрия!");
    return;
  }
  sale.buttons = buttons;
  await sale.save();
  setState(ctx);
  const preview = ButtonsPreview(buttons);
  await reply(ctx, M.buttonsAdded(preview));
  await ctx.deleteMessage();
  await tryDeleteLastMsg(ctx);
};

function parseButtons(text: string): Button[][] {
  return text.split("\n").map((str) =>
    str
      .split("|")
      .map((i) => i.trim().split(" "))
      .map((i) => {
        if (i.length < 2) throw new Error("Url not found");
        let text = i.slice(0, -1).join(" ");
        if (text.endsWith("-")) text = text.slice(0, -1).trim();
        return [text, i[i.length - 1]];
      })
      .map((i) => ({ text: i[0], url: i[1] }))
  );
}

function ButtonsPreview(buttons: Button[][]) {
  return buttons
    .map((row) => row.map((b) => link(b.url, b.text)))
    .map((row) => row.join(" "))
    .join("\n");
}
