import { useState } from "react";
import styles from './UploadWidget.module.scss';
import Loading from "../Loading/Loading";

const UploadImage = ({ value, setValue, valueName, title, name }) => {
    const [loading, setLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const now = new Date();
    const folderName = now.getTime();

    const handleChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "hi5bzww0"); // შენი upload preset
        formData.append("cloud_name", "dluqxr8lw");   // შენი cloud name
        formData.append("public_id", `${folderName}/${folderName}`);

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dluqxr8lw/image/upload", {
                method: "POST",
                body: formData
            })

            const data = await res.json();
            if (data.secure_url) {
                setValue({
                    ...value,
                    [valueName]: data.secure_url
                });
            } else {
                console.error("Upload error:", data);
            }
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setLoading(false);
            setUploaded(true)
        }
    };

    return (
        <label className={styles.uploadwidget}>
            <p className={styles.uploadwidget__title}>{title}</p>
            <div className={`${styles.uploadwidget__btn}`}>

                <input
                    className={`${styles.uploadwidget__input}`}
                    type={'file'}
                    accept="image/*"
                    // accept="image/jpeg, image/png"
                    onChange={handleChange}
                    style={{ display: "none" }}
                    id={`upload-${valueName}`}
                />
                {!loading && !uploaded && 'Format: JPEG,PNG'}
                {loading && <Loading />}
                {uploaded && (
                    <svg fill="#89fa85" width="20px" height="20px" viewBox="0 0 24 24" id="d9090658-f907-4d85-8bc1-743b70378e93" data-name="Livello 1" xmlns="http://www.w3.org/2000/svg"><title>prime</title><path id="70fa6808-131f-4233-9c3a-fc089fd0c1c4" data-name="done circle" d="M12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0ZM11.52,17L6,12.79l1.83-2.37L11.14,13l4.51-5.08,2.24,2Z"/></svg>
                )}

            </div>
        </label>

    );
};

export default UploadImage;
