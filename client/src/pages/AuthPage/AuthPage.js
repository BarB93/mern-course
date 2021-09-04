import React from 'react'
import style from './AuthPage.module.css' // импортируем файл модульных стилей css
import {useHttp} from "../../hooks/http.hook" // импортируем кастовный хук для запросов на сервер
import {useMessage} from "../../hooks/message.hook"
import {AuthContext} from "../../context/AuthContext"; // импортируем кастовный хук для показа сообщений

export const AuthPage = () => {
    const auth = React.useContext(AuthContext)
    const message = useMessage()
    const {request, loading, error, clearError} = useHttp()
    const [form, setForm] = React.useState({ //состояния импутов email and password
        email: '',
        password: ''
    })

    React.useEffect(() => { //юзе еффект для отслеживания ошибок
            message(error) //кастомная функция для показа ошибок
            clearError() //очистка стайда ошибки в кастомном хуке useHttp
    }, [error, message, clearError])

    React.useEffect(() => {
        window.M.updateTextFields()
    },[])

    const changeHandler = event => { // функция обработчик событий onChange для инпутов email и password, заметь одним состоянием обрабатываем два импута
        setForm({ ...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => { // асинхронная функция обработчик события при клике на кнопку регистрации
        try {
            const data = await request('api/auth/register', 'POST', {...form}) //используем созданный ранее нами метод request из кастомного хука, для отправки запроса на сервер

            message(data.message) //сообщаем пользователю об успешной регистрации с помощью метода кастомного хука
        } catch (e) {} //catch оставляем пустой т.к. мы его уже обработале в хуке useHttp
        finally {
            setForm({
                email: '',
                password: ''
            })
        }
    }
    const loginHandler = async () => { // асинхронная функция обработчик события при клике на кнопку регистрации
        try {
            const data = await request('api/auth/login', 'POST', {...form}) //используем созданный ранее нами метод request из кастомного хука, для отправки запроса на сервер
            //message(data.message) //ненужен,сообщаем пользователю об успешной регистрации с помощью метода кастомного хука
            auth.login(data.token, data.userId)
        } catch (e) {} //catch оставляем пустой т.к. мы его уже обработале в хуке useHttp
        finally {
            setForm({
                email: '',
                password: ''
            })
        }
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Сократи Ссылку</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>
                            <div className="input-field">
                                <input
                                    placeholder="Введите email"
                                    id="email"
                                    type="text"
                                    name="email"
                                    className={style.yellowInput}
                                    onChange={changeHandler}
                                    value={form.email}
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-field">
                                <input
                                    placeholder="Введите пароль"
                                    id="password"
                                    type="password"
                                    name="password"
                                    className={style.yellowInput}
                                    onChange={changeHandler}
                                    value={form.password}
                                />
                                <label htmlFor="password">Пароль</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className={`btn yellow darken-4 offset-m3 btn-sing ${style.btnLogin}`}
                            disabled={loading} // блокируем кнопку если происходит общение с сервером
                            onClick={loginHandler}
                        >Войти</button>
                        <button
                            className="btn grey lighten-1 black-text"
                            onClick={registerHandler}
                            disabled={loading} // блокируем кнопку если происходит общение с сервером
                        >
                            Регистрация
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}