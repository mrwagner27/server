const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix, content) => {
        let channel = bot.channels.get("443931372508151820");
        let editor = await channel.fetchMessage("443935229548167174");
        let thing = new Discord.RichEmbed()
                .setTitle("News")
                .setDescription(editor.content)
                .setFooter(`Requested by ${message.author.tag}`);
        await message.channel.send({ embed: thing });
}
module.exports.help = {
        name: "news"
}
