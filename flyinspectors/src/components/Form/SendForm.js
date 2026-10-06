'use client'

import { useEffect, useState } from "react"
import SendFormBody from "./SendFormBody"
import PopUp from "./PopUp"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import useLocale from "@/i18n/useLocale";
import { metaEventFields, trackClaimSubmitted } from "@/utils/metaPixel";

const SendForm = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const locale = useLocale();
    const ref = searchParams.get('ref');
    const { t } = useTranslation()
    var newDate = new Date()
    var month = newDate.getMonth()
    var day = newDate.getDate()
    var year = newDate.getFullYear()
    month = month + 1
    if (month < 10) {
        month = 0 + '' + month
    }

    if (day < 10) {
        day = 0 + '' + day
    }
    const fullDate = year + '-' + month + '-' + day

    const windowUrl = typeof window !== 'undefined' ? window.location.host : ''
    const { language } = useSelector(state => state.translate)
    const [load, setLoad] = useState(false)
    const [popup, setPopup] = useState(false)
    const [accept, setAccept] = useState({
        passport: false,
        ticket: false,
        other: false
    })
    const [message, setMessage] = useState(false)
    const [unicueID, setUnicueID] = useState('')
    const [value, setValue] = useState({
        companyId: ref || "",
        passportImage: "",
        ticketImage: "",
        otherImage: "",
        signature: "",
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

    useEffect(() => {
        setTimeout(() => setMessage(false), 3000);
    }, [message])


    useEffect(() => {
        console.log(value)
        if (
            value.firstName !== "" &&
            value.lastName !== "" &&
            value.phone !== "" &&
            value.email !== "" &&
            value.city !== "" &&
            value.address !== "" &&
            value.problem !== "" &&
            value.flightNumber !== "" &&
            value.date !== "" &&
            value.select !== ""
        ) {
            setAccept({
                passport: true,
                ticket: false,
                other: false
            })
            if (value.passportImage !== "") {
                setAccept({
                    passport: true,
                    ticket: true,
                    other: false
                })
            }

            if (value.ticketImage !== "") {
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

    const uploadFile = async (e) => {
        e.preventDefault();

        if (
            value.firstName !== "" &&
            value.lastName !== "" &&
            value.phone !== "" &&
            value.email !== "" &&
            value.city !== "" &&
            value.address !== "" &&
            value.problem !== "" &&
            value.flightNumber !== "" && // ✅ შეცვლილია fightNumber → flightNumber
            value.date !== "" &&
            value.select !== "" &&
            value.signature !== ""
        ) {
            setPopup(true);
            setLoad(true);

            // Meta: ბრაუზერისა და სერვერის მოვლენა ერთი event_id-ით (დუბლს Meta აერთიანებს).
            // fbp/fbc პიქსელის cookie-ებია — ბექიდან ვერ წაიკითხება, ამიტომ აქედან მიჰყვება.
            const meta = metaEventFields();

            try {
                const clientRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/client`, {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({ ...value, ...meta })
                });

                const clientData = await clientRes.json();
                const userId = clientData.userId;
                setUnicueID(userId);
                // მოვლენას მხოლოდ მაშინ ვაგზავნით, თუ განაცხადი მართლა შეიქმნა
                if (userId) trackClaimSubmitted(meta.eventId);

                // გაგზავნა ორივე მხარეს ერთდროულად
                await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/email`, {
                        method: "POST",
                        headers: { 'Content-type': 'application/json' },
                        body: JSON.stringify({ ...value, userId })
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/sendtoclient`, {
                        method: "POST",
                        headers: { 'Content-type': 'application/json' },
                        body: JSON.stringify({
                            email: value.email,
                            text: language === 'ka'
                                ? `
                      <p>მოგესალმებით ${value.firstName}</p>
                      <p>თქვენი განაცხადი მიღებულია Flyinspectors ში.</p>
                      <p>თქვენი საქმის ნომერია: <strong>${userId}</strong></p>
                      <p>სტატუსი შეგიძლიათ შეამოწმოთ შემდეგ ბმულზე: www.${windowUrl}/submit-claim</p>
                      <p>პატივისცემით</p>
                      <p>Flyinspectors</p>`
                                : `
                      <p>Dear ${value.firstName}</p>
                      <p>We have successfully received your application.</p>
                      <p>Your case number is: <strong>${userId}</strong></p>
                      <p>You can check case status anytime to the following link: www.${windowUrl}/submit-claim</p>
                      <p>Best regards</p>
                      <p>Flyinspectors</p>`
                        })
                    })
                ]);

                setLoad(false);
                setValue(defaultValue);
            } catch (error) {
                console.error("Error submitting form:", error);
                setLoad(false);
            }

        } else {
            setMessage(true);
            console.log('შეავსე ყველა ველი');
        }
    };


    return (
        <>
            <SendFormBody value={value} setValue={setValue} uploadFile={uploadFile} setAccept={setAccept} accept={accept} load={load} setLoad={setLoad} />
            {popup && (
                <PopUp
                    load={load}
                    unicueID={unicueID}
                    onClose={() => {
                        setPopup(false)
                        router.push(`/${locale}/check-status`)
                    }}
                />
            )}
            {message && (
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