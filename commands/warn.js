const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix) => {
	let target = message.guild.member(message.mentions.users.first());
	if (target) {
		//if (target.id == "289380085025472523") return message.reply("You cannot warn this user!") //no gtc
		if (message.member.hasPermission("KICK_MEMBERS") || message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("BAN_MEMBERS")) {
			if (message.member.highestRole.position <= target.highestRole.position) return message.reply("You are not high enough in this guild's hierarchy to warn this user.");
			if (args[1] == null) {
				// checks if there is a reason
				var reason = "No reason specified";
			} else {
				var reason = message.content.substr(5 + prefix.length + args[0].length);
				// takes out the user mention/id/name and command to result in everything else
			}
			try {
				await target.send(`You were warned in \`${message.guild.name}\` for \`${reason}\` by \`${message.author.username}#${message.author.discriminator}\``)
				await message.react("✅");
			} catch (e) {
				await message.reply("Couldn't DM this user about their warning!")
			}
			var dbguild = bot.guilds.get("443929284411654144");
			var dbchannel = dbguild.channels.find("name", "warn-database")
			var olo = await dbchannel.fetchMessages({ limit: 100 });
			var msgcount = olo.size;
                      	var logsDatabase = bot.channels.find("id", "443931379907166210");
			logsDatabase.fetchMessages({ limit: 100 }).then(logmessages => {
				logmessages.forEach(msg => {
					var logChannel = bot.channels.get(msg.content.split(" ")[1]);
					if (logChannel == undefined) return msg.delete();
					var logGuild = logChannel.guild;
					if (logGuild == undefined) return msg.delete();
					if (`${logGuild.id}` === `${message.guild.id}`) {
						const warnEmbed = new Discord.RichEmbed()
							.setTitle("Member Warned")
							.setColor("RED")
							.addField("Warn Information", `Warned ID: \`${target.id}\`\nMember Warned: ${target}\nWarned At: \`${new Date(Date.now())}\`\nModerator: ${message.author}\nWarn Reason: \`${reason}\``)
						logChannel.send({ embed: warnEmbed }).catch(function() {});
					}
				});
			});
			if (msgcount == "100") {
				await dbchannel.setName("archived-warn-database");
				// Create a new category channel with permission overwrites
				dbguild.createChannel('warn-database', 'text', [{
					id: dbguild.id,
					deny: ['READ_MESSAGES'],
					allow: []
        			}]).then(() => {
					dbchannel = dbguild.channels.find("name", "warn-database");
					dbchannel.setParent("443931006437949440");
					dbchannel.send(`${message.guild.id} ${target.id} ${message.author.id} ${reason}`);
				});
			} else dbchannel.send(`${message.guild.id} ${target.id} ${message.author.id} ${reason}`)

		} else message.reply("Insufficent permissions.");

	} else message.reply("Please **mention** a valid user.");

}
module.exports.help = {
	name: "warn"
}
