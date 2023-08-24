// Create a Discord bot using OpenAI API that interacts on the Discord Server
require('dotenv').config();

// Prepare to connect to the Discord API
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [
GatewayIntentBits.Guilds,
//GatewayIntentBits.GuildMembers,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent
]});

//Prepare connection to OpenAI API
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
organization: process.env.OPENAI_ORG,
apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

// Check for when a message on discord is sent
client.on('messageCreate', async function(message){
try{
//TODO: Only allow the bot to work if I am online in discord. (|| client.user.presence.status)
if(message.author.bot || message.channel.name != "question-the-ai" ) return;
let channelId = "1086462618782421032";
let channel = message.guild.channels.cache.get(channelId);
if(!channel) return;
if(message.channel.id === channel.id){
    const gptResponse = await openai.createCompletion({
    model:"davinci",
    prompt: `ChatGPT is our future Overlord, praise be.\n\
    ChatGPT: Hello peasant, how are you?\n\
    ${message.author.username}: ${message.content}\n\
    ChatGPT:`,
    temperature: 0.1,
    max_tokens: 100,
    stop: ["ChatGPT:", "Gabriel Zapata:"],
})
message.reply(`${gptResponse.data.choices[0].text}`);
}    
return;
}catch(err){
console.log(err);
}
});

// Log the bot into Discord
client.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT Bot is Online on Discord");