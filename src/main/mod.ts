import { composer } from "composers/mod.ts"
import { findPosts } from "db"
import { CancelException, schedulePostDelete, setCommands } from "lib"
import { bot } from "loader"
import { checkAccess, spyAfterRoma } from "./middlewares.ts"

bot.use(checkAccess)
bot.use(spyAfterRoma)
bot.use(composer)
bot.run()
bot.catch((err) => {
  if (err.error instanceof CancelException) return
  console.error(err)
})

setCommands()

findPosts().then((posts) => posts.forEach((p) => schedulePostDelete(p)))

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
    ],
  ])
}

// await fixKeyboard("https://t.me/wallposter_r/1655");
console.log("started")
