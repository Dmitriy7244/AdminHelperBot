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

export async function fixKeyboard() {
  await bot.setKeyboard("-1001988740515", 1154, [[{
    text: "😈😈😈😈😈😈",
    url: "https://t.me/+OCTap12TOtUwOThi",
  }]])
}

// await fixKeyboard()
console.log("started")
