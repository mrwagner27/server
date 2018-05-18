const Discord = require("discord.js");

module.exports.run = async (bot) => {
	bot.on("messageDelete", (message) => {
		if(message.author.bot) return;
		var messageAttachments = "";
		if (message.attachments.first() !== undefined) messageAttachments = `\n${message.attachments.first().url}`;
		if (message.content !== "" || messageAttachments !== "") {
			var logsDatabase = bot.channels.find("id", "443931379907166210");
			logsDatabase.fetchMessages({ limit: 100 }).then(messages => {
				messages.forEach(msg => {
					var logChannel = bot.channels.get(msg.content.split(" ")[1]);
					if (logChannel == undefined) return msg.delete();
					var logGuild = logChannel.guild;
					if (logGuild == undefined) return msg.delete();
					if (`${logGuild.id}` === `${message.guild.id}`) {
						const messageDeleteEmbed = new Discord.RichEmbed()
							.setTitle("Message Delete")
							.setColor("RED")
							.addField("Message Content", `Message ID: \`${message.id}\`\nMessage Author: ${message.author}\nMessage Channel: ${message.channel}\nCreated At: \`${message.createdAt}\`\nDeleted At: \`${new Date(Date.now())}\``)
							.setDescription(`\`\`\`${message.content.replace(/\`/gi, "")}${messageAttachments}\`\`\``);
						logChannel.send({ embed: messageDeleteEmbed }).catch(function() {});
					}
				});
			});
		}
	});
	bot.on("messageUpdate", (oldMessage, newMessage) => {
		if(oldMessage.author.bot) return;
		var oldmessage = oldMessage
		var newmessage = newMessage
		var omessageAttachments = "";
		var nmessageAttachments = "";
		if (oldmessage.attachments.first() !== undefined) omessageAttachments = `\n${oldmessage.attachments.first().url}`;
		if (oldmessage.content !== "" || omessageAttachments !== "") {
			var logsDatabase = bot.channels.find("id", "443931379907166210");
			logsDatabase.fetchMessages({ limit: 100 }).then(messages => {
				messages.forEach(msg => {
					var logChannel = bot.channels.get(msg.content.split(" ")[1]);
					if (logChannel == undefined) return msg.delete();
					var logGuild = logChannel.guild;
					if (logGuild == undefined) return msg.delete();
					if (`${logGuild.id}` === `${newmessage.guild.id}`) {
						const messageDeleteEmbed = new Discord.RichEmbed()
							.setTitle("Message Edit")
							.setColor("RED")
							.addField("Message Information", `Message ID: \`${newmessage.id}\`\nMessage Author: ${newmessage.author}\nMessage Channel: ${newmessage.channel}\nCreated At: \`${newmessage.createdAt}\`\nEdited At: \`${new Date(Date.now())}\``)
							.setDescription(`**Old Message:**\`\`\`${oldmessage.content.replace(/\`/gi, "")}${omessageAttachments}\`\`\`\n**New Message:**\`\`\`${newmessage.content.replace(/\`/gi, "")}${nmessageAttachments}\`\`\``);
						logChannel.send({ embed: messageDeleteEmbed }).catch(function() {});
					}
				});
			});
		}
	});
}
