function reformatTime(time: string) {
  const re = /(\w{2})(\w{2})/
  return time.replace(re, "$1 $2")
}

const a = "0923"
const r = reformatTime(a)
console.log(r)
