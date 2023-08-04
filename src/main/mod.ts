import { schedulePostDelete, setCommands } from "lib"
import { bot } from "loader"
import { PostDoc } from "models"
import { checkAccess } from "./middlewares.ts"

bot.use(checkAccess)
bot.catch(console.error)
bot.run()

import("../handlers/mod.ts")
setCommands()

PostDoc.find()
  .exec()
  .then((posts) => posts.forEach((p) => schedulePostDelete(p)))

export async function fixKeyboard(postUrl: string) {
  postUrl = postUrl.replace("https://t.me/", "")
  if (postUrl.startsWith("c/")) postUrl = postUrl.replace("c/", "-100")
  else postUrl = "@" + postUrl
  const [chatId, msgIdRaw] = postUrl.split("/")
  const msgId = Number(msgIdRaw)
  console.log(chatId, msgId)
  await bot.setKeyboard(chatId, msgId, [[{
    text: "Избавиться от проблем за пару дней 👈",
    url: "https://t.me/+bVoyq_fTo4JhMmZi",
  }]])
}

// await fixKeyboard("https://t.me/c/1988740515/1230")
console.log("started")
