const {Router} = require('express') // экспортируем роутер из express
const {nanoid} = require('nanoid') // библиотека для генерации уникальных строк
const config = require('config') // подключаем библиотеку config
const Link = require('../models/Link') // подключаем кастомную модель Link
const authMiddleware = require('../middleware/auth.middleware') //подключаем кастомный middleware, который добавляет токен к запросу


const router = new Router()

router.post('/generate', authMiddleware, async (req, res) => { //ендпоинт, пост запрос для генерации ссылки
    try {
        const baseUrl = config.get('baseUrl')
        const {from} = req.body

        const code = nanoid()

        const existing = await Link.findOne({from})

        if(existing) {
           return res.json({link: existing})
        }

        const to = baseUrl + '/t/' + code

        const link = new Link({
            code, to, from, owner: req.user.userId
        })

        await  link.save()

        res.status(201).json({link})
    }catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

router.get('/', authMiddleware, async  (req, res) => { //ендпоинт, гет запрос для получения всех ссылок
    try {
        const links = await Link.find({ owner: req.user.userId}) //получаем все ссылки относящиеся к определенному владельцу, пользователя получаем через userId которое мы добавили через кастомный мидделваре authMiddleware
        res.json(links)
    }catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

router.get('/:id', authMiddleware, async (req, res) => { //эндпоинт, гет запрос для получения ссылки по id
    try {
        const links = await Link.findById(req.params.id) // получаем все ссылку из БД по полю id
        res.json(links)
    }catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

module.exports = router