import { deleteChannel } from "db"
import { Handler } from "manager"
import M from "messages"
import observers from "observers"

const o = observers.channels.deleteChannel

o._.handler = Handler((mg) => mg.reply(M.pickChannel(), "channels_delete"))

o.pickChannel.handler = Handler(async (mg) => {
  const title = mg.parseQuery("channel")
  await deleteChannel(title)
  await mg.edit(M.pickChannel())
})
