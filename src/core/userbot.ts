import env from "env"

const USERBOT_URL = "https://my-bots.ru/userbot/copyMessages"
const USERBOT_TOKEN = env.str("USERBOT_TOKEN")

interface Result {
  ok: boolean
  error: string | null
}

async function copyMessages(
  chat_id: number,
  from_chat_id: number,
  message_ids: number[],
  date: Date,
  as_forward: boolean,
  no_sound: boolean,
) {
  console.log(message_ids)
  const body = JSON.stringify({
    chat_id: chat_id,
    from_chat_id,
    message_ids,
    as_forward,
    no_sound,
    schedule_date: date.getTime() / 1000,
  })
  const r = await fetch(USERBOT_URL, {
    method: "POST",
    headers: { "token": USERBOT_TOKEN, "Content-Type": "application/json" },
    body,
  })
  const result = await r.json() as Result
  console.log(result)
  if (!result.ok) throw new Error(result.error!)
}

export { copyMessages }
