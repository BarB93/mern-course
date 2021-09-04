import React from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from "../context/AuthContext";
import M from 'materialize-css'

export const Navbar = () => {
    const history = useHistory() // useHistory - это хук из библиотеки 'react-router-dom', который дает доступ к экземпляру истории, который можно использовать для навигации
    const {logout} = React.useContext(AuthContext)
    const logoutHandler = (event) => {
        event.preventDefault()
        logout()
        history.push('/') // переходим на главную страницу
    }

    React.useEffect(() => {
        const elem = document.querySelector('.sidenav')
        const instance = M.Sidenav.init(elem, {
            edge: "left",
            inDuration: 250
        })


    }, [])

    return (
        <>
            <nav>
                <div className="nav-wrapper blue darken-1" style={{padding:'0 2rem'}}>
                    <span>Сокращение ссылок</span>
                    <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                    <ul className="right hide-on-med-and-down">
                        <li><NavLink to='/create'>Создать</NavLink></li>
                        <li><NavLink to='/links'>Ссылки</NavLink></li>
                        <li><a href='/' onClick={logoutHandler}>Выйти</a></li>
                    </ul>
                </div>
            </nav>

            <ul className="sidenav" id="mobile-demo">
                <li><NavLink to='/create'>Создать</NavLink></li>
                <li><NavLink to='/links'>Ссылки</NavLink></li>
                <li><a href='/' onClick={logoutHandler}>Выйти</a></li>
            </ul>
        </>)
}