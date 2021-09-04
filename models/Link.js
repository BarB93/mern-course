const {Schema, model} = require('mongoose') // для того чтобы создать модель мы должны поработать с mongoose и имортируем от туда Schema - для созадания схемы, функцию modal() - для создания модели, Types -

const schema = new Schema({ // создаем схему
    from: {type: String, required: true}, // поле содержащие данные откуда идет ссылка
    to: {type: String, required: true, unique: true}, // куда ведет данная ссылка
    code: {type: String, required: true, unique: true}, //
    date: {type: Date, default: Date.now},// дата когда была создана ссылка, по дефолту передаем Date.now, но обратите внимание, что не вызываем, а просто передаем метод как референс
    clicks: {type: Number, default: 0}, // поле для подсчета аналитики, сколько раз мы кликнули по данной ссылки
    owner: {type: Schema.Types.ObjectId, ref: 'User'}, // указывает пользователя который создал данную ссылку
})

module.exports = model('Link', schema) // экспортируем результат работы функции model(), первым параметром задаем название модели в данном случае это "User", второй параметр схема по которой работает модель в данном случае это объект schema