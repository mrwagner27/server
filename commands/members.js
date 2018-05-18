const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix, content) => {
	var memberEmbed = new Discord.RichEmbed().setColor("GREEN");
	var members;
	var content = content;
	if (message.guild.roles.find(r => r.name.toLowerCase().startsWith(content.toLowerCase()))) {
		if (content !== "") {
			members = message.guild.roles.find(r => r.name.toLowerCase().startsWith(content.toLowerCase())).members.map(m => m.user.tag).sort()
				.map(u => bot.users.find(r => r.tag === u).toString()).join("\n");
			memberEmbed.setTitle(`Users in ${message.guild.roles.find(r => r.name.toLowerCase().startsWith(content.toLowerCase())).name}`);
		} else {
			members = message.guild.members.map(m => m.user.tag).sort()
				.map(u => bot.users.find(r => r.tag === u).toString()).join("\n");
			memberEmbed.setTitle("Users");
		}
		var membersLength = members.length;
		var membersToSend;
		var page = 1;
		if (members.split("\n").length > 20) {
			membersLength = 0;
			membersToSend = members.split("\n").slice(membersLength, membersLength + 20);
			var totalPages = 20 - (members.split("\n").length % 20);
			if (totalPages === 20) {
				totalPages = members.split("\n").length / 20;
			} else {
				totalPages = (members.split("\n").length + (20 - (members.split("\n").length % 20)));
				totalPages = totalPages / 20;
			}
			memberEmbed.setDescription(membersToSend.join("\n")).setFooter(`Page ${page}/${totalPages}`);
			message.channel.send({
				embed: memberEmbed
			}).then(async function(sentEmbed) {
				const emojiArray = ["◀", "▶"];
				const filter = (reaction, user) => emojiArray.includes(reaction.emoji.name) && user.id === message.author.id;
				await sentEmbed.react(emojiArray[0]).catch(function() {});
				await sentEmbed.react(emojiArray[1]).catch(function() {});
				var reactions = sentEmbed.createReactionCollector(filter, {
					time: 120000
				});
				reactions.on("collect", async function(reaction) {
					await reaction.remove(message.author);
					if (reaction.emoji.name === "◀") {
						if (page !== 1) {
							page = page - 1;
							membersLength = membersLength - 20;
							membersToSend = members.split("\n").slice(membersLength, membersLength + 20);
						}
					} else {
						if (page !== totalPages) {
							page = page + 1;
							membersLength = membersLength + 20;
							membersToSend = members.split("\n").slice(membersLength, membersLength + 20);
						}
					}

					memberEmbed = new Discord.RichEmbed().setDescription(membersToSend.join("\n")).setColor("ORANGE")
						.setFooter(`Page ${page}/${totalPages}`);
					if (content !== "") memberEmbed.setTitle(`Users in ${message.guild.roles.find(r => r.name.toLowerCase().startsWith(content.toLowerCase())).name}`);
					if (content === "") memberEmbed.setTitle("Users");
					sentEmbed.edit(memberEmbed).catch(function() {});
				});
				reactions.on("end", () => sentEmbed.edit("Interactive command ended: 2 minutes passed."));
			}).catch(() => {
				message.reply("There was an error while trying to send this embed.").catch(() => {
					message.author.send(`You attempted to run the \`members\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
				});
			});
		} else {
			memberEmbed.setDescription(members);
			message.channel.send({ embed: memberEmbed }).catch(() => {
				message.reply("There was an error while trying to send this embed.").catch(() => {
					message.author.send(`You attempted to run the \`members\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
				});
			});
		}
	} else {
		message.reply("Please specify a valid role, or supply no parameter for everyone in this server.").catch(() => {
			message.author.send(`You attempted to run the \`members\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
		});
	}
}
module.exports.help = {
	name: "members"
}
