const Discord = require("discord.js");
function clean(text) {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

let rejectionembed = new Discord.RichEmbed()
    .setColor("RED")
    .setDescription("You do not have permissions to use this command!");

module.exports.run = async (bot, message, args, content) => {
    if (message.author.id != "399975738008141824") return message.channel.send({embed: rejectionembed});
    try {
        const code = args.join(" ");
        let evaled = eval(code);
        if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
        message.channel.send(clean(evaled), {
            code: "xl"
        });
    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
}
module.exports.help = {
    name: "eval"
}
