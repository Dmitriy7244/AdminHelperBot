import { addSaleComposer } from "composers/addSale/mod.ts"
import { channelPostComposer } from "composers/channelPost.ts"
import { channelsComposer } from "composers/channels/mod.ts"
import { checkRightsComposer } from "composers/checkRights.ts"
import { contentComposer } from "composers/content.ts"
import { startObserver } from "composers/start.ts"
import { textComposer } from "composers/text.ts"
import { createComposer } from "new/lib.ts"

const cmp = createComposer()

cmp.use(startObserver.composer)
cmp.use(addSaleComposer)
cmp.use(channelsComposer)
cmp.use(checkRightsComposer)
cmp.use(contentComposer)
cmp.use(textComposer)
cmp.use(channelPostComposer)

export { cmp as composer }
