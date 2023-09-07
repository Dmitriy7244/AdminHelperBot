import { MsgHandler, MsgManager } from "manager"
import { createComposer, onChannelPost } from "new/lib.ts"
import methods from "../../bot/methods/mod.ts"

const cmp = createComposer()

async function handleChannelPost(mg: MsgManager) {
  await methods.handleChannelPost(
    mg.chatId,
    mg.messageId,
    mg.text,
    mg.getMediaGroupId(),
  )
}

onChannelPost(cmp).use(MsgHandler(handleChannelPost))

export { cmp as channelPostComposer }
