const axios = require("axios").default;
const Logger = require("./logger");

const logger = new Logger();

async function check(message) {
  const params = new URLSearchParams();
  params.append("api_key", process.env.GRAMMARBOT_API_KEY);
  params.append("language", "en-US");
  params.append("text", message);
  try {
    const res = await axios({
      method: "POST",
      url: "https://api.grammarbot.io/v2/check",
      data: params,
      "Content-Type": "application/x-www-form-urlencoded"
    });

    return formatForDiscord(res);
  } catch (e) {
    logger.error(e.message);
  }
}

function formatForDiscord(res) {
  const result = filterResponse(res);

  // There were no mistakes
  if (result.length == 0) {
    return null;
  }

  const fields = result.map(r => {
    const before = r.context.text.slice(0, r.context.offset);
    const offender = r.context.text.slice(r.context.offset, r.context.offset + r.context.length);
    const after = r.context.text.slice(r.context.offset + r.context.length);

    const value = `${before}_**${offender}**_${after}`;

    return { name: r.message, value };
  });

  return { fields, footer: { text: "Grammar check from grammarbot.io" } };
}

function filterResponse(res) {
  const ignoredRules = process.env.IGNORED_RULES.split(",");

  const result = res.data.matches
    .filter(match => !ignoredRules.includes(match.rule.id))
    .map(match => ({
      message: match.message,
      replacements: match.message.replacements,
      context: match.context,
      rule: {
        id: match.rule.id,
        description: match.rule.description,
        category: match.rule.category.name
      }
    }));

  return result;
}

module.exports = { check };
