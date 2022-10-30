const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')
require('dotenv').config()
const token = `${process.env.TELEGRAM_TOKEN}`

const bot = new TelegramBot(token, { polling: true })

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id
    let oldValue = 1;
    const interval = setInterval(() => {
        axios.get('https://gorzdrav.spb.ru/_api/api/v2/schedule/lpu/229/specialties')
        .then(res => {

        const message = res.data.result.map((item) => {
            return `Врач: <b>${item['name']}</b>\n countFreeParticipant: <b>${item.countFreeParticipant}</b>\n countFreeTicket: <b>${item.countFreeTicket}</b>\n lastDate: <b>${item.lastDate}</b> \n\n`;
        });

        if(oldValue != res.data.result[3].countFreeParticipant){
            bot.sendMessage(chatId, `<b>ИЗМЕНЕНИЯ</b>\n\n`)
            oldValue = res.data.result[3].countFreeParticipant;
        }

        if(res.data.success === false){
            bot.sendMessage(chatId, `error: ${res.data.errorCode}`)
        }

        bot.sendMessage(chatId, message.join(''), {parse_mode: 'HTML'})
        })
        .catch(err => {
            console.log('Error: ', err);
        });
    }, 10000);

    bot.onText(/\/stop/, (msg) => {
        clearInterval(interval)
    })

})

bot.on('polling_error', (error) => {
    console.log(error.code);  // => 'EFATAL'
  });