import { useEffect, useState } from "react"
import SendFormBody from "./SendFormBody"
import PopUp from "./PopUp"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

const SendForm = ({setFormActive}) => {
    const [searchParams] = useSearchParams();
    const ref = searchParams.get('ref');
    const {t} = useTranslation()
    var newDate = new Date()
    var month = newDate.getMonth()
    var day = newDate.getDate()
    var year = newDate.getFullYear()
    month = month + 1
    if(month < 10){
        month = 0 + '' +month
    }

    if(day < 10){
        day = 0 + '' +day
    }
    const fullDate = year + '-'+ month + '-' + day

    const windowUrl = window.location.host
    const {language} = useSelector( state => state.translate)
    const [load, setLoad] = useState(false)
    const [popup, setPopup] = useState(false)
    const [unicueID, setUnicueID] = useState(
        Math.floor((Math.random() * 10) + 1) +''+
        Math.floor((Math.random() * 10) + 1) +''+
        Math.floor((Math.random() * 10) + 1) +''+
        Math.floor((Math.random() * 10) + 1) +''+
        Math.floor((Math.random() * 10) + 1)
    )
    const [accept, setAccept] = useState({
        passport: false,
        ticket: false,
        other: false
    })
    const [message, setMessage] = useState(false)
    const [value, setValue] = useState({
        companyId: ref,
        passportImage: "",
        ticketImage: "",
        otherImage: "",
        signature: "",
        userId: unicueID,
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        city: "",
        address: "",
        problem: "",
        flightNumber: "",
        date: "",
        select: "",
        description: null,
        oldStatus: "Application has received",
        createDate: fullDate
    })
    const [defaultValue, setDefaultValue] = useState(value)

    useEffect(()=>{
        setTimeout(() => setMessage(false), 3000);
    }, [message])
    

    useEffect(()=>{
        console.log(value)
        if(
            value.firstName !== "" &&
            value.lastName !== "" &&
            value.phone !== "" &&
            value.email !== "" &&
            value.city !== "" &&
            value.address !== "" &&
            value.problem !== "" &&
            value.fightNumber !== "" &&
            value.date !== "" &&
            value.select !== ""
        ){
            setAccept({
                passport: true,
                ticket: false,
                other: false
            })
            if(value.passportImage !== ""){
                setAccept({
                    passport: true,
                    ticket: true,
                    other: false
                })
            }
            
            if(value.ticketImage !== ""){
                setAccept({
                    passport: true,
                    ticket: true,
                    other: true
                })
            }
        } else {
            setAccept({
                passport: false,
                ticket: false,
                other: false
            })
        }
    }, [value])

    const uploadFile = (e) => {
        e.preventDefault()
        if(
            value.firstName !== "" &&
            value.lastName !== "" &&
            value.phone !== "" &&
            value.email !== "" &&
            value.city !== "" &&
            value.address !== "" &&
            value.problem !== "" &&
            value.fightNumber !== "" &&
            value.date !== "" &&
            value.select !== "" &&
            value.signature !== ""
        ) {
            setPopup(true)
            setLoad(true)
            fetch(`${process.env.REACT_APP_API_URL}/email`, {
                method: "POST",
                headers: {
                  'Content-type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    ...value,

                })
            })
            .then((res) => res.json())
            .finally(()=>{
                fetch(`${process.env.REACT_APP_API_URL}/sendtoclient`, {
                    method: "POST",
                    headers: {
                      'Content-type': 'application/json',
                      'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        email: value.email,
                        text: `
                            ${language === 'ka' ? (
                                `
                                    <p>მოგესალმებით ${value.firstName}</p>
                                    <p>თქვენი განაცხადი მიღებულია Flyinspectors ში.</p>
                                    <p>თქვენი საქმის ნომერია: <strong> ${value.userId}</strong></p>
                                    <p>სტატუსი შეგიძლიათ შეამოწმოთ შემდეგ ბმულზე: www.${windowUrl}/submit-claim</p>
                                    <p>პატივისცემით</p>
                                    <p>Flyinspectors</p>
                                `
                            ) : (
                                `
                                    <p>Dear ${value.firstName}</p>
                                    <p>We have successfully received your application.</p>
                                    <p>Your case number is: <strong> ${value.userId}</strong></p>
                                    <p>You can check case status anytime to the following link: www.${windowUrl}/submit-claim</p>
                                    <p>Best regards</p>
                                    <p>Flyinspectors</p>
                                `
                            )}
                        `
                    })
                })
                .then((res) => res.json())
                .finally(()=>{
                    fetch(`${process.env.REACT_APP_API_URL}/client`, {
                        method: "POST",
                        headers: {
                          'Content-type': 'application/json',
                          'Access-Control-Allow-Origin': '*'
                        },
                        body: JSON.stringify({
                            ...value
                        })
                    })
                    .then((res) => res.json())
                    .then(res => {
                        console.log("save data");
                    }).finally(()=>{
                        setLoad(false)
                        setValue(defaultValue)
                    })
                })
            })
        }else {
            setMessage(true)
            console.log('sheavse yvela forma')
        }

    }
    return (
        <>
        <SendFormBody value={value} setValue={setValue} uploadFile={uploadFile} setAccept={setAccept} accept={accept} load={load} setLoad={setLoad}/>
        { popup && <PopUp load={load} setPopup={setPopup} unicueID={unicueID} setFormActive={setFormActive}/> }
        { message && (
            <div className="message">
                <div className="message__item">
                    <p>{t('submitForm.formmessage')}</p>
                </div>
            </div>
        )}
        </>
    )
}

export default SendForm