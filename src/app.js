require("dotenv").config();
const Discord = require("discord.js");
const Logger = require("./logger");
const api = require("./lib");

const client = new Discord.Client();
const logger = new Logger();

api.check("Although there master doesn't have any");

client.once("ready", () => {
  logger.info("Ready");
});

client.on("message", async message => {
  // Don't answer DMs
  if (message.channel.type === "dm") {
    return;
  }

  const guild = message.guild.name;
  const user = `${message.author.username}#${message.author.discriminator}`;
  const content = message.content;

  // Determine if message should be checked
  if (!messageHasTrigger(content)) {
    return;
  }

  logger.info(`${guild} >> ${user} >> ${content}`);

  const responseEmbed = await api.check(content);
  if (responseEmbed != null) {
    message.channel.send(`Seems like you made some mistakes <@${message.author.id}>`, {
      embed: responseEmbed
    });
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

function messageHasTrigger(message) {
  const triggerWords = process.env.TRIGGER_WORDS.split(",");

  // If no trigger words are specified, consider the message to trigger
  if (triggerWords.length == 0) {
    return true;
  }

  for (var i = 0; i < triggerWords.length; i++) {
    if (message.toLowerCase().indexOf(triggerWords[i]) > -1) {
      return true;
    }
  }
  return false;
}
