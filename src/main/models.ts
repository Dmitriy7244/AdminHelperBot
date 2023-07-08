import * as config from "./config.ts"

export class Channel {
  constructor(
    public id: number,
    public title: string,
    public url: string,
  ) {}

  static fromTitle(title: string) {
    for (const c of config.channels) {
      if (c.title != title) continue
      return new Channel(c.id, title, c.url)
    }
    throw new Error("Unknown title")
  }
}

export class Seller {
  constructor(
    public user_id: number,
    public name: string,
  ) {}
}

export class Post {
  constructor(public publish_date: Date) {}
}

export class Sale {
  constructor(
    public seller: Seller,
    public channels: Channel[],
    public posts: Post[],
  ) {}
}
