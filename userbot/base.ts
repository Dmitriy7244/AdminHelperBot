import { env } from "deps"

const USERBOT_URL = env.str("USERBOT_URL")
const USERBOT_TOKEN = env.str("USERBOT_TOKEN")

interface Result {
  ok: boolean
  error: string | null
  result: Record<string, any>
}

const headers = {
  "token": USERBOT_TOKEN,
  "Content-Type": "application/json",
}

type Method = "copyMessages" | "getPostMessages" | "reschedulePost"

export { headers, USERBOT_TOKEN, USERBOT_URL }
export type { Method, Result }
