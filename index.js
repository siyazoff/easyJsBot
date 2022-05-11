const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = "5017293138:AAE1_wgaSXdk1A70xC0UXzT_mryNrywy4Fo";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Сейчас я загадаю цифру от 0 до 9, попробуйте угадать!`
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, `Отгадывай`, gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Hello message" },
    { command: "/info", description: "Information" },
    { command: "/game", description: "Game" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      return bot.sendMessage(chatId, `Первый JS бот на селе`);
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.chat.first_name} ${msg.from.last_name}`
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, `Я не понял, еще раз`);
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }

    if (data == chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Поздравляю ты отгодал цифру ${chats[chatId]} `,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Ты не угадал, я загадал цифру ${chats[chatId]} `,
        againOptions
      );
    }
  });
};

start();
