const botconfig = require("./botconfig.js");
const Discord = require("discord.js");
const logsfile = require("./logs.js")
const fs = require("fs");
const bot = new Discord.Client({
	disableEveryone: true,
	fetchAllMembers: true
});
bot.counter = false;
bot.commands = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
	if (err) console.log(err);
	let jsfile = files.filter(f => f.split(".")
		.pop() === "js")
	if (jsfile.length <= 0) {
		console.log("Couldn't find commands.");
		return;
	}
	jsfile.forEach((f, i) => {
		let props = require(`./commands/${f}`);
		console.log(`${f} loaded!`);
		bot.commands.set(props.help.name, props);
	});
});
bot.on("ready", async () => {
	console.log(`${bot.user.username} is online!`);
	let tchannel = bot.channels.get("443931385577865237");
	await tchannel.bulkDelete(100)
	let ttchannel = bot.channels.get("443931386458406923");
	await ttchannel.bulkDelete(100)
	await bot.user.setActivity(" IDK", { type: "PLAYING" });
	logsfile.run(bot);
	bot.channels.get("443931383866458123").fetchMessages({ limit: 100 }).then(messagesFetched => {
		var muteGuild;
		var muteUser;
		var timeUntilUnmute;
		messagesFetched.forEach(msg => {
			if (msg.author.id === "419881218784493588") {
				muteGuild = bot.guilds.get(msg.content.split(" ")[0]);
				if(!muteGuild) return;
				muteUser = msg.content.split(" ")[1];
				timeUntilUnmute = parseInt(msg.content.split(" ")[2]);
				if (timeUntilUnmute <= Date.now()) {
					msg.delete()
						.catch(function() {});
					muteGuild.members.get(muteUser)
						.removeRole(muteGuild.roles.find("name", "Muted"));
				} else {
					setTimeout(() => {
						muteGuild.members.get(muteUser)
							.removeRole(muteGuild.roles.find("name", "Muted"));
						msg.delete()
							.catch(function() {});
					}, timeUntilUnmute - Date.now());
				}
			}
		});
	});
});
bot.on("guildMemberAdd", async member => {
	var dbguild = bot.guilds.get("443929284411654144");
	var dbchannels = dbguild.channels.filter(channel => channel.name.includes("autoroles-database"));
	if (dbchannels != null) {
		dbchannels.forEach(dbchannel => {
			dbchannel.fetchMessages({ limit: 100 }).then(messages => {
					messages.forEach(async msg => {
						if (msg.content.startsWith(`${member.guild.id}`)) {
							var msgargs = msg.content.split(" ")
								.slice(1);
							member.addRoles(msgargs.map(role => member.guild.roles.get(role)));
						}
					});
				});
		});
	}
	var announcerchannel = bot.channels.get("443931378011078666");
	var announcermsgs = await announcerchannel.fetchMessages({ limit: 100 });
	var announcermsg = announcermsgs.find(m => m.content.startsWith(member.guild.id));
	if (!announcermsg) return;
	//guildid | toggle | channel | avatar | footer | hellomsg | goodbyemsg
	var settings = announcermsg.content
	var togglesetting = settings.split("|")[1].trim()
	var channelsetting = settings.split("|")[2].trim()
	var avatarsetting = settings.split("|")[3].trim()
	var footersetting = settings.split("|")[4].trim()
	var hellomsg = settings.split("|")[5].trim()
	var byemsg = settings.split("|")[6].trim()
	if (togglesetting === "false") return;
	if (channelsetting === "none") return;
	if (hellomsg !== "none") {
		var himessage = hellomsg.replace(/{user.mention}/gi, member.user.toString());
		himessage = himessage.replace(/{user}/gi, member.user.toString());
		himessage = himessage.replace(/{user.tag}/gi, member.user.tag);
		himessage = himessage.replace(/{user.discriminator}/gi, member.user.discriminator);
		himessage = himessage.replace(/{user.discrim}/gi, member.user.discriminator);
		himessage = himessage.replace(/{user.username}/gi, member.user.username);
		himessage = himessage.replace(/{user.name}/gi, member.user.username);
		himessage = himessage.replace(/{user.nickname}/gi, member.displayName);
		himessage = himessage.replace(/{user.nick}/gi, member.displayName);
		himessage = himessage.replace(/{user.id}/gi, member.user.id);
		himessage = himessage.replace(/{user.status}/gi, member.user.presence.status);
		if (member.user.presence.game) {
			himessage = himessage.replace(/{user.game}/gi, member.user.presence.game.name);
		} else {
			himessage = himessage.replace(/{user.game}/gi, "None");

		}
		himessage = himessage.replace(/{guild.id}/gi, member.guild.id);
		himessage = himessage.replace(/{guild.name}/gi, member.guild.name);
		himessage = himessage.replace(/{guild.membercount}/gi, member.guild.memberCount.toString());
	} else {
		var himessage = `Welcome to ${member.guild.name}, ${member.user.toString()}! Have a good time here!`;
	}
	var welcomeMessage = new Discord.RichEmbed()
		.setTitle("Welcome")
		.setColor("#ffa500")
		.setDescription(himessage);
	if (footersetting === "true") welcomeMessage.setFooter(`${member.guild.name} is now at ${member.guild.memberCount} members!`);
	if (avatarsetting === "true") welcomeMessage.setThumbnail(member.user.displayAvatarURL);
	var channeltosend = bot.channels.find(`id`, channelsetting)
	if (!channeltosend) return;
	channeltosend.send({
			embed: welcomeMessage
		})
		.catch(() => {
			welcomeMessage.setThumbnail(null);
			channeltosend.send({
					embed: welcomeMessage
				})
				.catch(function() {});
		});
});
bot.on("guildMemberRemove", async member => {
	var announcerchannel = bot.channels.get("443931378011078666");
	var announcermsgs = await announcerchannel.fetchMessages({
		limit: 100
	})
	var announcermsg = announcermsgs.find(m => m.content.startsWith(member.guild.id));
	if (!announcermsg) return;
	//guildid | toggle | channel | avatar | footer | hellomsg | goodbyemsg
	var settings = announcermsg.content
	var togglesetting = settings.split("|")[1].trim()
	var channelsetting = settings.split("|")[2].trim()
	var avatarsetting = settings.split("|")[3].trim()
	var footersetting = settings.split("|")[4].trim()
	var hellomsg = settings.split("|")[5].trim()
	var byemsg = settings.split("|")[6].trim()
	if (togglesetting === "false") return;
	if (channelsetting === "none") return;
	if (byemsg !== "none") {
		var byemessage = byemsg.replace(/{user.mention}/gi, member.user.toString());
		byemessage = byemessage.replace(/{user}/gi, member.user.toString());
		byemessage = byemessage.replace(/{user.tag}/gi, member.user.tag);
		byemessage = byemessage.replace(/{user.discriminator}/gi, member.user.discriminator);
		byemessage = byemessage.replace(/{user.discrim}/gi, member.user.discriminator);
		byemessage = byemessage.replace(/{user.username}/gi, member.user.username);
		byemessage = byemessage.replace(/{user.name}/gi, member.user.username);
		byemessage = byemessage.replace(/{user.nickname}/gi, member.displayName);
		byemessage = byemessage.replace(/{user.nick}/gi, member.displayName);
		byemessage = byemessage.replace(/{user.id}/gi, member.user.id);
		byemessage = byemessage.replace(/{user.status}/gi, member.user.presence.status);
		if (member.user.presence.game) {
			byemessage = byemessage.replace(/{user.game}/gi, member.user.presence.game.name);
		} else {
			byemessage = byemessage.replace(/{user.game}/gi, "None");

		}
		byemessage = byemessage.replace(/{guild.id}/gi, member.guild.id);
		byemessage = byemessage.replace(/{guild.name}/gi, member.guild.name);
		byemessage = byemessage.replace(/{guild.membercount}/gi, member.guild.memberCount.toString());
	} else {
		var byemessage = `Sad to see you leave ${member.user.toString()}.`
	}
	var goodbyeMessage = new Discord.RichEmbed()
		.setTitle("Goodbye")
		.setColor("#0000ff")
		.setDescription(byemessage);
	if (footersetting === "true") goodbyeMessage.setFooter(`${member.guild.name} is now at ${member.guild.memberCount} members!`);
	if (avatarsetting === "true") goodbyeMessage.setThumbnail(member.user.displayAvatarURL);
	var channeltosend = bot.channels.find(`id`, channelsetting)
	if (!channeltosend) return;
	channeltosend.send({ embed: goodbyeMessage }).catch(() => {
			goodbyeMessage.setThumbnail(null);
			channeltosend.send({ embed: goodbyeMessage }).catch(function() {});
		});
})
bot.on("guildCreate", async guilda => {
	let hello = new Discord.RichEmbed()
		.setTitle("Thanks For Adding Me To Your Server!!")
		.setColor("#0000ff")
		.setDescription("Thanks for adding Mr.W Bot to your server he is a very helpful bot! This bot is owned by Windows 10 > MacOS#0001 and was made by the epic @ethanlaj and @gt_c For all the cmds run !!help however if u need any help join our support server https://discord.gg/UC37qGN");
	let hichannels = guilda.channels.filter(c => c.type === "text");
	let ahichannels = hichannels.filter(c => c.permissionsFor(bot.user)
		.has("READ_MESSAGES"));
	let fhichannel = ahichannels.filter(c => c.permissionsFor(bot.user)
		.has("SEND_MESSAGES"));
	let hichannel = fhichannel.first();
	if (hichannel) {
		await hichannel.send(hello);
	}
	if (bot.counter) await bot.user.setActivity(`${bot.guilds.size} servers`, { type: "WATCHING" });
});

