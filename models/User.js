const {Schema, model} = require('mongoose') // для того чтобы создать модель мы должны поработать с mongoose и имортируем от туда Schema - для созадания схемы, функцию modal() - для создания модели, Types -

const schema = new Schema({ // создаем схему
    email: {type: String, required: true, unique: true},
    password: {type:String, required: true},
    links: [{type: Schema.Types.ObjectId, ref: 'Link'}] // это просто связка модели пользователей и определенных записей в базе данных, ref - указывает к какой коллекции мы привязываемя
})

module.exports = model('User', schema) // экспортируем результат работы функции model(), первым параметром задаем название модели в данном случае это "User", второй параметр схема по которой работает модель в данном случае это объект schema