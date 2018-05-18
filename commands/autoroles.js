const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix, content) => {
	
	if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply("You do not have permissions to use this command.");
	var dbguild = bot.guilds.get("443929284411654144");
	var dbchannels = dbguild.channels.filter(channel => channel.name.includes("autoroles-database"));
	var count = 0;
	var count2 = 0;
	if (args[0] === "view") {
		dbchannels.forEach(dbchannel => {
			count2 = count2 + 1;
			dbchannel.fetchMessages({
				limit: 100
			}).then(messages => {
				messages.forEach(async msg => {
					if (msg.content.startsWith(`${message.guild.id}`) && msg.content.length != `${message.guild.id}`.length) {
						count = count - 1;
						msgargs = msg.content.split(" ").slice(1);
						message.reply(`Autoroles for this server: \`${msgargs.map(role => message.guild.roles.get(role).name).join("`, `")}\`.`);
					}
					count = count + 1;
					if (count == messages.size && count2 == dbchannels.size) return message.reply("There are no autoroles set in this server. Try the command `!autoroles set`").catch(function() {});
				});
			});
		});
	} else if (args[0] === "set") {
		if (args[1] != undefined) {
			var roleToSet = message.guild.roles.find(role => role.name.toLowerCase() === content.substr(args[0].length+1).toLowerCase());
			if (roleToSet !== null) {
				dbchannels.forEach(dbchannel => {
					count2 = count2 + 1;
					dbchannel.fetchMessages({
						limit: 100
					}).then(messages => {
						messages.forEach(async msg => {
							if (msg.content.startsWith(`${message.guild.id}`)) {
								count = count - 1;
								if (!msg.content.includes(`${roleToSet.id}`)) {
									msg.edit(msg.content + ` ${roleToSet.id}`).then(() => {
										message.reply(`The \`${roleToSet.name}\` role is now an autorole for this server.`).catch(function() {});
									});
								} else {
									message.reply(`The \`${roleToSet.name}\` role is already a autorole for this server.`).catch(function() {});
								}
							}
							count = count + 1;
							if (count == messages.size && count2 == dbchannels.size) {
								dbguild.channels.find("name", "autoroles-database").fetchMessages({ limit: 100}).then(messagesFetched => {
									if (messagesFetched >= 100) {
										dbguild.createChannel("autoroles-database", "text", [{
											id: dbguild.id,
											deny: ['READ_MESSAGES'],
										}]).then(newdbchannel => {
											newdbchannel.send(`${message.guild.id} ${roleToSet.id}`).catch(function() {});
										});
									} else {
										dbguild.channels.find("name", "autoroles-database").send(`${message.guild.id} ${roleToSet.id}`).then(() => {
											message.reply(`The \`${roleToSet.name}\` role is now an autorole for this server.`).catch(function() {});
										}).catch(function() {});
									}
								});
							}
						});
					});
				});
			} else {
				message.reply("Please specify a valid role to set as an autorole. Example: `!autoroles set Member`").catch(function() {});
			}
		} else {
			message.reply("Please specify a role to set as an autorole. Example: `!autoroles set Member`").catch(function() {})
		}
	} else if (args[0] === "delete") {
		if (args[1] !== undefined) {
			var roleToDel = message.guild.roles.find(role => role.name.toLowerCase() === content.substr(args[0].length+1).toLowerCase());
			if (roleToDel !== null) {
				dbchannels.forEach(dbchannel => {
					count2 = count2 + 1;
					dbchannel.fetchMessages({
						limit: 100
					}).then(messages => {
						messages.forEach(async msg => {
							if (msg.content.startsWith(`${message.guild.id}`)) {
								count = count - 1;
								if (msg.content.includes(`${roleToDel.id}`)) {
									msg.edit(msg.content.replace(` ${roleToDel.id}`, "")).then(() => {
										message.reply(`The \`${roleToDel.name}\` role is now not an autorole in this server.`).catch(function() {});
									});
								} else {
									message.reply(`The \`${roleToDel.name}\` role is not a autorole for this server.`).catch(function() {});
								}
							}
							count = count + 1;
							if (count == messages.size && count2 == dbchannels.size) {
								message.reply("This server has no autoroles. To set an autorole use `!autoroles set`").catch(function() {});
							}
						});
					});
				});
			} else {
				message.reply("Please specify a valid role to delete. Example: `!autoroles delete Member`").catch(function() {});
			}
		} else {
			message.reply("Please specify a autorole to delete. Example: `!autoroles delete Member`").catch(function() {});
		}
	} else {
		message.reply("Invalid parameter. Valid parameters are: `set`, `view`, `delete`.")
	}
}
module.exports.help = {
	name: "autoroles"
}
