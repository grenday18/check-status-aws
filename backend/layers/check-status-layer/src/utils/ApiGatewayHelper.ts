import { errorCodes } from "../errors"
import Sentry from "./Sentry"

interface IError {
  code: string
  message: string
}

class ApiGatewayHelper {
  static response = function (body, statusCode) {
    return {
      statusCode: statusCode,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      }
    }
  }

  static formatJSONResponseOk = (body: object, httpCode = 200) => {
    return this.response(body, httpCode)
  }

  static formatJSONResponseError = (body: IError, httpCode = 400) => {
    return this.response(body, httpCode)
  }

  static handleError(error: any) {
    let httpCode: number = error?.httpStatusCode
    const errorCode: string = error?.code
    let message: string = error?.message

    if (!errorCodes.find(value => value === errorCode)) {
      httpCode = 500
      Sentry.captureException(error)
      message = "Unexpected error"
    }

    return this.response(
      {
        code: errorCode,
        message: message
      },
      httpCode
    )
  }
}

export default ApiGatewayHelper
