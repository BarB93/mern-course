import React from 'react'

export const useHttp = () => { //создаем кастомный хук который нам позволит в комфортном режиме работать с асинхронными запросами на сервер, будем использовать нативный API браузеров fentch
    const [loading, setLoading] = React.useState(false) //стейт для оределения грузится у нас что-то с сервера или нет, и в зависимости от этого отображать индикатор загрузки
    const [error, setError] = React.useState(null) // стейт для индикации ошибок

    const request =  React.useCallback(async (url, method = "GET", body = null, headers = {}) => { // async функция оболочка для запросов на сервер с помошью браузерного API fetch, оборачиваем эту функцию в хук useCallback чтобы реакт не входил в рекурсию
        setLoading(true) // устанавливаем флаг загрузки в состояние true

        if(body) {
            body = JSON.stringify(body)
            headers['Content-Type'] = 'application/json'
        }

        try {
            const response = await fetch(url, {method, body, headers})
            const data =  await response.json()

            if(!response.ok) {
                throw new Error(data.message || 'Что-то пошло не так!') // если поле ok в респонсе не ок), то мы выкидываем ошибку если существует data.message, если нет то сообщение строкой
            }

            setLoading(false) // устанавливаем флаг загрузки в состояние false
            return data
        } catch (e) {
            setLoading(false)// устанавливаем флаг загрузки в состояние false
            setError(e)
            throw e // для того чтобы обрадотать ошибку в компонентах пробрасываем ее дальше с помощью throw
        }
    }, [])


    const clearError = React.useCallback(() =>  setError(null),[]) // функция сбрасывает в null стейк сообщающий об ошибке


    return {loading, request, error, clearError}
}