const Discord = require("discord.js");
let dbguild = bot.guilds.get("443929284411654144");
let channels = dbguild.channels.filter(m => RegExp("rank-database", "gi").test(m.name));
async function checkRank(bot, message, args, persontolookfor, channels) {
		//GUILDID AUTHORID LEVEL XP
		const nestedMessages = await Promise.all(channels.map(ch => ch.fetchMessages({ limit: 100 })))
		const flatMessages = nestedMessages.reduce((a, b) => a.concat(b))
		const msg = flatMessages.find(msg => msg.content.startsWith(`${message.guild.id} ${persontolookfor}`))
		if (!msg) {
			return (false)
		}
		if (msg) {
			var msgarray = msg.content.split(" ");
			return (msgarray)
			}
		}
	}
module.exports.run = async (bot, message, args, prefix, content) => {
	let channels = dbguild.channels.filter(m => RegExp("rank-database", "gi").test(m.name));
	if(!message.mentions.members.first()) {
		let persontolookfor = message.mentions.members.first().id;
		let returnedarray = await checkRank(bot, message, args, persontolookfor, channels);
		if (returnedarray === false) return message.reply("Couldn't find any data for this user!");
		let level = returnedarray[2];
		let xp = returnedarray[3];
		return message.reply(`Rank for \`${message.mentions.members.first().tag}\`:\n**Level:** \`${level}\`\n**XP:** \`${xp}\``)
	} else {
		let persontolookfor = message.author.id;
		let returnedarray = await checkRank(bot, message, args, persontolookfor, channels);
		if (returnedarray === false) return message.reply("Couldn't find any data for this user!");
		let level = returnedarray[2];
		let xp = returnedarray[3];
		return message.reply(`Rank for \`${message.author.tag}\`:\n**Level:** \`${level}\`\n**XP:** \`${xp}\``)	
	}
}
module.exports.help = {
        name: "level"
}
