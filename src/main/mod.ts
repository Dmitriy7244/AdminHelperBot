import { schedulePostDelete, setCommands } from "lib"
import { bot } from "loader"
import { PostDoc } from "models"
import { checkAccess } from "./middlewares.ts"

bot.use(checkAccess)
bot.catch(console.error)
bot.run()

import("../handlers/mod.ts")
setCommands()
// bot.run() // TODO

PostDoc.find()
  .exec()
  .then((posts) => posts.forEach((p) => schedulePostDelete(p)))

export async function fixKeyboard() {
  await bot.api.editMessageReplyMarkup(-1001988740515, 1125, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "⤷ П Е Р Е Й Т И", url: "https://t.me/+Ni7jbO3txRI5MmYy" }],
      ],
    },
  })
}

// await fixKeyboard();
console.log("started")
