const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("KICK_MEMBERS") && !message.member.hasPermission("ADMINISTRATOR") && !message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Insufficent permissions.");
  let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!target) return message.channel.send("Please **mention** a valid user.");
  var dbguild = bot.guilds.get("443929284411654144");
  var dbchannels = dbguild.channels.filter(m => RegExp("warn-database", "gi").test(m.name));
  var finalmessage = `**Warnings for ${target.user.username}:**\n`
  var warningnum = 0;
  var channelloop = 0;
  var messageloop = 0;
  dbchannels.forEach(dbchannel => {
    dbchannel.fetchMessages({ limit: 100 }).then(messages => {
      messages.forEach(msg => {
        if (msg.content.startsWith(`${message.guild.id} ${target.id}`)) {
          warningnum = warningnum+1;
          var time = msg.createdAt
          var reason = msg.content.substr(message.guild.id.length+target.id.length+20);
          var user = bot.users.get(msg.content.substr(38).slice(0, -reason.length));
          var msgargs = msg.content.split(" ").slice(1);
          finalmessage = finalmessage+`Warning ${warningnum}: \`${reason}\` by \`${user.tag}\` on \`${time}\`\n`;
        }
        messageloop = messageloop+1;
        if (messageloop == messages.size) {
          messageloop = 0;
          channelloop = channelloop+1;
          if (channelloop == dbchannels.size) {
            if (warningnum == 0) return message.reply("There are no warnings on this user!");
            message.channel.send(finalmessage)
          }
        }
      });
    });
  });
}
module.exports.help = {
  name: "warnings"
}
