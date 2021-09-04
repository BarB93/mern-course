import React from 'react'
import {useHttp} from "../hooks/http.hook" //подключаем кастомный хук для http запросов
import {AuthContext} from "../context/AuthContext" //добавляем катомный контекст
import {useHistory} from 'react-router-dom'

export const CreatePage = () => {
    const history = useHistory()
    const auth = React.useContext(AuthContext)
    const {request} = useHttp()
    const [link, setLink] = React.useState('')
    const linkHandler = (event) => {
        setLink(event.target.value)
    }

    const pressHandler = async (event) => {
        if(event.key === 'Enter') {
            try {
                const data = await request('/api/link/generate', 'POST', {from: link}, {Authorization: 'Bearer '+ auth.token})
                history.push(`/detail/${data.link._id}`) //делаем редирект на страницу DetailPage с помощью объекта history из библиотеки react-router-dom
            } catch (e) {}
        }
    }

    React.useEffect(() => { // юзеЕффект для того чтобы после вмонтирования компонента сделать импуты активными
        window.M.updateTextFields() // делает импуты в materializecss активными
    },[])

    return (
        <div className="row">
            <div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>
                <div className="input-field">
                    <input
                        placeholder="Вставьте ссылку"
                        id="link"
                        type="text"
                        value={link}
                        onChange={linkHandler}
                        onKeyPress={pressHandler}
                    />
                    <label htmlFor="email">Введите ссылку</label>
                </div>
            </div>
        </div>
    )
}