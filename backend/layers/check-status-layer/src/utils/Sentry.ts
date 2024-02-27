import * as Sentry from "@sentry/serverless"

class SentryA {
  constructor() {
    Sentry.AWSLambda.init({
      dsn: "https://45c69aaa4cb7456e8d2ee2d9a0a56f81@o570744.ingest.sentry.io/6260231",
      environment: process.env.stage,

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 0.2
    })
  }

  setUser(idOrganization: string, email: string, userId: string) {
    Sentry.setUser({
      idOrganization,
      email,
      userId: userId
    })
  }

  clearUser() {
    Sentry.setUser(null)
  }

  wrapHandler(handler: any) {
    if(process.env.IS_OFFLINE)
      return handler
    return Sentry.AWSLambda.wrapHandler(handler, {
      ignoreSentryErrors: true,
      captureTimeoutWarning: false
    })
  }

  captureException(error: any) {
    if(process.env.IS_OFFLINE)
      return
    Sentry.captureException(error)
  }
}

export default new SentryA()
