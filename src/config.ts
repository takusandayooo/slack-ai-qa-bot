import { z } from "zod";

const ConfigSchema = z.object({
  SLACK_ACCESS_TOKEN: z.string(),
  SLACK_CHANNEL_TO_POST: z.string(),
  NOTION_API_KEY: z.string(),
  NOTION_DATABASE_ID: z.string(),
  OPEN_AI_KEY: z.string(),
  PINECONE_API_KEY: z.string(),
  PINECONE_HOST_ID: z.string(),
});

export type Config = z.infer<typeof ConfigSchema>;

let config: Config;

export const getConfig = () => {
  if (!config) {
    const props = PropertiesService.getScriptProperties().getProperties();
    config = ConfigSchema.parse(props);
  }
  return config;
};