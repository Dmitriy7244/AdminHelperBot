import { observer as o } from "loader"

class Observers {
  start = o.command("start")
  channels = o.command("channels")
  addSale = o.command("add_sale")
  test = o.command("test")
  pickChannel = o.query("channel")
  pickAllChannels = o.query("➕ Выбрать все")
  ready = o.query("✅ Готово")
  saleChannelsReady = this.ready.state("sale:channels")
  salePostReady = this.ready.state("sale:post")
  asForward = o.query("asForward")
  noSound = o.query("noSound")
  schedulePost = o.query("Запланировать пост")
  saleDate = o.text().state("sale:date")
  saleTime = o.text().state("sale:time")
  salePostMessage = o.message().state("sale:post")
  text = o.text()
  channelPost = o.branch(o.composer.on("channel_post")) // TODO
}

const O = new Observers()
export default O
