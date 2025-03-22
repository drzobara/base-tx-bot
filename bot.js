const TelegramBot = require("node-telegram-bot-api");

// Replace with your Telegram bot token
const bot = new TelegramBot("7920895132:AAE5dbNTIqFRgCT3PufZGYvHjeScZr69h94", { polling: true });

// Command: /send
bot.onText(/\/send/, (msg) => {
  const chatId = msg.chat.id;

  // Step 1: Ask for the recipient's address
  bot.sendMessage(chatId, "Please enter the recipient's wallet address:");
  bot.once("message", (msg) => {
    const toAddress = msg.text;

    // Step 2: Ask for the amount to send
    bot.sendMessage(chatId, "How much ETH would you like to send?");
    bot.once("message", async (msg) => {
      const amount = msg.text;

      // Step 3: Provide instructions for sending the transaction
      const instructions = `
To send ${amount} ETH to ${toAddress}, follow these steps:

1. Open your wallet (e.g., MetaMask).
2. Send ${amount} ETH to the following address:
   \`${toAddress}\`
3. Once the transaction is complete, send the transaction hash (Tx Hash) here.
      `;

      bot.sendMessage(chatId, instructions, { parse_mode: "Markdown" });

      // Step 4: Wait for the Tx Hash
      bot.once("message", (msg) => {
        const txHash = msg.text;
        bot.sendMessage(chatId, `Transaction confirmed! Tx Hash: \`${txHash}\``, { parse_mode: "Markdown" });
      });
    });
  });
});
