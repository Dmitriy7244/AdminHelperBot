import env from "env"

const USERBOT_URL = "https://my-bots.ru/userbot/"
const USERBOT_TOKEN = env.str("USERBOT_TOKEN")

interface Result {
  ok: boolean
  error: string | null
  result: object | null
}

type Method = "copyMessages" | "getPostMessages"

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
  as_forward: boolean,
  no_sound: boolean,
) {
  await post("copyMessages", {
    chat_id,
    from_chat_id,
    message_ids,
    as_forward,
    no_sound,
    schedule_date: date.getTime() / 1000,
  })
}

async function getPostMessages(chat_id: number, message_id: number) {
  const data = { chat_id, message_id }
  return await post("getPostMessages", data) as number[]
}

export { copyMessages, getPostMessages }
