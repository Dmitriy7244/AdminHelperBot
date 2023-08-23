import { schedulePostDelete, setCommands } from "lib"
import { bot } from "loader"
import { postModel } from "models"
import { checkAccess, spyAfterRoma } from "./middlewares.ts"

bot.use(checkAccess)
bot.use(spyAfterRoma)
bot.catch(console.error)
bot.run()

import("../handlers/mod.ts")
setCommands()

postModel.find()
  .exec()
  .then((posts) => posts.forEach((p) => schedulePostDelete(p)))

export async function fixKeyboard(postUrl: string) {
  postUrl = postUrl.replace("https://t.me/", "")
  if (postUrl.startsWith("c/")) postUrl = postUrl.replace("c/", "-100")
  else postUrl = "@" + postUrl
  const [chatId, msgIdRaw] = postUrl.split("/")
  const msgId = Number(msgIdRaw)
  console.log(chatId, msgId)
  await bot.setKeyboard(chatId, msgId, [
    [
      {
        text: "ТУТ",
        url: "https://t.me/+lHsEag3M4fU0Y2Qy",
      },
      {
        text: "ТУТ",
        url: "https://t.me/+lHsEag3M4fU0Y2Qy",
      },
      {
        text: "ТУТ",
        url: "https://t.me/+lHsEag3M4fU0Y2Qy",
      },
    ],
  ])
}

// await fixKeyboard("https://t.me/c/1988740515/1287");
console.log("started")
