const ms = require("ms");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix, content) => {

	const parameterOne = args[0];
	const parameterTwo = args[1];
	if (message.member.hasPermission("KICK_MEMBERS")) {
		const target = message.guild.members.find(member => parameterOne.includes(member.user.id) || member.user.tag.toLowerCase()
			.startsWith(parameterOne.toLowerCase()));
		if (target !== null) {
			if (message.member.highestRole.position > target.highestRole.position) {
				if (!target.roles.has(message.guild.roles.find('name', 'Muted')
						.id)) {
					if (parameterTwo !== undefined) var muteTime = ms(parameterTwo);
					if (muteTime) {
						if (muteTime >= 10000) {
							target.addRole(message.guild.roles.find("name", "Muted"))
								.then(() => {
                      							var logsDatabase = bot.channels.find("id", "443931379907166210");
									logsDatabase.fetchMessages({ limit: 100 }).then(logmessages => {
										logmessages.forEach(msg => {
											var logChannel = bot.channels.get(msg.content.split(" ")[1]);
											if (logChannel == undefined) return msg.delete();
											var logGuild = logChannel.guild;
											if (logGuild == undefined) return msg.delete();
											if (`${logGuild.id}` === `${message.guild.id}`) {
												const muteEmbed = new Discord.RichEmbed()
													.setTitle("Member Muted")
													.setColor("RED")
													.addField("Member Information", `Member ID: \`${target.id}\`\nMember Muted: ${target}\nModerator: ${message.author}\nMuted At: \`${new Date(Date.now())}\``)
												logChannel.send({ embed: muteEmbed }).catch(function() {});
											}
										});
									});
									message.channel.send(`***Successfully muted \`${target.user.tag}\` for ${ms(muteTime, { long: true })}.***`)
										.catch(function() {});
									bot.channels.get("436947091483262996")
										.send(`${message.guild.id} ${target.user.id} ${Date.now() + muteTime}`)
										.then(msg => {
											setTimeout(() => {
												target.removeRole(message.guild.roles.find("name", "Muted"))
													.catch(function() {});
												msg.delete()
													.catch(function() {});

											}, muteTime);
										});
								})
								.catch(() => {
									message.channel.send(`Failed to mute \`${target.user.tag}\`.`)
										.catch(function() {});
								});
						} else {
							message.reply("The time to mute the user must be at least 10 seconds.")
								.catch(function() {});
						}
					} else {
						target.addRole(message.guild.roles.find("name", "Muted"))
							.then(() => {
								message.channel.send(`***Successfully muted \`${target.user.tag}\`.***`)
									.catch(function() {});
								var logsDatabase = bot.channels.get("440238037201453056");
								logsDatabase.fetchMessages({ limit: 100 }).then(logmessages => {
									logmessages.forEach(msg => {
										var logChannel = bot.channels.get(msg.content.split(" ")[1]);
										if (logChannel == undefined) return msg.delete();
										var logGuild = logChannel.guild;
										if (logGuild == undefined) return msg.delete();
										if (`${logGuild.id}` === `${msg.guild.id}`) {
											const muteEmbed = new Discord.RichEmbed()
												.setTitle("Member Muted")
												.setColor("RED")
												.addField("Member Information", `Member ID: \`${target.id}\`\nMember Muted: ${target}\nModerator: ${message.author}\nMuted At: \`${new Date(Date.now())}\``)
											logChannel.send({ embed: muteEmbed }).catch(function() {});
										}
									});
								});
							})
							.catch(() => {
								message.channel.send(`Failed to mute \`${target.user.tag}\`.`)
									.catch(function() {});
							});
					}
				} else {
					message.reply("That user is already muted.")
						.catch(() => {
							message.author.send(`You attempted to use the \`mute\` command in ${message.channel}, but I can not chat there.`)
								.catch(function() {});
						});
				}
			} else {
				message.reply("That user is too far up in this guild's hierarchy to be muted by you.")
					.catch(() => {
						message.author.send(`You attempted to use the \`mute\` command in ${message.channel}, but I can not chat there.`)
							.catch(function() {});
					});
			}
		} else {
			message.reply("Please specify a valid user.")
				.catch(() => {
					message.author.send(`You attempted to use the \`mute\` command in ${message.channel}, but I can not chat there.`)
						.catch(function() {});
				});
		}
	} else {
		message.reply("You do not have permissions to trigger this command.")
			.catch(() => {
				message.author.send(`You attempted to use the \`mute\` command in ${message.channel}, but I can not chat there.`)
					.catch(function() {});
			});
	}
}
module.exports.help = {
	name: "mute"
}
