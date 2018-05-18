const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix, content) => {
	if(!args[0]) { 
    		let number = Math.floor(Math.random() * (6 - 1)) + 1;
    		return await message.reply(`:game_die: You rolled ${number}! :game_die:`).catch(() => {
			message.author.send(`You attempted to use the \`roll\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
	});
		}
	let num = Number(args[0])
	if(!num) return message.reply("Please provide a valid number!").catch(() => {
		message.author.send(`You attempted to use the \`roll\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
	});
  	if(num > 25) return message.reply("You cannot roll more than 25 die at a time!").catch(() => {
		message.author.send(`You attempted to use the \`roll\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
	});
	if(num === 0) return message.reply("Please provide a number above 0!").catch(() => {
		message.author.send(`You attempted to use the \`roll\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
	});
	let max = num * 6;
	let numero = Math.floor(Math.random() * (max - num)) + num;
	return await message.reply(`:game_die: You rolled ${numero}! :game_die:`).catch(() => {
		message.author.send(`You attempted to use the \`roll\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
	});
}
module.exports.help = {
	name: "roll"
}
