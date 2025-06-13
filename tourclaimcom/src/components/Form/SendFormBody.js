
import { useEffect, useState } from "react";
import UploadWidget from "../UploadWidget/UploadWidget";
import DisableUploadWidget from "../UploadWidget/DisableUploadWidget";
import TextInput from "../UI/TextInput";
import File from "../UploadWidget/File";
import ReactSignatureCanvas from 'react-signature-canvas'
import styles from './Signature.module.scss'
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import imageToBase64 from 'image-to-base64/browser';
import imageCompression from 'browser-image-compression';
import UploadImage from "../UploadWidget/UploadWidget";
import { useSearchParams } from "react-router-dom";

const SendFormBody = ({ value, setValue, uploadFile, accept, setAccept, setLoad, load }) => {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref');
  const { t } = useTranslation()
  const [fileName, setFileName] = useState({
    passportImage: "",
    ticketImage: "",
    otherImage: "",
  })
  const [signature, setSignature] = useState()
  const inputs = [
    {
      id: 32345,
      name: "firstName",
      type: "text",
      value: value.firstName,
      placeholder: t('submitForm.firstname'),
      icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1731600392/Form%20icons/ijhlmpfbajgs0ypeymoy.svg"
    },
    {
      id: 1574,
      name: "lastName",
      type: "text",
      value: value.lastName,
      placeholder: t('submitForm.lastname'),
      icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1731600392/Form%20icons/ijhlmpfbajgs0ypeymoy.svg"
    },
    {
      id: 46477,
      name: "phone",
      type: "text",
      value: value.phone,
      placeholder: t('submitForm.phone'),
      icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1731600390/Form%20icons/ifezno0nleyy8tyuclzg.svg"
    },
    {
      id: 5703,
      name: "email",
      type: "text",
      value: value.email,
      placeholder: t('submitForm.email'),
      icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1731600391/Form%20icons/nslmitrcambiai6wmfen.svg"
    },
    {
      id: 34643,
      name: "city",
      type: "text",
      value: value.city,
      placeholder: t('submitForm.city'),
      icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1731600391/Form%20icons/kuhub9sf2shcfwtecvy9.svg"
    },
    {
      id: 753235,
      name: "address",
      type: "text",
      value: value.address,
      placeholder: t('submitForm.address'),
      icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1731600391/Form%20icons/chfs24yjcgkltrezdbzn.svg"
    },
    {
      id: 36273,
      name: "problem",
      type: "select",
      value: value.problem,
      selectData: [
        t('submitForm.problemData.1'),
        t('submitForm.problemData.2'),
        t('submitForm.problemData.3'),
        t('submitForm.problemData.4'),
        t('submitForm.problemData.5'),
      ],
      placeholder: t('submitForm.problem'),
      icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1731600393/Form%20icons/sfew5nqowhazn00o76ho.svg"
    },
    {
      id: 485845,
      name: "flightNumber",
      type: "text",
      value: value.flightNumber,
      placeholder: t('submitForm.number'),
      icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1731600391/Form%20icons/mn0qzrqet0padkpm6rgj.svg"
    },
    {
      id: 457853,
      name: "date",
      type: "date",
      value: value.date,
      placeholder: "Date",
      icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1731600391/Form%20icons/ivmgutc8eckheli6at9q.svg"
    },
    {
      id: 35262,
      name: "select",
      type: "select",
      value: value.select,
      selectData: [
        t('submitForm.selectData.1'),
        t('submitForm.selectData.2'),
      ],
      placeholder: t('submitForm.select'),
      icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1731600393/Form%20icons/nzxyqpypgliouotsa6ie.svg"
    },
    {
      id: 64375,
      name: "description",
      type: "textarea",
      value: value.description,
      placeholder: t('submitForm.desc'),
      icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1731600393/Form%20icons/nzxyqpypgliouotsa6ie.svg"
    },

  ]


  const handleChange = async (e) => {
    if (
      e.target.name === 'passportImage' ||
      e.target.name === 'ticketImage' ||
      e.target.name === 'otherImage'
    ) {
      const file = e.target.files[0];

      if (file) {
        if (!file.type.startsWith('image/')) {
          alert('not accept)');
          return;
        }

        try {
          // კომპრესიის პარამეტრები
          const options = {
            maxSizeMB: 0.5, // მაქსიმალური ფაილის ზომა 0.5MB
            maxWidthOrHeight: 400, // მაქსიმალური ზომა 800px
            useWebWorker: true,
          };

          // ფაილის კომპრესია
          const compressedFile = await imageCompression(file, options);

          // კომპრესირებული ფაილის გადაყვანა Base64-ში
          const reader = new FileReader();
          reader.onloadend = function () {
            setValue({ ...value, [e.target.name]: reader.result });
            setFileName({ ...fileName, [e.target.name]: file.name });
          };
          reader.readAsDataURL(compressedFile);

        } catch (error) {
          console.error("Image compression error:", error);
        }
      }
    } else {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
  };

  // useEffect(()=>{
  //   if(ref){
  //     setValue({...value, 'companyId': ref})
  //   }
  //   console.log(value, ref)
  // }, [ref])


  // function encodeImageFileAsURL(element) {
  //   var file = element.files[0];
  //   var reader = new FileReader();
  //   reader.onloadend = function() {
  //     console.log('RESULT', reader.result)
  //   }
  //   reader.readAsDataURL(file);
  // }

  // imageToBase64(value.ticketImage) // Path to the image
  //     .then(
  //         (response) => {
  //             console.log(response); // "cGF0aC90by9maWxlLmpwZw=="
  //         }
  //     )
  //     .catch(
  //         (error) => {
  //             console.log(error); // Logs an error if there was one
  //         }
  //     )

  return (
    <form>
      <div className="row">
        {inputs?.map((input) => {
          if (input.type === 'textarea') {
            return (
              <div className="col-lg-12" key={input.id}>
                <TextInput
                  type={input.type}
                  value={input.value}
                  placeholder={input.placeholder}
                  selectData={input.selectData}
                  name={input.name}
                  icon={input.icon}
                  onChange={handleChange}
                />
              </div>
            )
          } else {
            return (
              <div className="col-lg-6" key={input.id}>
                <TextInput
                  type={input.type}
                  value={input.value}
                  placeholder={input.placeholder}
                  selectData={input.selectData}
                  name={input.name}
                  icon={input.icon}
                  onChange={handleChange}
                />
              </div>
            )
          }
        })}
        <div className="col-lg-6">
          <UploadImage
            title={t('submitForm.passport')}
            value={value}
            setValue={setValue}
            valueName="passportImage"
          />
        </div>
        <div className="col-lg-6">
          <UploadImage
            title={t('submitForm.ticket')}
            value={value}
            setValue={setValue}
            valueName="ticketImage"
          />
        </div>
        <div className="col-lg-6">
          <UploadImage
            title={t('submitForm.other')}
            value={value}
            setValue={setValue}
            valueName="otherImage"
          />
        </div>

        {/* <div className="col-lg-6">
          <TextInput
            type={'file'}
            value={''}
            placeholder={'img'}
            name={'passportImage'}
            onChange={handleChange}
            title={t('submitForm.passport')}
            fileName={fileName}
            setFileName={setFileName}
          />
        </div>
        <div className="col-lg-6">
          <TextInput
            type={'file'}
            value={''}
            placeholder={'img'}
            name={'ticketImage'}
            onChange={handleChange}
            title={t('submitForm.ticket')}
            fileName={fileName}
          />
        </div>
        <div className="col-lg-6">
          <TextInput
            type={'file'}
            value={''}
            placeholder={'img'}
            name={'otherImage'}
            onChange={handleChange}
            title={t('submitForm.other')}
            fileName={fileName}
          />
        </div> */}
        <div className="col-lg-12">
          <div className={styles.signature}>
            <div className={styles.signature__head}>
              <p className={styles.signature__title}>
                <strong>{t('submitForm.signatureTitle')}</strong>
                <span>
                  {t('submitForm.signatureText')}
                </span>
              </p>
            </div>
            <div className={styles.signature__body}>
              <ReactSignatureCanvas
                ref={(ref) => setSignature(ref)}
                onEnd={() => {
                  const res = signature.getTrimmedCanvas().toDataURL('image/png')
                  setValue({ ...value, "signature": res })
                }}
                penColor='blue'
                canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
            </div>
            <div>
              <button style={{
                marginTop: '20px',
                backgroundColor: '#4CAF4F',
                padding: '7px 75px',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
              }}
                onClick={e => {
                  e.preventDefault()
                  signature.clear()
                }}>{t('submitForm.clear')}</button>
            </div>
          </div>
          {/* <SignatureContent value={value} setValue={setValue}/> */}
          {/* <Signature value={value} valueName={"ticketImage"} setValue={setValue} title={'Electronic signature:'} desc={'Please sign the electronic signature.'}/> */}
        </div>
        <div>
          <br />
        </div>
        <div className="d-flex justify-content-center">
          <label>
            <input type="checkbox" />
            <span>
              {t('submitForm.iagree')} <Link target="_blank" to={`/terms-and-conditions?ref=${ref}`}>{t('submitForm.terms')}</Link>
            </span>
          </label>
        </div>
        <div>
          <button
            style={{
              border: "none",
              lineHeight: "24px",
              fontSize: "16px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",  // Centers text horizontally
              textAlign: "center",       // Ensures the text is centered
              borderRadius: "6px",
              backgroundColor: "#FD9B28",
              color: "#FFFFFF",
              width: "100%",
              height: "40px",
              marginTop: "20px",
              cursor: "pointer"
            }}
            onClick={(e) => uploadFile(e)}
          >
            {load ? 'loading' : t('submitForm.submit')}
          </button>
        </div>
      </div>

    </form>
  );
};

export default SendFormBody;
