import M from "messages"
import { reply } from "my_grammy_lib"
import observers from "observers"

const o = observers.channels

o._.handler = (ctx) => reply(ctx, M.channels())

import("./addChannel.ts")
import("./deleteChannel.ts")
