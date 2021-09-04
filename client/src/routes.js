import React from 'react'
import {Switch, Route, Redirect} from "react-router-dom" // Switch компонет который служит для того, чтобы описывать какие роуты будем использовать
import {LinksPage} from "./pages/LinksPage"
import {CreatePage} from "./pages/CreatePage"
import {DetailPage} from "./pages/DetailPage"
import {AuthPage} from "./pages/AuthPage/AuthPage";

export const useRoutes = (isAuthenticated) => { //создаем функцию и экспортируем, в который принимаем флаг сообщающий пользователь зарегистрирован в системе или нет, и в зависимость от этого флага мы будем возвращать определенный набор роутов
    if(isAuthenticated) {
        return (
            <Switch>
                <Route path="/links" exact>
                    <LinksPage/>
                </Route>
                <Route path="/create" exact>
                    <CreatePage/>
                </Route>
                <Route path="/detail/:id" exact>
                    <DetailPage/>
                </Route>
                <Redirect to="/create"/> {/*делаем редирект на CreatePage, если введен не зарегистрированный роут*/}
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path='/' exact>
                <AuthPage />
            </Route>
            <Redirect to="/" /> {/* делаем редирект на главную, если введен не зарегистрированный роут*/}
        </Switch>
    )
}