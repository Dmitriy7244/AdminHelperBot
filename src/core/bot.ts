import { run } from "https://deno.land/x/grammy_runner@v2.0.3/mod.ts"
import { BaseSession, Bot as _Bot } from "my_grammy"

// TODO: to my_grammy
export class Bot<S extends BaseSession> extends _Bot<S> {
  async run() {
    await this.api.deleteWebhook()
    run(this, {
      runner: {
        fetch: {
          allowed_updates: ["channel_post", "message", "callback_query"],
        },
      },
    })
  }
}
