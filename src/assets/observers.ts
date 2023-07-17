import { observer as o } from "loader"

class Observers {
  start = o.command("start")
  channels = o.command("channels")
  addSale = o.command("add_sale")
  test = o.command("test")
  checkRights = o.command("check_rights")
  pickChannel = o.query("channel")
  pickAllChannels = o.query("➕ Выбрать все")
  ready = o.query("✅ Готово")
  saleChannelsReady = this.ready.state("sale:channels")
  salePostReady = this.ready.state("sale:post")
  asForward = o.query("asForward")
  noSound = o.query("noSound")
  schedulePost = o.query("Запланировать пост")
  addButtons = o.query("Добавить кнопки")
  buttonsToAdd = o.text().state("sale:buttons")
  saleDate = o.text().state("sale:date")
  saleTime = o.text().state("sale:time")
  channelPost = o.channelPost()
  salePostMessage = o.message().state("sale:post")
  text = o.text()
}

const O = new Observers()
export default O
