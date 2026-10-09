'use client'

import { useState } from "react";
import styles from './UploadWidget.module.scss';
import Loading from "../Loading/Loading";
import { uploadToCloudinary, cloudinaryImage } from "@/utils/cloudinary";

// ფოტოს ატვირთვა Cloudinary-ზე, პრევიუ, წაშლა და (სურვილისამებრ) alt ტექსტი.
//   value / setValue / valueName — ფოტოს მისამართი მშობლის ობიექტის ამ ველში ინახება
//   alt / setAlt                 — alt-ის ტექსტი; setAlt-ის გადმოცემისას alt-ის ველი ჩანს
//   preview                      — ატვირთულის პატარა პრევიუ (ადმინში გვინდა, საიტის ფორმაში არა)
const UploadImage = ({ value, setValue, valueName, title, name, alt, setAlt, altTitle, altPlaceholder, preview = false }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // "ატვირთულია" ნიშანი თვითონ მნიშვნელობიდან მოდის და არა ცალკე state-იდან,
    // თორემ წაშლის შემდეგ მწვანე ✓ ადგილზე დარჩებოდა
    const current = value?.[valueName] || '';

    const handleChange = async (e) => {
        const file = e.target.files[0];
        // input-ს ვასუფთავებთ, რომ წაშლის შემდეგ იგივე ფაილი ხელახლა აირჩეოდეს
        e.target.value = '';
        if (!file) return;

        setLoading(true);
        setError('');
        try {
            const url = await uploadToCloudinary(file);
            setValue({ ...value, [valueName]: url });
        } catch (err) {
            setError(err?.message || 'ატვირთვა ვერ მოხერხდა');
        } finally {
            setLoading(false);
        }
    };

    const remove = () => {
        setValue({ ...value, [valueName]: '' });
        setError('');
        // ფოტოს გარეშე alt-ს აზრი აღარ აქვს
        if (setAlt) setAlt('');
    };

    return (
        <div className={styles.uploadwidget}>
            {title && <p className={styles.uploadwidget__title}>{title}</p>}

            <label className={styles.uploadwidget__btn}>
                <input
                    className={styles.uploadwidget__input}
                    type={'file'}
                    accept="image/*"
                    onChange={handleChange}
                    style={{ display: "none" }}
                    id={`upload-${valueName}`}
                    name={name}
                />
                {loading
                    ? <Loading />
                    : current
                        ? (
                            <span className={styles.uploadwidget__done}>
                                <svg fill="#89fa85" width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0ZM11.52,17L6,12.79l1.83-2.37L11.14,13l4.51-5.08,2.24,2Z" /></svg>
                                ფოტოს შეცვლა
                            </span>
                        )
                        : 'Format: JPEG, PNG, WebP'}
            </label>

            {error && <p className={styles.uploadwidget__error}>{error}</p>}

            {current && (
                <div className={styles.uploadwidget__file}>
                    {preview && (
                        <img src={cloudinaryImage(current)} alt="" className={styles.uploadwidget__preview} />
                    )}
                    <button type="button" className={styles.uploadwidget__remove} onClick={remove}>
                        ფოტოს წაშლა
                    </button>
                </div>
            )}

            {setAlt && (
                <label className={styles.uploadwidget__alt}>
                    <span className={styles.uploadwidget__altlabel}>
                        {altTitle || 'ფოტოს აღწერა (alt) — SEO-სთვის'}
                    </span>
                    <input
                        type="text"
                        className={styles.uploadwidget__altinput}
                        value={alt || ''}
                        placeholder={altPlaceholder || 'მაგ. მგზავრი აეროპორტის დარბაზში'}
                        onChange={(e) => setAlt(e.target.value)}
                    />
                </label>
            )}
        </div>
    );
};

export default UploadImage;
