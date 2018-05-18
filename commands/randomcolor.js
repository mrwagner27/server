var randomHex = require('random-hex');
const Discord = require("discord.js");
module.exports.run = async (bot, message, args, prefix, content) => {
	var hex = randomHex.generate();
	var justhex = hex.slice(1);
	const embed = new Discord.RichEmbed()
		.setTitle("Random Color")
		.setColor(hex)
		.setFooter(`Requested by ${message.author.tag}`)
		.setThumbnail(`https://dummyimage.com/500x500/${justhex}/${justhex}.png`)
		.setDescription(`Hex Code: ${hex}`);
	message.channel.send(embed).catch(function() {});	
}
module.exports.help = {
        name: "randomcolor"
}
