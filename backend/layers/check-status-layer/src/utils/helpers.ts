import request, { AxiosError } from "axios"
import AuthContext from "./AuthContext"
import Sentry from "./Sentry"
import { APIGatewayEvent } from "aws-lambda"
import * as parseMultipart from "parse-multipart"

const logsRequestErrors = (key: string, error: AxiosError, authContext: AuthContext) => {
  if(error.isAxiosError) return
  console.log(key, {
    organization: authContext.organization,
    user: {
      email: authContext.user.email,
      id: authContext.user.id,
      legacyId: authContext.user.legacyId,
    },
    error
  })
}

const parseMultipartBody = (event: APIGatewayEvent) => {
  const boundary = parseMultipart.getBoundary(event.headers["content-type"])
  const parts = parseMultipart.Parse(Buffer.from(event.body, "base64"), boundary)
  const [{ filename, data }] = parts
  return {
    filename,
    data
  }
}

const canBeDeleted = async (id: string, authContext: AuthContext) => {
  const baseUrl = process.env.BASE_API_URL
  const url = `v1/item-categories/options/${id}`

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${authContext.user.legacyBasicToken}`,
    "Access-Key": process.env.ACCESSKEY,
    "Origin": process.env.HEADER_ORIGIN,
    "X-Data-Source": "micro-items-categories"
  }
  try {
    const response = await request.get(baseUrl + url, {
      headers
    })
    return response.data.deletable
  } catch (err) {
    Sentry.captureException(err)
    return false
  }
}

const getLanguageVersion = async (authContext: AuthContext) => {
  const baseUrl = process.env.BASE_API_URL
  const url = "v1/users/self"

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${authContext.user.legacyBasicToken}`,
    "X-Data-Source": "micro-items-categories"
  }
  return "es"
  try {
    const response = await request.get(baseUrl + url, {
      headers
    })
    return response.data.language
  } catch (err) {
    Sentry.captureException(err)
    return "es"
  }
}

export { canBeDeleted, getLanguageVersion, parseMultipartBody, logsRequestErrors }
