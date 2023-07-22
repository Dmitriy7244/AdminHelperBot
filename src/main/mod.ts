import { run } from "https://deno.land/x/grammy_runner@v2.0.3/runner.ts";
import { schedulePostDelete, setCommands } from "lib";
import { bot } from "loader";
import { PostDoc } from "models";
import { checkAccess } from "./middlewares.ts";

run(bot, {
  runner: {
    fetch: { allowed_updates: ["channel_post", "message", "callback_query"] },
  },
});

bot.use(checkAccess);
import("../handlers/mod.ts");
setCommands();
// bot.run()

PostDoc.find()
  .exec()
  .then((posts) => posts.forEach((p) => schedulePostDelete(p)));

async function fixKeyboard() {
  await bot.api.editMessageReplyMarkup("@diunder", 19610, {
    reply_markup: {
      inline_keyboard: [
        // [{ text: "Подписаться!", url: "https://t.me/+u1nhZj1hvsZiN2Y9" }],
      ],
    },
  });
}
