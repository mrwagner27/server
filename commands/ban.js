const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
	 
	const rawContent = args.join(" ");
	const parameterOne = rawContent.split(" ")[0];
	const parameterTwo = rawContent.split(" ")[1];
	if (message.member.hasPermission("BAN_MEMBERS")) {
		const target = message.guild.members.find(m => parameterOne.includes(`${m.user.id}`));
		if (target !== null) {
			if (message.member.highestRole.position > target.highestRole.position) {
				var reason;
				if (parameterTwo != undefined) {
					reason = "`" + rawContent.substr(parameterOne.length + 1) + "`";
				} else {
					reason = "`No reason specified.`";
				}
				if (target.bannable) {
					target.send(`You have been banned from the \`${message.guild.name}\` server by \`${message.author.tag}\` for ${reason}`).then(() => {
						target.ban({
							days: 7,
							reason: `Banned by ${message.author.tag} for ${reason}`
						}).then(() => {
							message.channel.send(`***Successfully banned \`${target.user.tag}\`.***`).then(msg => msg.delete(5000).catch(function() {}));
                      					var logsDatabase = bot.channels.find("id", "443931379907166210");
							logsDatabase.fetchMessages({ limit: 100 }).then(logmessages => {
							logmessages.forEach(msg => {
								var logChannel = bot.channels.get(msg.content.split(" ")[1]);
								if (logChannel == undefined) return msg.delete();
								var logGuild = logChannel.guild;
								if (logGuild == undefined) return msg.delete();
								if (`${logGuild.id}` === `${message.guild.id}`) {
									const banEmbed = new Discord.RichEmbed()
										.setTitle("Member Banned")
										.setColor("RED")
							.addField("Ban Information", `Banned ID: \`${target.id}\`\nMember Banned: ${target}\nBanned At: \`${new Date(Date.now())}\`\nModerator: ${message.author}\nBan Reason: \`${reason}\``)
									logChannel.send({ embed: banEmbed }).catch(function() {});
								}
							});
							});
						}).catch(() => {
							message.channel.send(`Failed to ban \`${target.user.tag}\`.`).then(msg => msg.delete(5000).catch(function() {}));
						});
					}).catch(() => {
						target.ban({
							days: 7,
							reason: `Banned by ${message.author.tag} for ${reason}`
						}).catch(() => {
							message.channel.send(`Failed to ban \`${target.user.tag}\`.`).then(msg => msg.delete(5000).catch(function() {}));
						});
					});
				} else {
					message.reply("I do not have permission to ban this user.").catch(() => {
						message.author.send(`You attempted to use the \`ban\` command in ${message.channel}, but I can not chat there.`)
							.catch(function() {});
					});
				}
			} else {
				message.reply("That user is too far up in this guild's hierarchy to be banned by you.").catch(() => {
					message.author.send(`You attempted to use the \`ban\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
				});
			}
		} else {
			message.reply("Please mention or supply the id of a valid user.").catch(() => {
				message.author.send(`You attempted to use the \`ban\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
			});
		}
	} else {
		message.reply("You do not have permissions to trigger this command.").catch(() => {
			message.author.send(`You attempted to use the \`ban\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
		});
	}
}
module.exports.help = {
	name: "ban"
}
