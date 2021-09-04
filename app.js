const express = require('express') //импортируем express
const config = require('config') //пакет для удобного взаимодействия с конфигурационными константами
const path = require('path')
const mongoose = require('mongoose') //пакет для подключения и взаимодействия с базой данных MongoDB

const app = express() //помешаем в переменную app весь функционал express
app.use(express.json({extended: true})) // добавляем middleware встроенный прямо в express,чтобы express корректно парсил json запросы

app.use('/api/auth', require('./routes/auth.routes')) //use добавляет middleware, роуты это также концепт мидлвееров в express, первым параметром бередаем строку роут апи которую сами придумали, вторым параметром передаем созданный в другом файле роут и импортируем прямо внутри вызова фунциии с помощью require
app.use('/api/link', require('./routes/link.routes')) //use добавляет middleware, роуты это также концепт мидлвееров в express, первым параметром бередаем строку роут апи которую сами придумали, вторым параметром передаем созданный в другом файле роут и импортируем прямо внутри вызова фунциии с помощью require
app.use('/t', require('./routes/redirect.routes')) //use добавляет middleware, роуты это также концепт мидлвееров в express, первым параметром бередаем строку роут апи которую сами придумали, вторым параметром передаем созданный в другом файле роут и импортируем прямо внутри вызова фунциии с помощью require

if(process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build'))) //если идет запрос на корень приложения, то мы возвращаем статическую папку build

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = config.get('port') || 5000

async function start() { //функция обертка для удобного взаимодействия с помощью async-await для подключение к MongoDB, потому что метод await mongoose.connect() возвращает Promise
    try {
        await mongoose.connect(config.get('mongoUri'),{ // метод connect служит для подключения к MongoDB, превый параметр адрес для подключения, второй параметр объект конфигурации
            useNewUrlParser: true, //используем новый парсер, т.к. старый устарел и скоро будет удален
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
        app.listen(PORT, () => { console.log(`Server is started on ${PORT} port...`) }) // стартуем сервер только после коннекта с базой данных
    }catch (e) {
        console.log('Server Error', e.message)
        process.exit(1) //выходим из процесса nodejs c помощью глобального объекта process в случае ошибки
    }
}

start()

