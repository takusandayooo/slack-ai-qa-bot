import { GasSlackClient as SlackClient } from "@hi-se/gas-slack";

//NOTE: slack APIを用いる際には、スコープを設定する必要がある
export const postMessageToSlackChannel = (client: SlackClient, slackChannelId: string, messageToNotify: string) => {
  client.chat.postMessage({
    channel: slackChannelId,
    text: messageToNotify,
  });
};

export const getMessagesFromSlackChannel = (client: SlackClient, slackChannelId: string) => {
  return client.conversations.history({
    channel: slackChannelId,
  });
};
export const getUsersList = (client: SlackClient) => {
  const userList = client.users.list({}).members;
  if (!userList) {
    throw new Error("Failed to get user list");
  }
  const users = userList.map((user) => {
    return { id: user.id, name: user.name };
  });
  return users;
};

export const getChannelNameFromSlackChannelId = (client: SlackClient, channelName: string): string => {
  const channelList = client.conversations.list();
  if (!channelList.ok || !channelList.channels) {
    throw new Error(`Failed to get channel list: ${channelList.error}`);
  }
  const slackId = channelList.channels.find((c) => c.name === channelName);
  if (!slackId || !slackId.id) {
    throw new Error(`Channel not found: ${channelName}`);
  }
  return slackId.id;
};

export const getConversationList = (client: SlackClient, oldest: string, channel: string) => {
  return client.conversations.history({ channel, oldest });
};

export const getReplyMessage = (client: SlackClient, channel: string, ts: string) => {
  return client.conversations.replies({ channel, ts });
};
export const postReplyMessage = (client: SlackClient, channel: string, ts: string, text: string) => {
  return client.chat.postMessage({ channel, thread_ts: ts, text });
};
