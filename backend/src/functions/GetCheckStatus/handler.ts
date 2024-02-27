import type { APIGatewayEvent, APIGatewayProxyHandler } from "aws-lambda"
import { ApiGatewayHelper } from "check-status-layer"

export const getCheckStatus: APIGatewayProxyHandler = async ( event: APIGatewayEvent) => {
  return ApiGatewayHelper.formatJSONResponseOk({
    status: "ok"
  })
}