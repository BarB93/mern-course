const {Router} = require('express') // экспортируем роутер из express
const {check, validationResult} = require('express-validator') // пакет для валидации данных
const User = require('../models/User') // подключаем модель User, которую мы сами до этого создали, файлы моделей обычно называют с большой буквы
const bcrypt = require('bcryptjs') //библиотека для шифрования, позволяет хешировать пароли и в последствии их еще и сравнивать
const jwt = require('jsonwebtoken')
const config = require('config') // подключаем библеотеку config, для работы с кофигурационными константами


const router = Router() //создаем роутер

// /api/auth/register - это endpoint для регистрации
router.post(
    '/register', //первый параметр это строка с роутом, второй параметр это функция (req,res), так же вторым параметром можно добавить массив middlewares
    [
        check('email', 'Incorrect email').isEmail(), // проверяем email  и вслучае ошибки выводим сообщение которое передали вторым параметром
        check('password', 'Minimum length of password 6 symbol')
            .isLength({min: 6})
    ]
    , async (req, res) => {
    try {
        const errors = validationResult(req) //проверяем валидацию данных request

        if(!errors.isEmpty()) { // если errors не пустой занчит есть ошибки в валидации, делаем return и отвечаем response status 400 - Bad Request
            return  res.status(400).json({
                errors: errors.array(), // передаем массив ошибок в ответе от сервера
                message: 'Неправильные данные для регистрации'
            })
        }

        const {email, password} = req.body //получаем с помощью деструкторизации поля body из полученного request
        const candidate = await User.findOne({ email}) // ищем в базе пользователя с введенным емайл адресом

        if(candidate) { //если такой емайл в базе уже существуем и в response возвращаем status 400 - ошибака Bad Request
            return res.status(400).json({message: 'Пользователь с таким емайл андресом уже существует!'})
        }

        const hashedPassword = await bcrypt.hash(password, 12) //хешируем пароль с помошью пакета bcryptjs eё асинхронной функции hash() , вторым параметром принимает некий salt который позволяет увеличить надежность шифрования
        const user = new User({email, password: hashedPassword,}) //создаем юзера

        await user.save() //сохраняем узера в базе данных

        res.status(201).json({message: 'Пользователь успешно создан!'}) //отвечаем успешным response status 201 - Created
    }catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, повторите еще раз!'}) // если возникла ошибка отвечаем response status 500 - Server Error
    }
})


// /api/auth/login - это endpoint для того чтобы залогиница
router.post('/login',
    [
        check('email', 'Введите коректный емайл').normalizeEmail().isEmail(), // проверяем email  и вслучае ошибки выводим сообщение которое передали вторым параметром, функция normalizeEmail() приводит строку к нормальному виду для емайла
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req) //проверяем валидацию данных request

        if(!errors.isEmpty()) { // если errors не пустой занчит есть ошибки в валидации, делаем return и отвечаем response status 400 - Bad Request
            return  res.status(400).json({
                errors: errors.array(), // передаем массив ошибок в ответе от сервера
                message: 'Неправильные данные для авторизации!'
            })
        }

        const {email, password} = req.body

        const user = await User.findOne({email}) //ищем в базе данных юзера по полю email, важно что мы используем метод findOne, а не просто find(), потому что нам надо найти одного пользователя

        if(!user) { //если такого емайла в БД не существует, ретёрним и отвечаем кодом 400 - Bad Request
            return res.status(400).json({
                message: 'Пользователя с таким емайлом не существует!'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password) // сравниваем пароль введённый пользователем и пароль из БД

        if(!isMatch) { // если пароли не совпадают ретурним и отвезаем статус кодом 400 - Bad Request
            return res.status(400).json({
                message: 'Неправильный пароль, попробуйте еще раз!'
            })
        }



        const token = jwt.sign( // создаем токн с помощью библиотеки jsonwebtoken и ее метода sing(), который принемает три параметра: 1) объект, где нам необходимо указать те данные которые будут зашифрованны в jwt токене 2) sign - некоторый секретный ключ в виде строки, который мы создаем в config 3) объект options в которым мы указываем настройки jwt токена
            {userId: user.id}, // объект с данными которые мы хотим зашифровать
            config.get('jwtSing'), // получаем секретную подпись, которую мы создали в конфигурационном файле для пакета config, в конечном счете это будет строка зависящая от наших настроик
            {
                expiresIn: '1h' // настройка в которой мы указываем через сколько jwt закончит свое существование, в данном конкретном случае указывае 1 час
            }
        )

        res.json({ // отвечаю респонсом, статус не передаю, потому что он по умолчанию 200 - OK
            token, // в ответе передаем созданный выше jwt токен
            userId: user.id, // а также на всякий случай id пользователя
        })

    }catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте еще раз!'}) // если возникла ошибка отвечаем response status 500 - Server Error
    }
})

module.exports = router //экспортируем из модуля объект роута