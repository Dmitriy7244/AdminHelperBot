export const sleep = (secs: number) =>
  new Promise((x) => setTimeout(x, secs * 1000))

export const link = (url: string, text: string) =>
  `<a href="${url}">${text}</a>`

export const bold = (text: string) => `<b>${text}</b>`
