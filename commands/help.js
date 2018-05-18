const Discord = require("discord.js");
module.exports.run = async (bot, message, args, prefix, content) => {
        let helper = new Discord.RichEmbed()
                .setTitle("Commands")
                .setDescription("\`Default Bot Prefix:\` !!")
                .addField("Fun", "\`!!8ball\` - An 8-Ball Simulation\n\`!!rps\` - Plays a game of rock-paper-scissors\n`!!say` - Makes me say whatever you want me to say\n`!!meme` - Returns a random meme")
                .addField("Information", "\`!!about\` - Gets information about a server member\n\`!!getinfo\` - Sends information about a discord user's linked roblox account\n\`!!server\` - Sends the link to the support server\n\`!!invite\` - Sends the link to invite me\n`!!botinfo` - Sends you info all about me\n`!!channelinfo` - Sends you information about a channel\n`!!serverinfo` - Sends you information about a server\n`!!count` - Sends you the number of servers I am in\n`!!news` - Gives you updated news on me")
                .addField("Roles", "`!!addrole` - Creates a role\n`!!delrole` - Deletes a role\n`!!autoroles` - Adds/removes roles to give roles to a user when they join a server\n`!!role` - Gives a user a specified role(s)")
                .addField("Moderation", "\`!!ban\` - Bans a server member\n`!!softban` - Bans then unbans a user, removing their messages\n\`!!kick\` - Kicks a server member\n\`!!mute\` - Mutes a server member\n\`!!unmute\` - Unmutes a server member\n\`!!purge\` - Deletes a specified amount of messages\n\`!!warn\` - Warns a user\n\`!!warnings\` - Shows the warnings for a user\n`!!clearwarn` - Clears warnings for a user\n`!!removewarn` - Removes a warnings for a user")
                .addField("Miscellaneous", "\`!!afk\` - Sets a message to be sent whenever you are pinged\n\`!!report\` - Starts a prompt for reporting bugs/glitches in games\n\`!!ping\` - Responds with the speed of the bot\n\`!!verify\` - Verifies your roblox account with your discord account\n`!!poll` - Creates a poll\n`!!prefix` - Sets a new prefix for the server")
        try {
                await message.author.send(helper)
        } catch (e) {
                return message.reply("Couldn't send you the list of commands, please check your privacy settings and try again!!")
        }
        message.react("\u2705")
}
module.exports.help = {
        name: "help"
}
