import { getConfig } from "./config";

export const addRecordToNotion = (title: string, content: string) => {
  const config = getConfig();
  const database_id = config.NOTION_DATABASE_ID;
  const url = "https://api.notion.com/v1/pages";

  const payload = {
    parent: { database_id: database_id },
    properties: {
      名前: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
      タグ: {
        multi_select: [
          {
            name: "help-it",
          },
        ],
      },
    },
    children: [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: content,
              },
            },
          ],
        },
      },
    ],
  };
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    headers: {
      Authorization: `Bearer ${config.NOTION_API_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true, // エラーレスポンスの詳細を取得
  };
  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText("UTF-8"));

  return data;
};

//notionのidからページIDを取得する
export const searchNotionById = (notionId: string) => {
  const config = getConfig();
  const url = `https://api.notion.com/v1/search`;
  const payload = {
    filter: {
      property: "object",
      value: "page",
    },
  };
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    headers: {
      Authorization: `Bearer ${config.NOTION_API_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true, // エラーレスポンスの詳細を取得
  };
  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText("UTF-8")).results;
  const notionData = data.find(
    (result: any) => `${result.properties.ID.unique_id.prefix}-${result.properties.ID.unique_id.number}` === notionId,
  );
  if (!notionData) {
    return false;
  } else {
    return notionData.id;
  }
};

// ページIDから書かれている内容を取得する
export const getNotionData = (pageId: string) => {
  const pageUrl = `https://api.notion.com/v1/blocks/${pageId}/children?page_size=50`;
  const blockData = notionAPIGet(pageUrl, "get");
  const pageData = blockData.results
    .map((result: any) => {
      const bloackUrl = `https://api.notion.com/v1/blocks/${result.id}`;
      const data = notionAPIGet(bloackUrl, "get");
      try {
        // console.log( data.paragraph.rich_text[0].text.content);

        Utilities.sleep(10);
        return data.paragraph.rich_text[0].text.content;
      } catch (e) {
        return false;
      }
    })
    .filter(Boolean)
    .join("\n");
  // console.log(pageData);
  return pageData;
};

const notionAPIGet = (url: string, method: string, payload?: any) => {
  const config = getConfig();
  let options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
  if (method === "get") {
    options = {
      method: "get",
      headers: {
        Authorization: `Bearer ${config.NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      muteHttpExceptions: true, // エラーレスポンスの詳細を取得
    };
    const response = UrlFetchApp.fetch(url, options);
    // console.log(response);
    const data = JSON.parse(response.getContentText("UTF-8"));
    return data;
  }
};
