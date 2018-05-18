const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
	let boticon = bot.user.displayAvatarURL
	let botinfocmd = new Discord.RichEmbed()
		.setTitle("Bot Stats")
		.setColor("#38F520")
		.setThumbnail(boticon)
		.addField("Bot Name", bot.user.username)
		.addField("Created On", bot.user.createdAt)
		.addField("Created By", "Windows 10 MacOS#0001 The Wonderful people who coded the bot ethanlaj#8805 and gt_c#0495");
	message.channel.send({ embed: botinfocmd }).catch(function() {});
}

module.exports.help = {
	name: "botinfo"
}
