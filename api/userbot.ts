import env from "env"

const USERBOT_URL = "https://tw2.my-bots.ru/userbot/"
const USERBOT_TOKEN = env.str("USERBOT_TOKEN")

interface Result {
  ok: boolean
  error: string | null
  result: Record<string, any>
}

type Method = "copyMessages" | "getPostMessages" | "reschedulePost"

async function post(method: Method, data: object) {
  const body = JSON.stringify(data)
  const r = await fetch(USERBOT_URL + method, {
    method: "POST",
    headers: { "token": USERBOT_TOKEN, "Content-Type": "application/json" },
    body,
  })
  const json = await r.json() as Result
  if (!json.ok) throw new Error(json.error!)
  console.log(json)
  return json.result
}

async function copyMessages(
  chat_id: number,
  from_chat_id: number,
  message_ids: number[],
  date: Date,
  as_forward = false,
  no_sound = false,
) {
  const result = await post("copyMessages", {
    chat_id,
    from_chat_id,
    message_ids,
    as_forward,
    no_sound,
    schedule_date: date.getTime() / 1000,
  })

  const messageIds = result.message_ids
  if (!messageIds) throw new Error("Bad result")
  return messageIds as number[]
}

async function getPostMessages(chat_id: number, message_id: number) {
  const data = { chat_id, message_id }
  return await post("getPostMessages", data) as number[]
}

export async function reschedulePost(
  chat_id: number,
  message_ids: number[],
  date: number,
) {
  const data = { chat_id, message_ids, date }
  await post("reschedulePost", data)
}

export { copyMessages, getPostMessages }

