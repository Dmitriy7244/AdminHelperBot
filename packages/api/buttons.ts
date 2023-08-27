import { Button } from "models"
import { link } from "deps"

export function parseButtons(text: string): Button[][] {
  return text.split("\n").map((str) =>
    str
      .split("|")
      .map((i) => i.trim().split(" "))
      .map((i) => {
        if (i.length < 2) throw new Error("Url not found")
        let text = i.slice(0, -1).join(" ")
        if (text.endsWith("-")) text = text.slice(0, -1).trim()
        return [text, i[i.length - 1]]
      })
      .map((i) => ({ text: i[0], url: i[1] }))
  )
}

export function ButtonsPreview(buttons: Button[][]) {
  return buttons
    .map((row) => row.map((b) => link(b.url, b.text)))
    .map((row) => row.join(" "))
    .join("\n")
}
