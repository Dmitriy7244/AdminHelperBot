import { deleteChannel } from "db"
import { askNext, parseQuery } from "lib"
import M from "messages"
import { editText } from "my_grammy_lib"
import observers from "observers"

const o = observers.channels.deleteChannel

o._.handler = (ctx) => askNext(ctx, M.pickChannel(), "channels_delete")
o.pickChannel.handler = async (ctx) => {
  const title = parseQuery(ctx, "channel")
  await deleteChannel(title)
  await editText(ctx, M.pickChannel())
}
