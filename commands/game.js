const Discord = require("discord.js");
var games = ["number", "tictactoe", "connect4"];

async function awaitReply(message, question, limit = 60000){
	const filter = m => m.author.id === message.author.id;
	await message.channel.send(`${message.author}, ${question}`);
	try {
		const collected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
		return collected.first();
	} catch (error) {
		return false;
	}
}

function getRow(rows, number) {
  var numberLoop = 1;
  while (numberLoop !== rows.length) {
    if (rows[numberLoop][number] !== "⚫") return numberLoop;
    numberLoop = numberLoop + 1;
  }
}


module.exports.run = async (bot, message, args, prefix, content) => {
  var input;
  if (args[0] == "" || args[0] == undefined || args[0] == null) {
    input = "That";
  } else {
    input = args[0];
  }
	if (games.includes(input)) {
    if (input.toLowerCase() === "number") {
      var number = await awaitReply(message, "What should the number go up to? Minimum: `50`. Maximum: `1000`.", 30000);
      if (!isNaN(parseInt(number))) {
        number = parseInt(number);
        if (number < 50) return message.reply("Number must be above 50. Please retry the command.");
        if (number > 1000) return message.reply("Number must be below 1000. Please retry the command.");
        var randomNumber = Math.floor(Math.random() * number);
        var guessNumber = 0;
        var guesses = Math.floor(number/14);
        while (guesses !== 0) {
          var guessNumber = await awaitReply(message, `Guess the number (1-${number}). You have ${guesses} guesses left.\n\n Say \`cancel\` to cancel this prompt.`, 60000);
          if (!isNaN(parseInt(guessNumber))) {
            if (guessNumber < 1) {
              message.reply(`${guessNumber} is below 1. Did you think that would work? Please try again (a guess has not been deducted).`);
            } else if (guessNumber > number) {
              return message.reply(`${guessNumber} is above ${number}. Did you think that would work? Please try again (a guess has not been deducted).`);
            } else {
              var endMessage = "";
              if (parseInt(guessNumber) === randomNumber) {
                message.reply(`You guessed the number \`${randomNumber}\`, with ${guesses-1} guesses left!`);
                guesses = 0;
              } else if (parseInt(guessNumber) > randomNumber) {
                guesses = guesses-1;
                if (guesses === 0) endMessage = `You ran out of guesses. You lose! The number was \`${randomNumber}\``;
                message.reply(`${guessNumber} is higher than the desired number! You have ${guesses} guesses left! ${endMessage}`);
              } else if (parseInt(guessNumber) < randomNumber) {
                guesses = guesses-1;
                if (guesses === 0) endMessage = `You ran out of guesses. You lose! The number was \`${randomNumber}\``;
                message.reply(`${guessNumber} is lower than the desired number! You have ${guesses} guesses left! ${endMessage}`);
              }
            }
          } else {
            if (guessNumber.toLowerCase() == "cancel" || guessNumber.toLowerCase() == "end") {
              message.reply(`Ended the current game. You had \`${guesses}\` guesses left. The number was \`${randomNumber}\`.`);
              guesses = 0;
            }
            if (guesses == 0) return;
            message.reply(`\`${guessNumber}\` is not a valid number. Please try again (a guess has not been deducted).`);
          }
        }
      } else {
        message.reply(`\`${number}\` is not a valid number. Please retry the command.`);
      }
    } else if (input.toLowerCase() == "tictactoe") {
      var opponent = await awaitReply(message, "Who should your opponent be?", 30000);
      let target = message.guild.member(opponent.mentions.users.first() || message.guild.members.get(opponent.content));
  		if (!target) {
  			marray = message.guild.members.filter(m => RegExp(opponent.content, "gi").test(m.displayName));
  			target = marray.first();
  		}
  		if(!target) return message.reply("Couldn't find that user!");
      let turn = [message.author, '❌'];
      var eA = ['1⃣','2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];
      message.channel.send(`:one: | :two: | :three:\n———————\n:four: | :five: | :six:\n———————\n:seven: | :eight: | :nine:\n\n${message.author}'s turn.`).then(async function(msg) {
        var orderLoop = 0;
        while (orderLoop != eA.length) {
          await msg.react(eA[orderLoop]);
          orderLoop = orderLoop+1;
        }
        var endGame = false;
        const filter = (reaction, user) => eA.includes(reaction.emoji.name) && user.id == turn[0].id;
        var reactions = msg.createReactionCollector(filter, { time: 300000 });
        reactions.on('collect', reaction => {
          if (endGame === true) return;
          eA.forEach(emoji => {
            if (emoji !== reaction.emoji.name) return;
            eA.splice(eA.indexOf(emoji), 1, turn[1]);
          });
          function returnWinner(author, message, msg, turn, target) {
            if (turn == author) {
              message.edit(msg.content+`\n\n${target} has won the game!`);
            } else {
              message.edit(msg.content+`\n\n${author} has won the game!`)
            }
            endGame = true;
          }
          if (turn[0] == target) {
            turn = [];
            turn = [message.author, '❌'];
          } else {
            turn = [];
            turn = [target, '⭕'];
          }
          msg.edit(`${eA[0]} | ${eA[1]} | ${eA[2]}\n———————\n${eA[3]} | ${eA[4]} | ${eA[5]}\n———————\n${eA[6]} | ${eA[7]} | ${eA[8]}\n\n${turn[0]}'s turn.`).then(m => {
            if (eA[0] == eA[1] && eA[1] == eA[2]) {
              returnWinner(message.author, m, msg, turn[0], target);
            } else if (eA[3] == eA[4] && eA[4] == eA[5]) {
              returnWinner(message.author, m, msg, turn[0], target);
            } else if (eA[6] == eA[7] && eA[7] == eA[8]) {
              returnWinner(message.author, m, msg, turn[0], target);
            } else if (eA[0] == eA[3] && eA[3] == eA[6]) {
              returnWinner(message.author, m, msg, turn[0], target);
            } else if (eA[1] == eA[4] && eA[4] == eA[7]) {
              returnWinner(message.author, m, msg, turn[0], target);
            } else if (eA[2] == eA[5] && eA[5] == eA[8]) {
              returnWinner(message.author, m, msg, turn[0], target);
            } else if (eA[0] == eA[4] && eA[4] == eA[8]) {
              returnWinner(message.author, m, msg, turn[0], target);
            } else if (eA[2] == eA[4] && eA[4] == eA[6]) {
              returnWinner(message.author, m, msg, turn[0], target);
            } else if (eA[0] !== '1⃣' && eA[1] !== '2⃣' && eA[2] !== '3⃣' && eA[3] !== '4⃣' && eA[4] !== '5⃣' && eA[5] !== '6⃣' && eA[6] !== '7⃣'
							&& eA[7] !== '8⃣' && eA[8] !== '9⃣') {
              m.edit(msg.content+`\n\nNo one won: it's a draw.`);
              endGame = true;
            }
          });
        });
      });
    } else if (input.toLowerCase() == "connect4") {
			if (message.mentions.users.first() !== undefined) {
	      if (message.mentions.users.first().id !== message.author.id) {
	        if (!message.mentions.users.first().bot) {
	          var target = message.mentions.users.first();
	          const eA = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣"];
	          var rows = [eA, ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"], ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"], ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"],
	            ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"], ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"], ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"]];
	          var connectFourEmbed = new Discord.RichEmbed().setColor(0x00AE86).setTitle("Connect Four").setFooter(`${message.author.tag}'s turn.`);
	          connectFourEmbed.setDescription(`🔴 = ${message.author.tag}\n🔵 = ${target.tag}\n\n` + rows.map(row => row.join(" ")).join("\n"));
	          message.channel.send({ embed: connectFourEmbed}).then(async function(connectFour) {
	            var orderLoop = 0;
	      			while (orderLoop != eA.length) {
	      				await connectFour.react(eA[orderLoop]);
	      				orderLoop = orderLoop + 1;
	      			}
	            var turn = message.author.id;
	            const filter = (reaction, user) => (user.id === message.author.id || user.id === target.id) && eA.includes(reaction.emoji.name);
	            const collector = connectFour.createReactionCollector(filter, { time: 600000 });
	            collector.on("collect", reaction => {
	              reaction.remove(bot.users.get(turn)).catch(function() {});
	              if (reaction.users.last().id === turn) {
	                var currentRow = getRow(rows, eA.indexOf(reaction.emoji.name));
	                if (currentRow == null) currentRow = 6; else currentRow = currentRow - 1;
	                if (currentRow !== 0) {
	                  if (turn === message.author.id) {
	                    rows[currentRow][eA.indexOf(reaction.emoji.name)] = "🔴";
	                    turn = target.id;
	                    connectFourEmbed.setFooter(`${target.tag}'s turn.`);
	                  } else {
	                    rows[currentRow][eA.indexOf(reaction.emoji.name)] = "🔵";
	                    turn = message.author.id;
	                    connectFourEmbed.setFooter(`${message.author.tag}'s turn.`);
	                  }
	                  connectFour.edit({ embed: connectFourEmbed.setDescription(`🔴 = ${message.author.tag}\n🔵 = ${target.tag}\n\n` + rows.map(row => row.join(" ")).join("\n")) });
	                  var noRepeat = false;
	                  rows.forEach(function(row, indexOfRow) {
	                    row.forEach(function(coin, indexOfCoin) {
	                      if (coin !== "⚫" && coin === row[indexOfCoin + 1] &&
	                        row[indexOfCoin + 1] === row[indexOfCoin + 2] &&
	                        row[indexOfCoin + 2] === row[indexOfCoin + 3]) {
	                          if (noRepeat === false) {
	                            message.channel.send(`${coin} won the game!`).catch(function() {});
	                            noRepeat = true;
	                          }
	                          collector.stop(`${coin} won the game!`);
	                        }
	                      if (rows[indexOfRow + 1] !== undefined && rows[indexOfRow + 2] !== undefined && rows[indexOfRow + 3] !== undefined) {
	                        if (coin !== "⚫" && coin === rows[indexOfRow + 1][indexOfCoin] &&
	                          rows[indexOfRow + 1][indexOfCoin] === rows[indexOfRow + 2][indexOfCoin] &&
	                          rows[indexOfRow + 2][indexOfCoin] === rows[indexOfRow + 3][indexOfCoin]) {
	                            if (noRepeat === false) {
	                              message.channel.send(`${coin} won the game!`).catch(function() {});
	                              noRepeat = true;
	                            }
	                            collector.stop(`${coin} won the game!`);
	                          }
	                      }
	                      if (rows[indexOfRow - 1] !== undefined && rows[indexOfRow - 2] !== undefined && rows[indexOfRow - 3] !== undefined) {
	                        if (coin !== "⚫" && coin === rows[indexOfRow - 1][indexOfCoin + 1] &&
	                          rows[indexOfRow - 1][indexOfCoin + 1] === rows[indexOfRow - 2][indexOfCoin + 2] &&
	                          rows[indexOfRow - 2][indexOfCoin + 2] === rows[indexOfRow - 3][indexOfCoin + 3]) {
	                            if (noRepeat === false) {
	                              message.channel.send(`${coin} won the game!`).catch(function() {});
	                              noRepeat = true;
	                            }
	                            collector.stop(`${coin} won the game!`);
	                          }
	                      }
	                      if (rows[indexOfRow + 1] !== undefined && rows[indexOfRow + 2] !== undefined && rows[indexOfRow + 3] !== undefined) {
	                        if (coin !== "⚫" && coin === rows[indexOfRow + 1][indexOfCoin + 1] &&
	                          rows[indexOfRow + 1][indexOfCoin + 1] === rows[indexOfRow + 2][indexOfCoin + 2] &&
	                          rows[indexOfRow + 2][indexOfCoin + 2] === rows[indexOfRow + 3][indexOfCoin + 3]) {
	                            if (noRepeat === false) {
	                              message.channel.send(`${coin} won the game!`).catch(function() {});
	                              noRepeat = true;
	                            }
	                            collector.stop(`${coin} won the game!`);
	                          }
	                      }
	                    });
	                  });

	                  if (rows.slice(1).map(row => row.every(coin => coin !== "⚫")).every(row => row === true)) {
	                    noRepeat = true;
	                    message.channel.send(`No one won. It was a draw.`).catch(function() {});
	                    collector.stop("No one won. It was a draw.")
	                  }
	                }
	              }
	            });
	            collector.on("end", (_, reason) => connectFour.edit(`Interactive command ended: ${reason}`));
	          }).catch(function() {});
	        } else {
	          message.reply("You can not play this game with a bot.").catch(() => {
	            message.author.send(`You attempted to use the \`row4\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
	          });
	        }
	      } else {
	        message.reply("You can not play this game with yourself.").catch(() => {
	          message.author.send(`You attempted to use the \`row4\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
	        });
	      }
	    } else {
	      message.reply("Please specify a valid user. Example: `!!game row4 @gt_c`.").catch(() => {
	        message.author.send(`You attempted to use the \`row4\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
	      });
	    }
		}
  } else {
    var gameList = "";
    games.forEach(game => {
      gameList = gameList+`\`${game}\`, `;
    });
    if (input.toLowerCase() !== "that") input = `\`${input}\``
    gameList = gameList.slice(0, -2)+".";
    message.reply(`${input} is not a valid game option. Possible game choices are: ${gameList}`);
  }
}
module.exports.help = {
	name: "game",
	category: "Fun",
	desc: "Allows the user to play the game specified in the first parameter."
}
