const jwt = require('jsonwebtoken') // подключаем библиотеку, чтобы раскодировать токен полученный с клиента
const config = require('config') // подключаем библеотеку config, для работы с кофигурационными константами

module.exports = (req, res, next) => { // next это метод позволяющий продулжить выполнение запроса
    if(req.method === 'OPTIONS') { // если это метод запроса OPTIONS, то продолжаем делать запрос, OPTIONS - это метод который проверяет доступность сервера
        return next() // продолжаем выполнение запроса
    }

    try {
        const token = req.headers.authorization.split(' ')[1] // это строка которую мы будем передовать с клиента: "Bearer TOKEN" - мы можем ее распарсить для того, чтобы получить токен
        if(!token) {
            return res.status(401).json({message: 'Нет авторизации'})  //401 UNAUTHORIZED - нет авторизации, return делаем для того чтобы код не выполнялся дальше
        }

        const decoded = jwt.verify(token, config.get('jwtSing')) // декодируем токен с помощью метода verify(), библиотеки 'jsonwebtoken'
        req.user = decoded // в запросе создаем поле user и кладем туда декодированный токен
        next() // продолжаем выполнение запроса
    }catch (e) {
        res.status(401).json({message: 'Нет авторизации'})  //401 UNAUTHORIZED - нет авторизации
    }
}