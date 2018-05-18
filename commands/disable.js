const Discord = require("discord.js");
async function checkIfDisabled(bot, message, args, cmdname, channels) {
        const nestedMessages = await Promise.all(channels.map(ch => ch.fetchMessages({
                limit: 100
        })))
        const flatMessages = nestedMessages.reduce((a, b) => a.concat(b))
        const msg = flatMessages.find(msg => msg.content.startsWith(`${message.guild.id}`))
        if (!msg) {
                return (false)
        }
        if (msg) {
                var commands = msg.content.split(" ");
                // ["guild_id", "command", "command", "command"];
                if (commands.shift() === message.guild.id) {
                        // ["command", "command", "command"];
                        if (commands.includes(cmdname)) {
                                return (true)
                        } else {
                                return (false)
                        }
                }
        }
}
async function findthemessage(bot, message, args, channels) {
        const nestedMessages = await Promise.all(channels.map(ch => ch.fetchMessages({
                limit: 100
        })))
        const flatMessages = nestedMessages.reduce((a, b) => a.concat(b))
        const msg = flatMessages.find(msg => msg.content.startsWith(`${message.guild.id}`))
        if (msg) {
                return (msg)
        } else {
                return (false)
        }
}
module.exports.run = async (bot, message, args, prefix, content) => {
        var nodisable = ["help", "disable"]
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply("You do not have permission to use this command.")
        if (!args[0]) return message.reply("You must provide the name of the command to enable/disable. Please try again.")
        //if(args[0] === "disable" || "help") return message.reply("This command cannot be disabled!")
        let dbguild = bot.guilds.get("443929284411654144");
        let channel = dbguild.channels.find("name", "wbotdisable-database")
        let messages = await channel.fetchMessages({
                limit: 100
        })
        if (nodisable.includes(args[0].toLowerCase())) return message.reply("This command cannot be disabled!")
        let channels = dbguild.channels.filter(m => RegExp("wbotdisable-database", "gi")
                .test(m.name));
        var findit = bot.commands.get(args[0].toLowerCase())
        if (!findit) return message.reply("Not a valid command! Note: You cannot disable a command from its aliases!")
        let cmddisablecheck = await checkIfDisabled(bot, message, args, args[0].toLowerCase(), channels)
        let findmessage = await findthemessage(bot, message, args, channels)
        if (cmddisablecheck) {
                let anewedit = findmessage.content.replace(args[0].toLowerCase(), "");
                let newedit = anewedit.replace("  ", " ");
                await findmessage.edit(newedit)
                message.reply("Re-enabled the command!")
        }
        if (!cmddisablecheck) {
                if (findmessage !== false) {
                        await findmessage.edit(findmessage.content + ` ${args[0].toLowerCase()}`);
                        await message.reply("Disabled the command!")
                } else {
                        await channel.send(`${message.guild.id} ${args[0].toLowerCase()}`)
                        await message.reply("Disabled the command!")
                }
        }
        if (messages.size > 97) {
                await channel.setName("o-wbotdisable-database")
                await dbguild.createChannel('wbotdisable-database')
                let newc = dbguild.channels.find("name", "wbotdisable-database")
                await newc.overwritePermissions(channel.guild.id, {
                        READ_MESSAGES: false
                });
                await newc.setParent("443931006437949440");
        }
}
module.exports.help = {
        name: "disable"
}
