import React from 'react'
import {useParams} from 'react-router-dom'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/Loader";
import {LinkCard} from "../components/LinkCard"; // useParams - это метод для извлечения параметров url строки

export const DetailPage = () => {
    const {request, loading} = useHttp()
    const [link, setLink] = React.useState(null) // создаем стейт для ссылки
    const auth = React.useContext(AuthContext)
    const linkId = useParams().id // ключ id мы берем из роутов, мы его сами назвали id

    const getLink = React.useCallback(async () => {
        try {
           const fetched =  await request(`/api/link/${linkId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })

            setLink(fetched)
        }catch (e) {}
    }, [auth.token, linkId, request])

    React.useEffect(() => {
        getLink()
    }, [getLink])

    if(loading) {
        return <Loader />
    }

    return (
        <>
            {!loading && link && <LinkCard link={link}/>}
        </>
    )
}