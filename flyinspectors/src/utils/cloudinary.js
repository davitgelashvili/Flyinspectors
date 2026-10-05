// ფოტოს ატვირთვა Cloudinary-ზე პირდაპირ ბრაუზერიდან (unsigned preset) — იგივე ანგარიში და preset,
// რასაც UploadWidget იყენებს. აბრუნებს სურათის https მისამართს.
const CLOUD_NAME = "dluqxr8lw";
const UPLOAD_PRESET = "hi5bzww0";

export async function uploadToCloudinary(file) {
    const folder = Date.now();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("cloud_name", CLOUD_NAME);
    formData.append("public_id", `${folder}/${folder}`);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
    });

    const data = await res.json();
    if (!data.secure_url) throw new Error(data?.error?.message || "Upload failed");

    return data.secure_url;
}
