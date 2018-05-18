module.exports.run = async (bot, message, args, prefix, content) => {
	if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply("You don't have permission to use this command!");
       	var logschannel = bot.channels.find("id", "443931379907166210");
	var msgs = await logschannel.fetchMessages({ limit: 100 });
	var checker = msgs.find(m => m.content.startsWith(`${message.guild.id}`));
	if(!checker) {
	//assume it is disabled
		if(!message.mentions.channels.first()) return message.reply("You must mention a valid channel!");
		let channelid = message.mentions.channels.first().id;
		await logschannel.send(`${message.guild.id} ${channelid}`);
		return message.reply(`Enabled and set logs channel to <#${channelid}>!`);
	} else {
	//assume it is enabled
		if(message.mentions.channels.first()) {
			//assume they are trying to switch channels
			let schannelid = message.mentions.channels.first().id;
			await logschannel.send(`${message.guild.id} ${schannelid}`);
			await checker.delete()
			return message.reply(`Changed logs channel to <#${schannelid}>!`);
		} else {
			//disable completely
			checker.delete();
			return message.reply("Disabled logs in this server!");
		}
	}

}
module.exports.help = {
        name: "logs"
}
