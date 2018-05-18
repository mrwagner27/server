module.exports.run = async (bot, message, args, prefix) => {
        let guild = bot.guilds.get("410400562232819723")
        let member = await guild.fetchMember(message.author.id)
        if (!member) return;
        if (member.roles.get("410481036162760722")) { //owner 
                let update = message.content.substr(prefix.length + 8);
                let channel = bot.channels.get("443931372508151820");
                let editor = await channel.fetchMessage("443935229548167174");
                await editor.edit(update);
                await message.react("\u2705");
        }
}
module.exports.help = {
        name: "setnews"
}
