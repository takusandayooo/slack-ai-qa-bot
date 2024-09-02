import { getConfig } from "./config";

export const chatGpt = (plonpt: string) => {
  var url = "https://api.openai.com/v1/chat/completions";
  const config = getConfig();
  var apiKey = config.OPEN_AI_KEY;
  var headers = {
    "Content-Type": "application/json; charset=UTF-8",
    Authorization: "Bearer " + apiKey,
  };

  var postData = {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: plonpt }],
  };

  var options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    headers: headers,
    payload: JSON.stringify(postData),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText("UTF-8"));

  return data.choices[0].message.content;
};
export const embeddingFromChatGpt = (text: string) => {
  const url = "https://api.openai.com/v1/embeddings";
  const config = getConfig();
  const apiKey = config.OPEN_AI_KEY;
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    Authorization: "Bearer " + apiKey,
  };
  const postData = {
    model: "text-embedding-3-small",
    input: text,
  };
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    headers: headers,
    payload: JSON.stringify(postData),
    muteHttpExceptions: true,
  };
  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText("UTF-8")).data[0].embedding;
  return data;
};
