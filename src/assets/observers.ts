import { observer as o } from "loader"

const start = o.command("start")
const ready = o.query("✅ Готово")
const content = o.command("content")
const addSale = o.command("add_sale")
const checkRights = o.command("check_rights")
const channels = o.command("channels")
const test = o.command("test")
const asForward = o.query("asForward")
const noSound = o.query("noSound")
const deleteTimer = o.query("Таймер удаления")
const schedulePost = o.query("Запланировать пост")
const addButtons = o.query("Добавить кнопки")

// TODO: add states
const observers = {
  start,
  test,
  channels: {
    _: channels,
    addChannel: {
      _: o.query("Добавить канал"),
      channelPost: o.message().state("channels_post"),
      link: o.text().state("channels_link"),
      title: o.text().state("channels_title"),
    },
    deleteChannel: {
      _: o.query("Удалить канал"),
      pickChannel: o.query("channel").state("channels_delete"),
    },
  },
  checkRights,
  addSale: {
    _: addSale,
    pickChannels: {
      pick: o.query("channel").state("sale:channels"),
      pickAll: o.query("➕ Выбрать все").state("sale:channels"),
      ready: ready.state("sale:channels"),
    },
    date: o.text().state("sale:date"),
    dateToday: o.query("Сегодня").state("sale:date"),
    dateTomorrow: o.query("Завтра").state("sale:date"),
    time: o.text().state("sale:time"),
    schedulePost: {
      _: schedulePost,
      asForward,
      noSound,
      deleteTimer,
      postMessage: o.message().state("sale:post"),
      ready: ready.state("sale:post"),
    },
    addButtons: {
      _: addButtons,
      buttonsToAdd: o.text().state("sale:buttons"),
    },
  },
  content: {
    _: content,
    pickChannel: o.query("channel").state("content:channel"),
    postMessage: o.message().state("content:posts"),
    ready: o.query("✅ Готово").state("content:posts"),
  },
  channelPost: o.channelPost(),
  text: o.text(),
}

export default observers
