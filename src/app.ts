import { GasSlackClient as SlackClient } from "@hi-se/gas-slack";
import { getConfig } from "./config";
import { getConversationList, getChannelNameFromSlackChannelId, getReplyMessage, postReplyMessage } from "./slackSDK";
import { subDays } from "date-fns";
import { chatGpt, embeddingFromChatGpt } from "./openaiSDK";
import { addPineconeData, searchPineconeData } from "./pinecone";
import { addRecordToNotion, searchNotionById,getNotionData } from "./notion";


export function main() {
  const config = getConfig();
  const slackClient = new SlackClient(config.SLACK_ACCESS_TOKEN);
  const oldest = convertUnixTime(subDays(new Date(), 1));
  const channel = getChannelNameFromSlackChannelId(slackClient, config.SLACK_CHANNEL_TO_POST);
  const conversationList = getConversationList(slackClient, oldest, channel);
  const messages = conversationList.messages;
  if (!messages) {
    throw new Error("Failed to get messages");
  }

  //NOTE: スタンプがないメッセージ,スタンプ1がついているメッセージ,スタンプ2がついているメッセージ
  const flagMessage = messages.map((message) => {
    if (message.reactions) {
      const reactions = message.reactions;
      const taiouStamp = reactions.find((reaction) => reaction.name === "eyes");
      const kanryouStamp = reactions.find((reaction) => reaction.name === "white_check_mark");
      const botDoneStamp = reactions.find((reaction) => reaction.name === "robot_face");
      if (botDoneStamp) {//NOTE: BOTがNotionに記録したスタンプ
        return { messageObject: message, flag: "botDoneStamp" };
      } else if (kanryouStamp) {//NOTE: ユーザがかんりょうとスタンプを押した場合
        return { messageObject: message, flag: "kanryouStamp" };
      } else if (taiouStamp) {//NOTE: BOTが押すスタンプ
        return { messageObject: message, flag: "taiouStamp" };
      } else {
        return { messageObject: message, flag: "noStamp" };
      }
    } else {
      return { messageObject: message, flag: "noStamp" };
    }
  });

  flagMessage.forEach((message) => {
    if (!message.messageObject.text || !message.messageObject.ts) {
      throw new Error("Failed to get message");
    }
    if (message.flag === "noStamp") {
      const postMessage = replyMessageByRAG(slackClient, message.messageObject.text, message.messageObject.ts);
      postReplyMessage(slackClient, channel, message.messageObject.ts, postMessage);

    } else if (message.flag === "kanryouStamp") {

      recordDatabaseByNotion(slackClient, channel, message.messageObject.ts);
    }
  });
}

//NOTE: RAGを用いて返信メッセージを生成する
const replyMessageByRAG = (slackClient: SlackClient, message: string, ts: string) => {

  //TODO: RAGを用いて返信メッセージを生成する
  const config = getConfig();
  const channel = getChannelNameFromSlackChannelId(slackClient, config.SLACK_CHANNEL_TO_POST);
  Utilities.sleep(10);
  const pineceQuery = searchPineconeData(embeddingFromChatGpt(message)) as { id: string, score: number, values: number[] }[];
  const limitQuery = pineceQuery.filter((query) => query.score > 0.5);
  const context = limitQuery.map((query) => {
    const notionPageId=searchNotionById(query.id);//TODO: NotionのIDがない場合にエラーを返す Result型で実装
    if (!notionPageId){
      return false;
    }
    const notionPageContent=getNotionData(notionPageId);    
    return notionPageContent;
  });
  let postMessage;
  if(context.length===0){
    console.log("RAGを使用しない");
    postMessage = chatGpt(message);
  }else{
    console.log(`RAGを使用:${pineceQuery.map((query) => query.id).join(',')}`);
    const plonpt= `次の文章を次の事前情報（context）に基づいて質問（question）に答えてください。簡潔に説明を行ってください。context:${context.join('\n')} question:${message}`;
    postMessage = chatGpt(plonpt);
  }
  slackClient.reactions.add({ channel, timestamp: ts, name: "eyes" });
  return postMessage;
}


//NOTE: Notionに討論内容を記録する
const recordDatabaseByNotion = (SlackClient: SlackClient, channel: string, ts: string) => {
  const replyMessage = getReplyMessage(SlackClient, channel, ts);
  const replies = replyMessage.messages;
  if (!replies || !replies[0].text) {
    throw new Error("Failed to get replies");
  }
  const content = replies.map((reply, index) => {
    return `${index + 1} 投稿者:${reply.user}\n内容:${reply.text}`;
  }).join('\n');
  const plonpt = `次の文章を参照してタイトルを一つ作成してください:${replies[0].text}`;
  const title = chatGpt(plonpt);
  const result=addRecordToNotion(title, content);
  addPineconeData(embeddingFromChatGpt(replies[0].text),`${result.properties.ID.unique_id.prefix}-${result.properties.ID.unique_id.number}`);
  SlackClient.reactions.remove({ channel, timestamp: ts, name: "eyes" });
  SlackClient.reactions.add({ channel, timestamp: ts, name: "robot_face" });
}


const convertUnixTime = (date: Date): string => {
  return Math.floor(date.getTime() / 1000).toString();
}
