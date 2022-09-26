import * as dotenv from "dotenv";
dotenv.config();

import { Client } from "revolt.js";
import { commands } from "./commands";
import { cat } from "./lib/owo";

const prefix = process.env.PREFIX || "!!!"; // amazing prefix!

let client = new Client();

client.on("ready", async () =>
  console.info(`Logged in as ${client.user?.username}!`)
);

client.on("message", async msg => {
  if (!msg.content) return;
  if (
    msg.author_id === client.user?._id &&
    (await cat(msg.content)) !== msg.content
  ) {
    msg.edit({ content: await cat(msg.content) });
  } else if (!msg.content.startsWith(prefix) || msg.content.length >= 2000)
    return;

  let splitted = msg.content.substring(5).split(" ");
  let command = commands.get(splitted.shift() ?? "") ?? ((_: string) => null);
  let args = splitted.join(" ");
  let res: string | null = await command(args);

  if (res && res.length <= 2000) {
    if (msg.author_id === client.user?._id) msg.delete();
    msg.channel?.sendMessage(res);
  }
});

client.useExistingSession({
  token: process.env.TOKEN ?? "sus"
});
