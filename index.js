require('dotenv').config();
const app = require('./admin')
const User = require('./models/user');
const axios = require('axios')
const { Telegraf, session, Scenes: { Stage, WizardScene } } = require("telegraf")
const bot = new Telegraf(process.env.TELEGRAM_BOT);

bot.use(session());
bot.command('deleteUser', async (ctx) => {
    const user = await User.findOne({ chatId: ctx.chat.id });
    if (!user) {
        ctx.reply('You need to register first.');
        return;
    } else {
        try {
            await User.findOneAndDelete({chatId: ctx.chat.id})
            ctx.reply('User Deleted');
            return
        } catch (e) {
            ctx.reply('Unable to delete something went wrong');
        }
    }
});

bot.command('weather', async (ctx) => {
    try {
        const user = await User.findOne({ chatId: ctx.chat.id });
        if (!user) {
            ctx.reply('You need to register first.');
            return;
        } else {
            if (user.blocked) {
                ctx.reply('You are barred from using this bot.');
                return;
            }
        
            const now = new Date();
            if (user && user.lastMessageTime && now - user.lastMessageTime < user.messageFrequency) { // Example: Limit to 5 seconds
                ctx.reply('You are sending messages too frequently. Please wait.');
                return;
            }
    
            user.lastMessageTime = now;
            await user.save();
    
            try {
                await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API}=${user.city} ${user.country}&aqi=no`)
                    .then(ele => {
                        ctx.reply(`Current Weather in ${user.city}, ${user.country}:
                        \n Temperature: ${ele.data.current.temp_c} C
                        \n Humidity: ${ele.data.current.humidity} %
                        \n Wind Speed: ${ele.data.current.wind_kph} Km/H
                        \n Visibility: ${ele.data.current.vis_km} Km`);
                })
            } catch (e) {
                ctx.reply('Unable to fetch the Weather. Please retry');
            }
        }

    } catch (e) {
        console.log('Unable to fetch the User.');
    }
});

bot.use(async (ctx, next) => {
    ctx.session = ctx.session || {};
    const chatId = ctx.chat.id
    const user = await User.findOne({ chatId })

    if (user && user.blocked) {
        ctx.reply('You are barred from using this bot.');
        return;
    }

    const now = new Date();
    if (user && user.lastMessageTime && now - user.lastMessageTime < user.messageFrequency) { // Example: Limit to 5 seconds
        ctx.reply('You are sending messages too frequently. Please wait.');
        return;
    }

    if (user) {
        user.lastMessageTime = now; // Update last message time
        await user.save();
        await ctx.reply(`Hi there! ${user.name}`);
        return;
    }

    if (user) {
        await ctx.reply(`Hi there! ${user.name}`);
        return
    }

    if (!ctx.session.registered) {
        await ctx.reply('Welcome to the weather bot created by Mohammad Umair');
        await ctx.reply('Hi there! What is your name?');
        ctx.session.registered = true;
        return;
    }

    if (!ctx.session.name) {
        ctx.session.name = ctx.message.text;
        await ctx.reply(`Nice to meet you, ${ctx.session.name}!`);
        await ctx.reply('What city are you from?');
        return;
    }

    if (!ctx.session.city) {
        ctx.session.city = ctx.message.text;
        await ctx.reply(`Got it! Which country are you from?`);
        return;
    }

    if (!ctx.session.country) {
        ctx.session.country = ctx.message.text;
        await ctx.reply(`Thank you for providing the information!\n
        \nName: ${ctx.session.name}
        \nCity: ${ctx.session.city}
        \nCountry: ${ctx.session.country}
        \n\n Please use following command for getting weather \/weather`);
    
        if (ctx.session.name && ctx.session.city && ctx.session.country) {
            const user = new User({chatId, name: ctx.session.name, city: ctx.session.city, country: ctx.session.country})
            await user.save()
        }
        ctx.session = null
        return;
    }
});


bot.launch();
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
