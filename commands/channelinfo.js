const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix, content) => {
	
	let channel = message.channel

	let channelem = new Discord.RichEmbed()
		.setTitle(`#${channel.name}`)
		.addField("Channel ID", channel.id)
		.addField("Created At", channel.createdAt)
		.addField("Channel Position", channel.position)
		.addField("Category", channel.parent)


	message.channel.send(channelem);
}
module.exports.help = {
	name: "channelinfo"

}
