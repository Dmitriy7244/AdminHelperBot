import { log } from "deps"
import { headers, Method, Result, USERBOT_URL } from "./base.ts"

export async function post(method: Method, data: object) {
  log("Userbot request", { method, data })
  const body = JSON.stringify(data)
  const r = await fetch(USERBOT_URL + method, {
    method: "POST",
    headers,
    body,
  })
  const json = await r.json() as Result
  if (!json.ok) throw new Error(json.error!)
  log("Userbot response", json.result)
  return json.result
}
