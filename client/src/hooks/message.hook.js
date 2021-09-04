import React from 'react'

export const useMessage = () => {
    return React.useCallback( text => { //оборачиваем в useCallback для того, чтобы функция не входила в рекурсию
        if(window.M && text) { // если в объекте window объект M существует(благодаря materialize) и если мы передали текс то выполним условный блок
            window.M.toast({html: text}) //показываем текс
        }
    }, [])
}
