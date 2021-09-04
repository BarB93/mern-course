import React from 'react'
import {useRoutes} from "./routes" //импортируем кастомный хук
import {useAuth} from "./hooks/auth.hook" //импортируем кастомный хук
import {AuthContext} from "./context/AuthContext"
import {Navbar} from "./components/Navbar"; //импортируем css библиотеку
import {Loader} from "./components/Loader";
import 'materialize-css'

function App() {
    const {token, login, logout, userId, ready} = useAuth()
    const isAuthenticated = !!token // приводим к булеву значению поставив два отрицания, переменная-флаг сообщающая авторизирован ли пользователь
    const routes = useRoutes(isAuthenticated)

    if(!ready) {
        return <Loader />
    }

  return (
      <AuthContext.Provider value={{
          token, userId, login, logout, isAuthenticated
      }}>
          {isAuthenticated && <Navbar />}
          <div className="container">
              {routes}
          </div>
      </AuthContext.Provider>
  )
}

export default App;