bot.on("guildDelete", guildo => {
	if (bot.counter) bot.user.setActivity(`${bot.guilds.size} servers`, { type: "WATCHING" });
});

bot.on("message", async message => {
	if (message.channel.type === "dm") return;
	if (message.channel.id === "443931385577865237") await message.delete(120000)
	if ((message.content.endsWith("messages that were not over two weeks old!")) && (message.author.bot)) {
		message.delete(5000);
	}
	if ((message.content.endsWith("just talk again!")) && (message.author.bot)) {
		message.delete(5000);
	}
	if ((message.content.endsWith("**MUST WAIT TO USE REPORT COMMAND**")) && (message.author.bot) && (message.channel.id === "443931386458406923")) {
		message.delete(300000);
	}
	if ((message.content.endsWith("Your AFK status was removed.")) && (message.author.bot)) {
		message.delete(5000);
	}
	if ((message.content.includes("This user is currently AFK!")) && (message.author.bot)) {
		message.delete(5000);
	}
	if (message.author.bot === false) {
		let channel = bot.channels.find(`id`, "443931374940979208");
		let messages = await channel.fetchMessages({ limit: 100 });
		let array = messages.filter(m => RegExp(message.author.id, "gi").test(m.content));
		let first = array.first();
		if (first) {
			first.delete();
			message.reply("Welcome back! Your AFK status was removed.");
		}
	}
	if (message.author.bot) return;
	let messageArray = message.content.split(" ");
	let cmd = messageArray[0].toLowerCase();
	if (!cmd) return;
	let args = messageArray.slice(1);
	let content = args.join(" ");
	if (message.author.bot === false) {
		let mentions = message.mentions.members.first();
		if (mentions) {
			let channel = bot.channels.get("443931374940979208");
			let messages = await channel.fetchMessages({ limit: 100 });
			let array = messages.filter(m => RegExp(mentions.id, "gi").test(m.content));
			let first = array.first();
			if (first) {
				let afkmsg = first.content.substr(mentions.id.length);
				message.reply(`This user is currently AFK!\nAFK Message: \`${afkmsg}\``);
			}
		}
	}
	let guildid = message.guild.id;
	let dbguild = bot.guilds.get("443929284411654144");
	let channels = dbguild.channels.filter(m => RegExp("wbotprefixes-database", "gi").test(m.name));
	async function getPrefix(bot, message, args) {
		const nestedMessages = await Promise.all(channels.map(ch => ch.fetchMessages({ limit: 100 })));
		const flatMessages = nestedMessages.reduce((a, b) => a.concat(b));
		const msg = flatMessages.find(msg => msg.content.startsWith(message.guild.id));
		return msg && msg.content.substr(1 + message.guild.id.length);
	}
	const aprefix = await getPrefix(bot, message, args);
	if (aprefix) var prefix = aprefix;
	//console.log(`${prefix} second`);
	if (!aprefix) var prefix = botconfig.prefix;
	// console.log(`${prefix} third`);
	if ((message.isMemberMentioned(bot.user)) && (message.content.endsWith("prefix"))) {
		return message.reply(`My prefix is \`${prefix}\``);
	}
	if ((message.isMemberMentioned(bot.user)) && (message.content.endsWith("prefix reset")) && (message.member.hasPermission("MANAGE_GUILD"))) {
		let aaa = dbguild.channels.filter(m => RegExp("wbotprefixes-database", "gi").test(m.name));
		aaa.forEach(chl => {
			chl.fetchMessages({ limit: 100 }).then(msgs => {
					msgs.forEach(msg => {
						if (msg.content.startsWith(`${message.guild.id}`)) {
							msg.delete();
						}
					})
				})
		})
		message.react("\u2705");
	}
	if (!message.content.startsWith(prefix)) return;
	var commandfile = false;
	bot.commands.forEach(command => {
		let aliases = command.help.aliases;
		if (aliases == undefined) aliases = [];
		aliases.push(command.help.name);
		if (aliases.includes(cmd.slice(prefix.length))) commandfile = command;
	});
	if (!commandfile) return;
	var commandname = commandfile.help.name.toLowerCase();
	//console.log(commandname)
	let achannels = dbguild.channels.filter(m => RegExp("wbotdisable-database", "gi").test(m.name));
	async function checkIfDisabled(bot, message, args, commandname, achannels) {
		const nestedMessages = await Promise.all(achannels.map(ch => ch.fetchMessages({ limit: 100 })))
		const flatMessages = nestedMessages.reduce((a, b) => a.concat(b))
		const msg = flatMessages.find(msg => msg.content.startsWith(`${message.guild.id}`))
		if (!msg) {
			return (false)
		}
		if (msg) {
			var commands = msg.content.split(" ");
			// ["guild_id", "command", "command", "command"];
			if (commands.shift() === message.guild.id) {
				// ["command", "command", "command"];
				if (commands.includes(commandname)) {
					return (true)
				} else {
					return (false)
				}
			}
		}
	}
	var disablecheck = await checkIfDisabled(bot, message, args, commandname, achannels);
	if (disablecheck) return message.reply("This command is disabled by an admin in this server!")
	return commandfile.run(bot, message, args, prefix, content);
});
bot.login(botconfig.token);
