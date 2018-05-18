const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix, content) => {

	let guild = bot.guilds.get("410400562232819723");
	let member = await guild.fetchMember(message.author.id);
	if (!member) return;
	if (member.roles.get("410546480307503124") || member.roles.get("410611296401358848") || member.roles.get("410608939139334184") || member.roles.get("410481036162760722")) {
		let channel = bot.channels.get("443931370968973312")
		let pingeduser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		let userid = args[0]
		let messages = await channel.fetchMessages({
			limit: 100
		})
		if (!pingeduser) {
			let barray = messages.filter(m => RegExp(userid, "gi")
				.test(m.content));
			let auser = barray.first();
			if (!auser) {
				let userob = await bot.fetchUser(userid)
				if (!userob) return message.reply("Couldn't find this user!")
				channel.send(`${userid}, ${userob.username}#${userob.discriminator}`)
				message.react("\u2705")
			} else return message.reply("This user is already blacklisted!")
		} else {
			let darray = messages.filter(m => RegExp(pingeduser.id, "gi")
				.test(m.content));
			let buser = darray.first();
			if (!buser) {
				let userob = await bot.fetchUser(pingeduser.id)
				if (!userob) message.reply("Couldn't find this user!")
				channel.send(`${pingeduser.id}, ${userob.username}#${userob.discriminator}`)
				message.react("\u2705")
			} else return message.reply("This user is already blacklisted!")
		}
	}
}
module.exports.help = {
	name: "blacklist"
}
