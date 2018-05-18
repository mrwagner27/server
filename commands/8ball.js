const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix, content) => {
        var responses = [" no.", " highly unlikely.", " very doubtful.", " you wish.", " don't count on it", " probably.", " most definitely", " yes.", " highly likely.", " of course."
             , " ask again later.", " outlook not so good, retry.", " ask again later.", " better not tell you now."];
        var randomchoice = Math.floor(Math.random() * responses.length);
        message.reply("The 8ball says... " + "" + responses[randomchoice] + "");
}
module.exports.help = {
        name: "8ball"
}
