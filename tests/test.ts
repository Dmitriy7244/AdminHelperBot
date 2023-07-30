import * as sentry from "npm:@sentry/node"

sentry.init({
  dsn:
    "https://f4cbd92171ed07444554c7b855a3649a@o4505617237213184.ingest.sentry.io/4505617248550912",
})

try {
  throw new Error("123")
} catch (e) {
  sentry.captureException(e)
}
