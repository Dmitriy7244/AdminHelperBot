import { bot } from "loader"
import { checkAccess } from "./middlewares.ts"

bot.use(checkAccess)
import("./handlers/mod.ts")
bot.run()
