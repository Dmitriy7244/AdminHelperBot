import { Prefix } from "buttons"
import { observer as o } from "loader"

const query = o.query<Prefix>

class Observers {
  start = o.command("start")
  channels = o.command("channels")
  addSale = o.command("add_sale")
  test = o.command("test")
  pickChannel = query("channel")
  pickAllChannels = query("➕ Выбрать все")
  ready = query("✅ Готово")
  saleChannelsReady = this.ready.state("sale:channels")
  salePostReady = this.ready.state("sale:post")
  asForward = query("asForward")
  noSound = query("noSound")
  schedulePost = query("Запланировать пост")
  saleDate = o.text().state("sale:date")
  saleTime = o.text().state("sale:time")
  message = o.message()
  text = o.text()
}

const O = new Observers()
export default O
