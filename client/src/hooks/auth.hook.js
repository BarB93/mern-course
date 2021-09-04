import  React from 'react'
const storageName = 'userData' //ключ для localStorage

export  const useAuth = () => {
    const [token, setToken] = React.useState(null) //стейт для хранения токена
    const [ready, setReady] = React.useState(false)
    const [userId, setUserId] = React.useState(null) //стейт для сранения юзер айди

    const login = React.useCallback((jwtToken, id) => { // метод для авторизации, принимает jwt токен и юзер айди
        setToken(jwtToken) //сетаем полученный токен
        setUserId(id) //сетаем полученный юзер айди

        localStorage.setItem(storageName, JSON.stringify({token:jwtToken, userId:id}))
    }, [])

    const logout = React.useCallback(() => { // метод для выхода из системы авторизированного пользователя
        setToken(null) // обнуляем стейт токена
        setUserId(null) // обнуляем стейт юзер айди
        localStorage.removeItem(storageName)
    }, [])

    React.useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName)) // получаем данные из localStorage по ключу
        if(data && data.token) { //если данные из локалСторадже не пустые и есть поле токен, то устанавливаем стейт токена и юзерАйди
            login(data.token, data.userId)
        }
        setReady(true)
    }, [login])

    return {login, logout, token, userId, ready}
}