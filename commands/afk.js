module.exports.run = async (bot, message, args, prefix, content) => {
        let afkmsg = args.join(" ");
        if (!afkmsg) afkmsg = "No reason provided.";
        let channel = bot.channels.get("443931374940979208");
        channel.send(`${message.author.id} ${afkmsg}`).catch(function() {});
        message.reply(`You are now AFK!!!: \`${afkmsg}\`\nTo become un-AFK, just talk again.`).catch(function() {});
        message.delete().catch(function() {});
}
module.exports.help = {
        name: "afk"
}
