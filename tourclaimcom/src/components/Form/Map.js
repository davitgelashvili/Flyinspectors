import React, { useEffect, useState } from "react";
import styles from "./Map.module.scss"
const Map = () => {
  const [lang,setLang] = useState(true)
  const windowUrl =  window.location.hostname

  useEffect(()=> {
    if(windowUrl == 'flyinspectors.com'){
      setLang(true)
    }
    
    if(windowUrl == 'flyinspectors.ge'){
      setLang(true)
    }
    
    if(windowUrl == 'flyinspectors.co.uk'){
      setLang(false)
    }

    if(windowUrl == 'localhost'){
      setLang(true)
    }

    if(windowUrl == '127.0.0.1'){
      setLang(false)
    }

  }, [windowUrl])
  return (
    <>
    {
      lang ? (
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2849.498518058206!2d44.766428375761464!3d41.73270527450545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x404472e624300001%3A0xf29f5a502e9a27ae!2s5%20Iuri%20Gagarini%20St%2C%20T&#39;bilisi%200160!5e1!3m2!1sen!2sge!4v1734807667252!5m2!1sen!2sge"
          className={styles.map}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Flyinspectors Location"
        ></iframe>
      ) : (
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d9529.207857877456!2d-6.2483383!3d53.3378506!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48670e9658248405%3A0x577175eee69e3490!2sClifton%20House%20BusinessCentre!5e0!3m2!1sen!2sge!4v1733342692217!5m2!1sen!2sge"
          className={styles.map}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Flyinspectors Location"
        ></iframe>
      )
    }
    </>
  );
};

export default Map;
