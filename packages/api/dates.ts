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

export function nextYear(date: Date) {
  date.setFullYear(date.getFullYear() + 1)
  return date
}

export function resolveDatetime(time: string, base_date: Date) {
  let [hour, minute] = reformatTime(time).split(" ").map(Number)
  minute = minute || 0
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) {
    throw new Error("Bad time")
  }
  base_date.setHours(hour, minute)
}

function reformatTime(time: string) {
  const re = /(\w{2})(\w{2})/
  const result = time.replace(re, "$1 $2").replace(":", " ")
  console.log(result)
  return result
}
