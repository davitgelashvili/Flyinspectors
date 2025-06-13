import styles from './Search.module.scss'
import { useEffect, useState } from "react"
import TextInput from "../UI/TextInput"
import Loading from "../Loading/Loading"
import Progress from './Progress'
import { useTranslation } from 'react-i18next'

const SearchForm = () => {
    const {t} = useTranslation()
    const [id, setId] = useState("")
    const [data, setData] = useState()
    const [load, setLoad] = useState(false)
    function handleChange(e){
        e.preventDefault()
        setLoad(true)
        fetch(`${process.env.REACT_APP_API_URL}/id`, {
            method: "POST",
            headers: {
              'Content-type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                userId: id
            })
        })
        .then((res) => res.json())
        .then(res => {
            setData(res)
        }).finally(()=>{
            setLoad(false)
        })
    }

    useEffect(()=>{
        console.log('data')
    }, [data])

    return (
        <div className={styles.search}>
            <p className={styles.search__text}>{t('submitForm.searchDesc')}</p>
            <TextInput
                  type={"text"}
                  value={id}
                  placeholder={t('submitForm.searchValue')}
                  name={"id"}
                  icon={''}
                  onChange={e => setId(e.target.value)}
                />
            
                { load ? (
                    <Loading />
                ) : (
                    data && (
                        <Progress status={data?.status}/>
                    )
                )}
            <button className={styles.search__btn} onClick={handleChange}>{t('submitForm.submit')}</button>
        </div>
    )
}

export default SearchForm