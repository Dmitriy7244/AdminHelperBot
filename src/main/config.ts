import env from "env"

const _channelsData = [
  [-1001300460444, "Акиет", "https://t.me/akiet"],
  [-1001583208278, "Геншин", "https://t.me/+kFIe8-bR2DQ1YWFi"],
  [-1001738529532, "Баблкам", "https://t.me/+IhzX5VBVjk00ODIy"],
  [-1001446620325, "Диундер", "https://t.me/diunder"],
  [-1001515205062, "Коды АМ", "https://t.me/alight_motion_capcut"],
  [-1001592432164, "Крутые авы", "https://t.me/anime4_avatarki"],
  [-1001271558289, "Мультач", "https://t.me/multtach"],
  [-1001563981037, "Пикзери", "https://t.me/pikzery"],
  [-1001988740515, "Пошлые опросы", "https://t.me/+CftFBjqS5pc2ZTk6"],
  [-1001554954940, "Кошачья лежанка", "https://t.me/+fFddn0cMxa5hZGI6"],
  [-1001573250306, "Стикеры", "https://t.me/anime4_arts"],
  [-1001894750175, "Счастье-это", "https://t.me/segofniii"],
  [-1001191474106, "Тянки", "https://t.me/anime4_tyan"],
  [-1001824345138, "Тянки.cum", "https://t.me/+HkoulHd8ws0zMWIy"],
  [-1001582829502, "Zxc", "https://t.me/pikchidlygylei000"],
  [-1001217147231, "Фонк", "https://t.me/+Bc3EFuWbUhpjMTEy"],
  [-1001671652919, "Обои", "https://t.me/wallposter_r"],
  [-1001942180236, "ЯОЙ", "https://t.me/+XnJ8RZIXcfAyYjVi"],
  [-1001585027208, "Тест", "https://t.me/test7244c"],
] as const

interface Channel {
  id: number
  title: string
  url: string
}

const CHANNELS: Channel[] = _channelsData.map((c) => ({
  id: c[0],
  title: c[1],
  url: c[2],
}))

const REPORT_CHAT_ID = env.int("REPORT_CHAT_ID")

export { CHANNELS, REPORT_CHAT_ID }
