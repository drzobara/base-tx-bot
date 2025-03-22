const TelegramBot = require("node-telegram-bot-api");
const { ethers } = require("ethers");

// Replace with your Telegram bot token
const bot = new TelegramBot("7920895132:AAE5dbNTIqFRgCT3PufZGYvHjeScZr69h94", { polling: true });

// Replace with your RPC URL from environment variables
const rpcUrl = process.env.RPC_URL || "https://goerli.base.org"; // Fallback to Base Goerli if not set
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

// Replace with your private key from environment variables
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

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

      try {
        // Step 3: Send the transaction
        const tx = await wallet.sendTransaction({
          to: toAddress,
          value: ethers.utils.parseEther(amount),
        });

        // Step 4: Confirm the transaction
        bot.sendMessage(chatId, `Transaction sent! Tx Hash: \`${tx.hash}\``, { parse_mode: "Markdown" });
      } catch (error) {
        bot.sendMessage(chatId, "Error sending transaction. Please try again.");
      }
    });
  });
});
