const axios = require("axios");
const express = require("express");
const {Telegraf} = require("telegraf");
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const bot = new Telegraf(process.env.BOT_TOKEN);

const app = express();
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

const getCompliment = async () => {
    const req = await axios.get("https://complimentr.com/api");
    const res = req.data;
    return res;
}

const getCat = async () => {
    const req = await axios.get("https://api.thecatapi.com/v1/images/search");
    const resp = req.data[0].url;
    return resp;
}

const sendWithInterval = async (ctx) => {
    setInterval(async () => {
        const cat = await getCat();
        const compl = await getCompliment();
        await ctx.reply("Никита тебя любит")
        await ctx.replyWithPhoto(cat);
        await ctx.reply(compl.compliment);
    }, 3,6e+6)
}


bot.start(async (ctx) => {
    console.log("bot started")
    try {
        const {first_name} = ctx.from;
        await ctx.reply(`Привет, ${first_name}, Сейчас тебе придет комплимент и картинка с котиком и будет приходить каждый час`)
        sendWithInterval(ctx);
    } catch (e){
        console.log(e);
    }
})

bot.launch();

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
})