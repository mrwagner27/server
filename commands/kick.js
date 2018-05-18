const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

	const rawContent = args.join(" ");
	const parameterOne = rawContent.split(" ")[0];
	const parameterTwo = rawContent.split(" ")[1];
	if (message.member.hasPermission("KICK_MEMBERS")) {
		const target = message.guild.members.find(m => parameterOne.includes(`${m.user.id}`));
		if (target !== null) {
			if (message.member.highestRole.position > target.highestRole.position) {
				var reason;
				if (parameterTwo != undefined) {
					reason = "`" + rawContent.substr(parameterOne.length + 1) + "`";
				} else {
					reason = "`No reason specified.`";
				}
				if (target.kickable) {
					target.send(`You have been kicked from the \`${message.guild.name}\` server by \`${message.author.tag}\` for ${reason}`).then(() => {
						target.kick(`Kicked by ${message.author.tag} for ${reason}`).then(() => {
							message.channel.send(`***Successfully kicked \`${target.user.tag}\`.***`).catch(function() {});
                      					var logsDatabase = bot.channels.find("id", "443931379907166210");
							logsDatabase.fetchMessages({ limit: 100 }).then(logmessages => {
								logmessages.forEach(msg => {
									var logChannel = bot.channels.get(msg.content.split(" ")[1]);
									if (logChannel == undefined) return msg.delete();
									var logGuild = logChannel.guild;
									if (logGuild == undefined) return msg.delete();
									if (`${logGuild.id}` === `${message.guild.id}`) {
										const kickEmbed = new Discord.RichEmbed()
											.setTitle("Member Kicked")
											.setColor("RED")
											.addField("Kick Information", `Kicked ID: \`${target.id}\`\nMember Kicked: ${target}\nKicked At: \`${new Date(Date.now())}\`\nModerator: ${message.author}\nKick Reason: \`${reason}\``)
										logChannel.send({ embed: kickEmbed }).catch(function() {});
									}
								});
							});
						}).catch(() => {
							message.channel.send(`Failed to kick \`${target.user.tag}\`.`).catch(function() {});
						});
					}).catch(() => {
						target.kick(`Kicked by ${message.author.tag} for ${reason}`).then(() => {
							message.channel.send(`***Successfully kicked \`${target.user.tag}\`.***`).catch(function() {});
						}).catch(() => {
							message.channel.send(`Failed to kick \`${target.user.tag}\`.`).catch(function() {});
						});
					});
				} else {
					message.reply("I do not have permission to kick this user.").catch(() => {
						message.author.send(`You attempted to use the \`kick\` command in ${message.channel}, but I can not chat there.`)
							.catch(function() {});
					});
				}
			} else {
				message.reply("That user is too far up in this guild's hierarchy to be kicked by you.").catch(() => {
					message.author.send(`You attempted to use the \`kick\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
				});
			}
		} else {
			message.reply("Please mention or supply the id of a valid user.").catch(() => {
				message.author.send(`You attempted to use the \`kick\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
			});
		}
	} else {
		message.reply("You do not have permissions to trigger this command.").catch(() => {
			message.author.send(`You attempted to use the \`kick\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
		});
	}
}
module.exports.help = {
	name: "kick"
}
