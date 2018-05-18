const Discord = require("discord.js");
var google = require('google')
google.resultsPerPage = 51
module.exports.run = async (bot, message, args, prefix, content) => {
       if(!args[0]) return message.reply("You must provide a search query!")
       google(content, function (err, res){
  if (err) console.error(err)
             if(!res.links[0]) return message.reply("Couldn't find anything with this search query!")
              var i = 0
              var link;
              while(i <= 50) {
               link = res.links[i]
               if((link.title) && (link.description) && (link.link)) {
                      let embed = new Discord.RichEmbed()
                       .setTitle("Result")
                .setColor("#000080")
                .addField("Title", link.title)
                .addField("Link", link.link)
                .addField("Description", link.description)
                .setFooter(`Requested by ${message.author.tag}`);
                      return message.channel.send(embed)
                      }
                     i++
              }
              return message.reply("Couldn't find enough information with this search!")

 

})
}
module.exports.help = {
        name: "google"
}
