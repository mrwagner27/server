const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix, content) => {
	var currentRoles;
	const dbChannel = bot.guilds.get("443929284411654144").channels.find("name", "rank-database");
	if (message.member.hasPermission("MANAGE_ROLES")) {
		if (args[0] === undefined) return message.reply("Please specify an option: \`!!rank add/remove/view\`").catch(function() {});
		if (args[0].toLowerCase() === "add") {
			var role = message.guild.roles.find(role => role.name.toLowerCase().startsWith(args.slice(1).join(" ").toLowerCase()));
			if (role != null) {
				if (role.position >= message.member.highestRole.position) return message.reply("You are not high enough in this guilds hierarchy to add this as a self-assignable role.").catch(function() {});
				dbChannel.fetchMessages({ limit: 100 }).then(messages => {
					currentRoles = messages.find(msg => msg.content.startsWith(message.guild.id));
					if (currentRoles != null) {
						if (!currentRoles.content.includes(role.id)) {
							currentRoles.edit(currentRoles.content + ` ${role.id}`).then(() => message.reply(`Successfully added the \`${role.name}\` role to this guild's self-assignable roles.`).catch(function() {}));
						} else {
							message.reply(`\`${role.name}\` is already a self-assignable role for this guild. To remove it say: \`!!rank remove ${role.name}\`.`).catch(() => {
								message.author.send(`You attempted to use the \`rank\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
							});
						}
					} else {
						dbChannel.send(`${message.guild.id} ${role.id}`).then(() => message.reply(`Successfully added the \`${role.name}\` role to this guild's self-assignable roles.`).catch(function() {}));
					}
				});
			} else {
				message.reply("Please specify a valid role to set as a self-assignable for this guild.").catch(() => {
					message.author.send(`You attempted to use the \`rank\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
				});
			}
		} else if (args[0].toLowerCase() === "remove") {
			var role = message.guild.roles.find(role => role.name.toLowerCase().startsWith(args.slice(1).join(" ").toLowerCase()));
			if (role != null) {
				dbChannel.fetchMessages({ limit: 100 }).then(messages => {
					currentRoles = messages.find(msg => msg.content.startsWith(message.guild.id));
					if (currentRoles != null) {
						if (currentRoles.content.includes(role.id)) {
							currentRoles.edit(currentRoles.content.replace(` ${role.id}`, "")).then(() => message.reply(`The \`${role.name}\` self-assignable role has been removed from this guild's self-assignable roles.`).catch(function() {}));
						} else {
							message.reply(`\`${role.name}\` is not a valid self-assignable role, and therefore cannot be removed.`).catch(() => {
								message.author.send(`You attempted to use the \`rank\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
							});
						}
					} else {
						message.reply("This guild has no self-assignable roles to remove.").catch(() => {
							message.author.send(`You attempted to use the \`rank\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
						});
					}
				});
			} else {
				message.reply("Please specify a valid self-assignable role to remove from this guild.").catch(() => {
					message.author.send(`You attempted to use the \`rank\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
				});
			}
		} else if (args[0].toLowerCase() === "view") {
			dbChannel.fetchMessages({ limit: 100 }).then(messages => {
				currentRoles = messages.find(msg => msg.content.startsWith(message.guild.id));
				if (currentRoles != null) {
					if (currentRoles.content.slice(message.guild.id.length).trim() !== "") {
						message.channel.send(`These are the self-assignable roles of this guild:\n\`${currentRoles.content.slice(message.guild.id.length).trim().split(" ").map(id => message.guild.roles.get(id).name).join("`,\n`")}\``).catch(function() {});
					} else {
						message.reply("This guild has no self-assignable roles to view.").catch(() => {
							message.author.send(`You attempted to use the \`rank\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
						});
					}
					currentRoles.content.split(" ").forEach(selfRole => {
						if (!message.guild.roles.get(selfRole)) {
							currentRoles.edit(currentRoles.content.replace(` ${selfRole}`, "")).catch(function() {});
						}
					});
				} else {
					message.reply("This guild has no self-assignable roles to view.").catch(() => {
						message.author.send(`You attempted to use the \`rank\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
					});
				}
			});
		} else {
			if (args[0] === undefined) {
				message.reply("Please specify a valid role to join, or run `!!rank add/remove role` to add/remove a rank to the self-assignable roles. Run `!!rank view` to view ranks in this server.").catch(() => {
					message.author.send(`You attempted to use the \`rank\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
				});
			} else {
				if (args[0] === undefined) {
					message.reply("Please specify a valid role to join, or run `!!rank add/remove role` to add/remove a rank to the self-assignable roles. Run `!!rank view` to view ranks in this server.").catch(() => {
						message.author.send(`You attempted to use the \`rank\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
					});
				} else {
					dbChannel.fetchMessages({ limit: 100 }).then(messages => {
						currentRoles = messages.find(msg => msg.content.startsWith(message.guild.id));
						if (currentRoles != null) {
							if (currentRoles.content.slice(message.guild.id.length).trim() !== "") {
								var desiredRole = currentRoles.content.slice(message.guild.id.length).trim().split(" ").map(role => message.guild.roles.get(role)).find(role => role.name.toLowerCase() == content.toLowerCase());
								if (desiredRole != null) {
									if (message.member.roles.has(desiredRole.id)) {
										message.member.removeRole(desiredRole).then(() => {
											message.reply(`Successfully removed the \`${desiredRole.name}\` self-assignable role from you.`).catch(function() {});
										}).catch(() => {
											message.reply(`I failed to remove the \`${desiredRole.name}\` self-assignable role from you.`).catch(function() {});
										});
									} else {
										message.member.addRole(desiredRole).then(() => {
											message.reply(`Successfully added the \`${desiredRole.name}\` self-assignable role to you.`).catch(function() {});
										}).catch(() => {
											message.reply(`I failed to add the \`${desiredRole.name}\` self-assignable role to you.`).catch(function() {});
										});
									}
								}
							} else {
								message.reply("This guild has no self-assignable roles to view.").catch(() => {
									message.author.send(`You attempted to use the \`rank\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
								});
							}
						} else {
							message.reply("This guild has no self-assignable roles to view.").catch(() => {
								message.author.send(`You attempted to use the \`rank\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
							});
						}
					});
				}
			}
		}
	} else {
		if (args[0].toLowerCase() === "view") {
			dbChannel.fetchMessages({ limit: 100 }).then(messages => {
				currentRoles = messages.find(msg => msg.content.startsWith(message.guild.id));
				if (currentRoles != null) {
					if (currentRoles.content.slice(message.guild.id.length).trim() !== "") {
						message.channel.send(`These are the self-assignable roles of this guild:\n\`${currentRoles.content.slice(message.guild.id.length).trim().split(" ").map(id => message.guild.roles.get(id).name).join("`,\n`")}\``).catch(function() {});
					} else {
						message.reply("This guild has no self-assignable roles to view.").catch(() => {
							message.author.send(`You attempted to use the \`rank\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
						});
					}
					currentRoles.content.split(" ").forEach(selfRole => {
						if (!message.guild.roles.get(selfRole)) {
							currentRoles.edit(currentRoles.content.replace(` ${selfRole}`, "")).catch(function() {});
						}
					});
				} else {
					message.reply("This guild has no self-assignable roles to view.").catch(() => {
						message.author.send(`You attempted to use the \`rank\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
					});
				}
			});
		} else {
			if (args[0] === undefined) {
				message.reply("Please specify a valid role to join, or run `!!rank add/remove role` to add/remove a rank to the self-assignable roles. Run `!!rank view` to view ranks in this server.").catch(() => {
					message.author.send(`You attempted to use the \`rank\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
				});
			} else {
				dbChannel.fetchMessages({ limit: 100 }).then(messages => {
					currentRoles = messages.find(msg => msg.content.startsWith(message.guild.id));
					if (currentRoles != null) {
						if (currentRoles.content.slice(message.guild.id.length).trim() !== "") {
							var desiredRole = currentRoles.content.slice(message.guild.id.length).trim().split(" ").map(role => message.guild.roles.get(role)).find(role => role.name.toLowerCase() === content.slice(args[0].length).trim().toLowerCase());
							if (desiredRole != null) {
								if (message.member.roles.has(desiredRole.id)) {
									message.member.removeRole(desiredRole).then(() => {
										message.reply(`Successfully removed the \`${desiredRole.name}\` self-assignable role from you.`).catch(function() {});
									}).catch(() => {
										message.reply(`I failed to remove the \`${desiredRole.name}\` self-assignable role from you.`).catch(function() {});
									});
								} else {
									message.member.addRole(desiredRole).then(() => {
										message.reply(`Successfully added the \`${desiredRole.name}\` self-assignable role to you.`).catch(function() {});
									}).catch(() => {
										message.reply(`I failed to add the \`${desiredRole.name}\` self-assignable role to you.`).catch(function() {});
									});
								}
							}
						} else {
							message.reply("This guild has no self-assignable roles to view.").catch(() => {
								message.author.send(`You attempted to use the \`rank\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
							});
						}
					} else {
						message.reply("This guild has no self-assignable roles to view.").catch(() => {
							message.author.send(`You attempted to use the \`rank\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
						});
					}
				});
			}
		}
	}
}

module.exports.help = {
	name: "rank",
	category: "Roles",
	desc: "Allows user to put self-assignable roles on a guild which can be given to users when they run !!rank role."
}
