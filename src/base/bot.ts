import { BaseSession, Bot as _Bot } from "deps"

class Bot<S extends BaseSession> extends _Bot<S> {}

export { Bot }
