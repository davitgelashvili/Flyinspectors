import { useEffect, useState } from "react"
import styles from './Progress.module.scss'
import { useSelector } from "react-redux"

const Progress = ({status}) => {
    const {language} = useSelector( state => state.translate)
    const statusData = [
        'Application received',
        'Case proceedings initiated',
        'Rejected by the airline',
        'Transferred to the legal department',
        'Case appealed to a higher authority',
        'Case is pending in court',
        'Case successfully closed',
        'Case closed',
    ]
    const [step, setStep] = useState(status)

    useEffect(()=>{
        if(language === 'ka'){
            if(status === statusData[0]){
                setStep('განაცხადი მიღებულია')
            }

            if(status === statusData[1]){
                setStep('საქმის წარმოება დაიწყო')
            }

            if(status === statusData[2]){
                setStep('უარყოფილია ავიაკომპანიის მიერ')
            }

            if(status === statusData[3]){
                setStep('გადაყვანილია იურიდიულ განყოფილებაში')
            }

            if(status === statusData[4]){
                setStep('საქმემ მიმართა ზემდგომ ორგანოს')
            }

            if(status === statusData[5]){
                setStep('საქმე სასამართლოშია განხილული')
            }

            if(status === statusData[6]){
                setStep('საქმე წარმატებით დაიხურა')
            }

            if(status === statusData[7]){
                setStep('საქმე დახურულია')
            }
        }else {
            setStep(status)
        }
    },[status, language])
    
    return (
        <>
        <div className={` ${styles['steps']} `}>
            {statusData?.map((item, key)=>{
                return (
                    <>
                    <div className={` ${styles['steps__step']}  ${item === status && styles['steps__step--done']}`} key={item}>
                        <div className={` ${styles['steps__step-number']} `}>{key +1}</div>
                    </div>
                    </>
                )
            })}
        </div>
        <div className={` ${styles['steps']} `}>
            <div className={` ${styles['steps__step']} `}>
                <div className={`${styles['steps__step-name']} `}>{step}</div>
            </div>
        </div>
        </>
    )
}

export default Progress