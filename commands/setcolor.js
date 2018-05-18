module.exports.run = async (bot, message, args) => {
        let guild = bot.guilds.find(`id`, "410400562232819723")
        let member = await guild.fetchMember(message.author.id)
        if (!member) return;
        if (member.roles.get("410481036162760722")) { //owner 
                let tbh = args.join(" ")
                        .toLowerCase();
                await bot.user.setStatus(`${tbh}`)
                if ((tbh === "online") || (tbh === "idle") || (tbh === "invisible") || (tbh === "dnd")) {
                        await message.react("\u2705");
                } else {
                        message.reply("Not a valid option!\nOptions: \n**Online\nidle\ninvisible\ndnd**")
                }
        }
}
module.exports.help = {
        name: "setcolor"
}
