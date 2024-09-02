import { getConfig } from "./config";

///データベースにデータを追加する
export const addPineconeData = (embedding: number[], key: string) => {
  const config = getConfig();
  const apiUrl = `https://${config.PINECONE_HOST_ID}/vectors/upsert`;
  const payload = {
    vectors: [
      {
        id: key,
        values: embedding,
        metadata: {
          description: "help-it",
        },
      },
    ],
  };
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    contentType: "application/json",
    headers: {
      "Api-Key": config.PINECONE_API_KEY,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };
  try {
    const response = UrlFetchApp.fetch(apiUrl, options);
    const responseData = JSON.parse(response.getContentText());
    return responseData;
  } catch (error) {
    throw new Error(`Failed to add data to Pinecone: ${error}`);
  }
};

//データベースを作成する
export const createPineconeIndex = (indexName: string) => {
  const config = getConfig();
  const apiUrl = "https://api.pinecone.io/indexes";

  const payload = {
    name: indexName,
    dimension: 1536,
    metric: "cosine",
    spec: {
      serverless: {
        cloud: "aws",
        region: "us-east-1",
      },
    },
  };

  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Api-Key": config.PINECONE_API_KEY,
      "X-Pinecone-API-Version": "2024-07",
    },
    payload: JSON.stringify(payload),
  };

  UrlFetchApp.fetch(apiUrl, options);
};

//データベースからデータとの類似度を取得する
export const searchPineconeData = (embedding: number[]) => {
  const config = getConfig();
  const apiUrl = `https://${config.PINECONE_HOST_ID}/query`;
  const payload = {
    vector: embedding,
    topK: 5,
  };
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    contentType: "application/json",
    headers: {
      "Api-Key": config.PINECONE_API_KEY,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };
  try {
    const response = UrlFetchApp.fetch(apiUrl, options);
    const responseData = JSON.parse(response.getContentText());
    return responseData.matches;
  } catch (error) {
    throw new Error(`Failed to search data from Pinecone: ${error}`);
  }
};
