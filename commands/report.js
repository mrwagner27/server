const Discord = require("discord.js");
async function awaitReply(message, question, limit = 300000) {
        const filter = m => m.author.id === message.author.id;
        await message.author.send(question);
        try {
                const collected = await message.author.dmChannel.awaitMessages(filter, {
                        max: 1
                        , time: limit
                        , errors: ['time']
                });
                return collected.first()
                        .content;
        } catch (error) {
                return message.author.send("**Prompt Cancelled -- There Was No Response After Five Minutes**");
        }
}

module.exports.run = async (bot, message, args) => {
         
        let timeoutchannel = bot.channels.get("443931386458406923");
        let reportchannel = bot.channels.get("424014842106740737");
        let blacklistchannel = bot.channels.get("443931370968973312");
        let tmessages = await timeoutchannel.fetchMessages({
                limit: 100
        });
        let bmessages = await blacklistchannel.fetchMessages({
                limit: 100
        });
        let barray = bmessages.filter(m => RegExp(message.author.id, "gi")
                .test(m.content));
        let auser = barray.first();
        if (auser) return message.reply("You cannot use this command because you are blacklisted!");
        let carray = tmessages.filter(m => RegExp(message.author.id, "gi")
                .test(m.content));
        let cuser = carray.first();
        if (cuser) return message.reply("You cannot use this command because you just used it! To avoid spam, you must wait five minutes from the last time you used this command! If you are already in the process of using this command, you must cancel this prompt!");
        timeoutchannel.send(`${message.author.id}, ${message.author.username}#${message.author.discriminator}\n**MUST WAIT TO USE REPORT COMMAND (IP)**`)
        let ttchannel = bot.channels.get("443931386458406923")
        let ttmessages = await ttchannel.fetchMessages({
                limit: 100
        })
        let darray = ttmessages.filter(m => RegExp(message.author.id, "gi")
                .test(m.content));
        let duser = darray.first();
        try {
                await message.author.send("Welcome to the bug/glitch reporting prompt! Please provide as much information as possible. If you abuse this system, you will be blacklisted!\n-----------------------------------------")
        } catch (e) {
                return await message.reply("Couldn't DM you the prompt, please check your privacy settings and try again!")
        }
        message.react("\u2705");
        message.channel.send(`${message.author}, Prompt will continue in DMs! \uD83D\uDCEC`);
        const game = await awaitReply(message, "What is the name of the game you are reporting? **BE AS DETAILED AS POSSIBLE!** \nSay **cancel** to cancel prompt.", 300000);
        if (game.toLowerCase() === "cancel") {
                duser.delete()
                return message.author.send("**Prompt Cancelled**")
        }
        if (game === "**Prompt Cancelled -- There Was No Response After Five Minutes**") return duser.delete()
        const proof = await awaitReply(message, `Do you have any proof of this bug/glitch? Send **only links** to prove this bug/glitch exists. If you have no proof, say **skip**.\nSay **cancel** to cancel prompt.`, 300000);
        if (proof.toLowerCase() === "cancel") {
                duser.delete()
                return message.author.send("**Prompt Cancelled**");
        }
        if (proof === "**Prompt Cancelled -- There Was No Response After Five Minutes**") return duser.delete();
        const describe = await awaitReply(message, "How can you reproduce this bug/glitch? Describe **IN DETAIL**.\nSay **cancel** to cancel prompt.", 300000);
        if (describe.toLowerCase() === "cancel") {
                duser.delete();
                return message.author.send("**Prompt Cancelled**");
        }
        if (describe === "**Prompt Cancelled -- There Was No Response After Five Minutes**") return duser.delete();
        const confirm = await awaitReply(message, `**The following information will be sent:**\nGame Name: ${game}\nProof Of Bug/Glitch: ${proof}\nHow To Reproduce This Bug/Glitch: ${describe}\n---------------------------------------\nSay **confirm** to send the report.\nSay **cancel** to cancel the prompt.`, 300000);
        if (confirm.toLowerCase() === "cancel") {
                duser.delete();
                return message.author.send("**Prompt Cancelled**");
        }
        if (confirm === "**Prompt Cancelled -- There Was No Response After Five Minutes**") return duser.delete();
        let invite = await message.channel.createInvite({
                maxAge: 0
        })
        let reportEmbed = new Discord.RichEmbed()
                .setTitle("New Bug/Glitch Report")
                .setColor("#FF0000")
                .addField("Guild Reported From", message.guild.name)
                .addField("Reported User's ID", message.author.id)
                .addField("Invite To Guild", invite)
                .addField("Time Reported", message.createdAt)
                .addField("Reported Game", game)
                .addField("Reporter's Discord Username", message.author)
                .addField("Proof Of Bug/Glitch", proof)
                .addField("How To Reproduce Bug/Glitch", describe);
        reportchannel.send(reportEmbed);
        duser.delete()
        timeoutchannel.send(`${message.author.id}, ${message.author.username}#${message.author.discriminator}\n**MUST WAIT TO USE REPORT COMMAND**`);
        message.author.send("\u2705 **Successfully Submitted! -- Your Response Was Submitted And Will Be Reviewed By Our Staff Shortly!** \u2705");
        return;
}
module.exports.help = {
        name: "report"
}
