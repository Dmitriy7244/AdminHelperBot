import { MyContext } from "types"
import { MsgManager } from "./MsgManager.ts"
import { QueryManager } from "./QueryManager.ts"
import { Manager } from "./manager.ts"

export function Handler(callback: (manager: Manager) => any) {
  return async (ctx: MyContext) => {
    const manager = new Manager(ctx)
    await callback(manager)
  }
}

export function MsgHandler(callback: (manager: MsgManager) => any) {
  return async (ctx: MyContext) => {
    const manager = new MsgManager(ctx)
    await callback(manager)
  }
}

export function QueryHandler(callback: (manager: QueryManager) => any) {
  return async (ctx: MyContext) => {
    const manager = new QueryManager(ctx)
    await callback(manager)
  }
}

export { Manager, MsgManager, QueryManager }
