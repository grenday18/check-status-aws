import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import request from "axios"
import { IDataStatus } from "../interfaces";
import moment from "moment";

const checkStatus = async (url: string) => {
  const headers = {
    "Content-Type": "application/json",
  }

  const response : IDataStatus = {
    url: url,
    hour: moment().hours(),
    minute: moment().minutes(),
    status: false
  }

  try {
    const res = await request.get(url, {
      headers
    })
    response.status = res.data ? true : false
  } catch (err) {
    response.status = false
  }
  
  return response
}

const getStatusData = async () => {
  
  const client = new S3Client({ region: process.env.region, logger: undefined })
  const input = {
    Bucket: process.env.bucketName,
    Key: moment().format("YYYY-MM-DD") + ".json",
  }

  try {
    const command = new GetObjectCommand(input)
    const response = await client.send(command)
    const data = await response.Body?.transformToString()
    return JSON.parse(data);
  } catch(err) {
    console.log("error", err)
    return []
  }
}

const getUrlsToCheck = async () => {
  
  const client = new S3Client({ region: process.env.region, logger: undefined })
  const input = {
    Bucket: process.env.bucketName,
    Key: "urlsToCheck.json",
  }

  try {
    const command = new GetObjectCommand(input)
    const response = await client.send(command)
    const data = await response.Body?.transformToString()
    return JSON.parse(data);
  } catch(err) {
    console.log("error", err)
    return []
  }
}

const updateDataStatus = async (data: IDataStatus[]) => {

  try {
    const client = new S3Client({ region: process.env.region, logger: undefined })
    const input = {
      Bucket: process.env.bucketName,
      Key: moment().format("YYYY-MM-DD") + ".json",
      Body: JSON.stringify(data)
    }
    const command = new PutObjectCommand(input);
    await client.send(command);
  } catch(err) {
    console.log("error", err)
  }
}

export { checkStatus, getStatusData, getUrlsToCheck, updateDataStatus }
