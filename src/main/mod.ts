import { scheduleContentPost, schedulePostDelete, setCommands } from "lib"
import { bot } from "loader"
import { ContentPostDoc, PostDoc } from "models"
import { checkAccess } from "./middlewares.ts"

bot.use(checkAccess)
bot.catch(console.error)
bot.run()

import("../handlers/mod.ts")
setCommands()

PostDoc.find()
  .exec()
  .then((posts) => posts.forEach((p) => schedulePostDelete(p)))

ContentPostDoc.find()
  .exec()
  .then((posts) => posts.forEach((p) => scheduleContentPost(p)))

export async function fixKeyboard() {
  await bot.setKeyboard(-10019880515, 1125, [[{
    text: "⤷ П Е Р Е Й Т И",
    url: "https://t.me/+Ni7jbO3txRI5MmYy",
  }]])
}

// await fixKeyboard();
console.log("started")
