import { BaseContext } from "my_grammy"
import { Msg, reply } from "my_grammy_lib"

export class Manager {
  constructor(public ctx: BaseContext) {}

  reply(msg: Msg) {
    reply(this.ctx, msg)
  }
}
