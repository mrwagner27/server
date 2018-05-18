const Discord = require("discord.js");
module.exports.run = async (bot, message, args) => {
        let guild = bot.guilds.get("410400562232819723")
        let member = await guild.fetchMember(message.author.id)
        if (!member) return;
        if (member.roles.get("410481036162760722")) { //owner 
                let tbh = args.join(" ");
                bot.user.setActivity(`${tbh}`, {
                        type: bot.user.presence.game.type
                });
                message.react("\u2705");
        }
}
module.exports.help = {
        name: "setstatus"
}
