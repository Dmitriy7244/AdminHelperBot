import { run } from "https://deno.land/x/grammy_runner@v2.0.3/runner.ts"
import { schedulePostDelete, setCommands } from "lib"
import { bot } from "loader"
import { PostDoc } from "models"
import { checkAccess } from "./middlewares.ts"

run(bot, {
  runner: {
    fetch: { allowed_updates: ["channel_post", "message", "callback_query"] },
  },
})

bot.use(checkAccess)
import("../handlers/mod.ts")
setCommands()
// bot.run()

PostDoc.find().exec().then((posts) =>
  posts.forEach((p) => schedulePostDelete(p))
)
