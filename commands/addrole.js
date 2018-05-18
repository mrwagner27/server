const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix, content) => {
	if(!message.member.hasPermission("MANAGE_ROLES")) return message.reply("You do not have permissions to use this command.").catch(function() {});
	if(args[0] === undefined) return message.reply("Please specify the following params [optional] (required). `!!addrole [hexcolor: #XXXXXX] [hoist: true/false] (role name)`.").catch(function() {});
	var ishextag = null;
	if(args[0].startsWith("#")) ishextag = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(args[0]);
	if(ishextag === false) return message.reply("Please specify a valid hex code. Example: \`#ff0000\`").catch(function() {});
	if(ishextag === true) ishextag = args[0];
	var hoist;
	if(ishextag === null) {
		hoist = args[0];
	} else {
		hoist = args[1];
	}
	if(hoist !== "true" && hoist !== "false") {
		hoist = [false, "auto"];
	} else {
		if(hoist === "true") hoist = [true, "set"];
		if(hoist === "false") hoist = [false, "set"];
	}
	var ammountToSubstr = prefix.length+8;
	if(ishextag !== null) {
		ammountToSubstr = ammountToSubstr + args[0].length + 1;
	}
	if(hoist[1] !== "auto") {
		ammountToSubstr = ammountToSubstr + args[1].length + 1;
	}
	var name = message.content.substr(ammountToSubstr);
	if(name === "" || name.length > 100) return message.reply("Please specify a name below 100 characters.").catch(function() {});
	message.guild.createRole({
		name: name,
		color: ishextag,
		hoist: hoist[0],
	}).then(() => {
		message.reply(`Successfully created the role \`${name}\` with \`${hoist[0]}\` hoist and \`${ishextag}\` color.`).catch(function() {});
	}).catch(() => {
		message.reply("There was an error upon attempting to make that role.")
	});
}
module.exports.help = {
	name: "addrole"
}
