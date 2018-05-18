const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  let target = message.guild.member(message.mentions.users.first());
  if (target) {
    if(message.member.hasPermission("KICK_MEMBERS") || message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("BAN_MEMBERS")) {
      var dbguild = bot.guilds.get("417149156193337344");
      var dbchannels = dbguild.channels.filter(m => RegExp("warn-database", "gi").test(m.name));
      var warns = [];
      var warn2clear = args[1];
      if (isNaN(warn2clear)) return message.reply(`Expected number, got ${warn2clear}.`)
      var warningnum = 0;
      var channelloop = 0;
      var messageloop = 0;
      dbchannels.forEach(dbchannel => {
        dbchannel.fetchMessages({ limit: 100 }).then(messages => {
          messages.forEach(msg => {
            if (msg.content.startsWith(`${message.guild.id} ${target.id}`)) {
              warningnum = warningnum+1;
              warns.push(`${msg.id} ${warningnum}`);
            }
            messageloop = messageloop+1;
            if (messageloop == messages.size) {
              messageloop = 0;
              channelloop = channelloop+1;
              if (channelloop == dbchannels.size) {
                if (warningnum == 0) return message.reply("There are no warnings on this user!");
                warns.forEach(warn => {
                  if (warn.substr(19) == warn2clear) {
                    dbchannels.forEach(dbchannel2 => {
                      dbchannel2.fetchMessage(warn.substring(0, 19)).then(msg => {
                        var reason = msg.content.substr(message.guild.id.length+target.id.length+20);
                        var user = bot.users.get(msg.content.substr(38).slice(0, -reason.length));
                        msg.delete();
                        message.reply(`${message.author}, Sucessfully removed warning \`${warn2clear}\`: \`${reason}\` on \`${target.user.username}\` by \`${user.tag}\``);
                      	var logsDatabase = bot.channels.find("id", "443931379907166210");
			logsDatabase.fetchMessages({ limit: 100 }).then(logmessages => {
				logmessages.forEach(msg => {
					var logChannel = bot.channels.get(msg.content.split(" ")[1]);
					if (logChannel == undefined) return msg.delete();
					var logGuild = logChannel.guild;
					if (logGuild == undefined) return msg.delete();
					if (`${logGuild.id}` === `${message.guild.id}`) {
						const rwarnEmbed = new Discord.RichEmbed()
							.setTitle("Removed Warning")
							.setColor("RED")
							.addField("Removed Warning Information", `Member Removed Warning From's ID: \`${target.id}\`\nMember Removed Warning From: ${target}\nRemoved At: \`${new Date(Date.now())}\`\nModerator: ${message.author}\nWarning Number: \`${warn2clear}\`\nWarning Reason: \`${reason}\``)
						logChannel.send({ embed: rwarnEmbed }).catch(function() {});
					}
				});
			});
                      });
                    });
                  }
                });
              }
            }
          });
        });
      });
    } else {
      message.reply("Insufficent permissions.");
    }
  } else {
    message.reply("Please **mention** a valid user.");
  }
}
module.exports.help = {
  name: "removewarn"
}
