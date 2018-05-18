const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix, content) => {
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("You do not have permission to use this command!").catch(function() {});
	if(!args[0]) return message.reply("You must provide the member's username/tag to unban!").catch(function() {});
	message.guild.fetchBans().then((bans) => {
		let filteredbans = bans.filter(b => b.tag.startsWith(args[0]));
		if(filteredbans.size > 1) return message.reply("Please be more specific with the username/tag to unban!").catch(function() {});
		if(filteredbans.size === 0) return message.reply("Couldn't find anyone with this username!").catch(function() {});
		let banneduser = filteredbans.first();
		message.guild.unban(`${banneduser.id}`).then(() => {
			message.reply(`Successfully unbanned \`${banneduser.tag}\``).catch(function() {});
                      	var logsDatabase = bot.channels.find("id", "443931379907166210");
				logsDatabase.fetchMessages({ limit: 100 }).then(logmessages => {
					logmessages.forEach(msg => {
						var logChannel = bot.channels.get(msg.content.split(" ")[1]);
						if (logChannel == undefined) return msg.delete();
						var logGuild = logChannel.guild;
						if (logGuild == undefined) return msg.delete();
						if (`${logGuild.id}` === `${message.guild.id}`) {
							const banEmbed = new Discord.RichEmbed()
								.setTitle("Member Unbanned")
								.setColor("RED")
								.addField("Unban Information", `Unbanned ID: \`${banneduser.id}\`\nMember Unbanned: ${banneduser.tag}\nUnbanned At: \`${new Date(Date.now())}\`\nModerator: ${message.author}`)
							logChannel.send({ embed: banEmbed }).catch(function() {});
						}
					});
				});
			}).catch(() => {
				message.reply("Couldn't unban this user. Please check my permissions and try again.").catch(function() {});
		})
	});
};
module.exports.help = {
        name: "unban"
}
