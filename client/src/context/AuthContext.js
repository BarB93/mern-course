import React from 'react'

function noop() {} //функция которая ничего не делает

export const AuthContext = React.createContext({ // создаем контекс авторизации
    token: null,
    userId: null,
    login: noop,
    logout: noop,
    isAuthenticated: false
})