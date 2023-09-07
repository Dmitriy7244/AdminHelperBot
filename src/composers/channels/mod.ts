import { createComposer, onCommand } from "new/lib.ts"
import { addChannelComposer } from "./addChanel.ts"
import { deleteChannelComposer } from "./deleteChannel.ts"
import { sendChannelsMenu } from "./lib.ts"

const cmp = createComposer()
onCommand(cmp, "channels").use((ctx) => sendChannelsMenu(ctx.chat.id))
cmp.use(addChannelComposer)
cmp.use(deleteChannelComposer)

export { cmp as channelsComposer }
