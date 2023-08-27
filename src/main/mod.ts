import { CancelException, schedulePostDelete, setCommands } from "lib"
import { bot } from "loader"
import { postModel } from "models"
import { checkAccess, spyAfterRoma } from "./middlewares.ts"

bot.use(checkAccess)
bot.use(spyAfterRoma)
await bot.run()
bot.catch((err) => {
  if (err.error instanceof CancelException) return
  console.error(err)
})

import("observers") // TODO: rename
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
        text: "💟Hannahowo",
        url: "https://t.me/+GF_fP4vgNI83NWUy",
      },
      {
        text: "Sweetiefox🉐",
        url: "https://t.me/+GF_fP4vgNI83NWUy",
      },
    ],[
      {
        text: "💟Belledelpnine",
        url: "https://t.me/+GF_fP4vgNI83NWUy",
      },
      {
        text: "purple🉐",
        url: "https://t.me/+GF_fP4vgNI83NWUy",
      },
    ],
  ])
}

// await fixKeyboard("https://t.me/wallposter_r/1655");
console.log("started")
