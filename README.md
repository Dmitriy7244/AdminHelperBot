TODO:

- reset state on start?

```py
seller = models.Seller(user_id=msg.from_user.id, name=msg.from_user.full_name).save()
channels = models.Channel.objects(title__in=storage['channels'])
posts = [models.Post(publish_date=datetime).save()]
sale = models.Sale(seller=seller, posts=posts, channels=channels).save()
```
