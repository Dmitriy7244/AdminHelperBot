import { post } from "./request.ts"

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

async function reschedulePost(
  chat_id: number,
  message_ids: number[],
  date: number,
) {
  const data = { chat_id, message_ids, date }
  await post("reschedulePost", data)
}

export { copyMessages, getPostMessages, reschedulePost }
