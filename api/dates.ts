export function resolveDate(value: string): Date {
  const result = Number(value)
  if (!Number.isInteger(result)) throw new Error("Bad value")
  const baseDate = new Date()
  if (result < baseDate.getDate()) nextMonth(baseDate)
  return new Date(baseDate.getFullYear(), baseDate.getMonth(), result)
}

function nextMonth(date: Date) {
  date.setMonth(date.getMonth() + 1)
}

export function resolveDatetime(time: string, base_date: Date) {
  let [hour, minute] = time.split(" ").map(Number)
  minute = minute || 0
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) {
    throw new Error("Bad time")
  }
  base_date.setHours(hour, minute)
}
