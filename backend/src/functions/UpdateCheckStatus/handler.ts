import type { APIGatewayEvent, APIGatewayProxyHandler } from "aws-lambda"
import { ApiGatewayHelper, checkStatus, getStatusData, getUrlsToCheck, updateDataStatus } from "check-status-layer"

export const updateCheckStatus: APIGatewayProxyHandler = async ( event: APIGatewayEvent) => {
  
  const data =  await getStatusData()
  const urls = await getUrlsToCheck()

  const dataPromises: Array<Promise<any>> = []

  for (let i = 0; i < urls.length; i++) {
    dataPromises.push(
      checkStatus(urls[i])
    )    
  }

  const results = await Promise.all(dataPromises)
  const newData = data.concat(results)
  await updateDataStatus(newData)

  return ApiGatewayHelper.formatJSONResponseOk({
    message: "Este es el status de hoy",
    data: newData
  })
}