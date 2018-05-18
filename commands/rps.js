const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
	
	let choice = args[0];
	var responses = ["rock", "paper", "scissors"];
	if (!choice) return message.reply("You did not provide your choice!")
	if (!responses.includes(choice.toLowerCase())) return message.reply("Please specify one of the following as a choice: `rock`, `paper` or `scissors`.");
	var responsesop = ["paper", "scissors", "rock"];
	var randomchoice = Math.floor(Math.random() * responses.length);
	if (choice.toLowerCase() == responses[randomchoice]) return message.reply(`You choice \`${choice}\`, I chose \`${responses[randomchoice]}\`! It's a draw!`);
	if (responsesop.indexOf(choice) == randomchoice) return message.reply(`You choice \`${choice}\`, I chose \`${responses[randomchoice]}\`! You win!`);
	if (responsesop.indexOf(choice) != randomchoice) return message.reply(`You choice \`${choice}\`, I chose \`${responses[randomchoice]}\`! You lose!`);

}
module.exports.help = {
	name: "rps"
}
