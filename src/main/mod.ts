import { schedulePostDelete, setCommands } from "lib"
import { bot } from "loader"
import { checkAccess } from "./middlewares.ts"
import { PostDoc } from "./models.ts"

bot.use(checkAccess)
import("../handlers/mod.ts")
await bot.api.deleteWebhook() // TODO
setCommands()
bot.run()

PostDoc.find().exec().then((posts) =>
  posts.forEach((p) => schedulePostDelete(p))
)
