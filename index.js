const API = require("node-telegram-bot-api");
const TOKEN = "6960308977:AAHtU-MnX30MXkg2_j0a9Lzu5T9kQq50mKI";
const bot = new API(TOKEN, { polling: true });
const { gameOptions, tryAgainGameOption } = require("./options.js");

const chats = {};

const startGame = async (chatID) => {
  await bot.sendMessage(chatID, "guess number form 0 to 9");
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatID] = randomNumber;
  await bot.sendMessage(chatID, "try", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "greeting" },
    { command: "/info", description: "info" },
    { command: "/game", description: "game" },
  ]);

  bot.on("message", async (msg) => {
    const chatID = msg.chat.id;
    const text = msg.text;

    if (text === "/start") {
      return bot.sendMessage(chatID, "welcome");
    } else if (text === "/info") {
      return bot.sendMessage(chatID, "info");
    } else if (text === "/game") {
      return startGame(chatID);
    } else {
      return bot.sendMessage(chatID, "unknown command");
    }
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatID = msg.message.chat.id;
    if (data == chats[chatID]) {
      return bot.sendMessage(
        chatID,
        "you guess the number!",
        tryAgainGameOption
      );
    } else if (data === "/again") {
      return startGame(chatID);
    } else {
      return bot.sendMessage(chatID, "you didn't guess");
    }
  });
};

start();
