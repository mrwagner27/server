const Discord = require("discord.js");
module.exports.run = async (bot, message, args) => {
        let guild = bot.guilds.get("410400562232819723")
        let member = await guild.fetchMember(message.author.id)
        if (!member) return;
        if (member.roles.get("410546480307503124") //mod
                || member.roles.get("410611296401358848") //admin
                || member.roles.get("410608939139334184") //coowner
                || member.roles.get("410481036162760722")) { //owner 
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
                        if (auser) {
                                auser.delete()
                                message.react("\u2705")
                        } else return message.reply("This user is not blacklisted!")
                } else {
                        let darray = messages.filter(m => RegExp(pingeduser.id, "gi")
                                .test(m.content));
                        let buser = darray.first();
                        if (buser) {
                                buser.delete()
                                message.react("\u2705")
                        } else return message.reply("This user is not blacklisted!")
                }
        }
}
module.exports.help = {
        name: "unblacklist"
}
