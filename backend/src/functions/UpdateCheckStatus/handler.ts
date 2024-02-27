import type { APIGatewayEvent, APIGatewayProxyHandler } from "aws-lambda"

export const updateCheckStatus: APIGatewayProxyHandler = async ( event: APIGatewayEvent) => {

  return {
    statusCode: 200,
    body: JSON.stringify({
      hello: "logrado",
    })
  }
}