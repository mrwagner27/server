const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix, content) => {
        
        let msg = message.cleanContent
        let msssg = msg.substr(message.content.length - content.length)
        message.channel.send(msssg)
        message.delete()
}
module.exports.help = {
        name: "say"
}
