import { useState } from "react";
import styles from './UploadWidget.module.scss';
import Loading from "../Loading/Loading";

const UploadImage = ({ value, setValue, valueName, title, name }) => {
    const [loading, setLoading] = useState(false);
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
        }
    };

    console.log(valueName)

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
                {!loading && 'Format: JPEG,PNG'}
                {loading && <Loading />}

            </div>
        </label>

    );
};

export default UploadImage;
