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

// ---------- WebP/AVIF მიწოდება ----------
// ფორმატს არ ვცვლით ატვირთვისას: Cloudinary ორიგინალს ინახავს და ფორმატს გაცემის მომენტში ირჩევს
// ბრაუზერის Accept ჰედერის მიხედვით (`f_auto`) — Chrome/Edge იღებს AVIF-ს, Safari WebP-ს,
// ძველი ბრაუზერი ორიგინალ JPEG/PNG-ს. `q_auto` წონასაც ჭრის ხარისხის დაკარგვის გარეშე.
// ამიტომ ტრანსფორმაცია მისამართს ხატვის მომენტში ემატება და არა ბაზაში ინახება:
//   — უკვე ატვირთულ ყველა ფოტოზე მაშინვე მოქმედებს, ხელახალი ატვირთვის გარეშე
//   — ბაზაში სუფთა, კანონიკური მისამართი რჩება და ტრანსფორმაციის შეცვლა აქ ერთ ადგილას ხდება

const UPLOAD_MARKER = "/image/upload/";

// ტრანსფორმაციის ნაწილი ყოველთვის "<1-3 ასო>_<მნიშვნელობა>"-ია (f_auto, q_80, w_600, c_fill).
// წერტილს არ ვუშვებთ, თორემ ფაილის სახელი ("meta_en_abc.jpg") ტრანსფორმაციად ჩაითვლებოდა.
const TRANSFORM_PART = /^[a-z]{1,3}_[^/.]+$/i;

const isTransform = (segment) =>
    Boolean(segment) && segment.split(",").every((part) => TRANSFORM_PART.test(part));

// Cloudinary-ის ფოტოს მისამართი მითითებული ფორმატითა და ხარისხით.
// არა-Cloudinary მისამართი და SVG (ვექტორი — f_auto მას რასტრად აქცევდა) უცვლელი რჩება.
// იდემპოტენტურია: უკვე ჩაწერილი f_/q_ გადაიწერება, დანარჩენი ტრანსფორმაცია (ზომა, ჭრა) ნარჩუნდება.
export function cloudinaryImage(url, { format = "auto", quality = "auto" } = {}) {
    if (typeof url !== "string") return url;

    const at = url.indexOf(UPLOAD_MARKER);
    if (at === -1) return url;

    const head = url.slice(0, at + UPLOAD_MARKER.length);
    let tail = url.slice(at + UPLOAD_MARKER.length);

    if (/\.svg(\?|#|$)/i.test(tail)) return url;

    const [first, ...rest] = tail.split("/");
    const kept = [];
    if (isTransform(first)) {
        kept.push(...first.split(",").filter((part) => !/^[fq]_/i.test(part)));
        tail = rest.join("/");
    }

    return `${head}${[`f_${format}`, `q_${quality}`, ...kept].join(",")}/${tail}`;
}

// გაზიარების ფოტო (og:image). Facebook-ის, Viber-ის და Twitter-ის crawler-ები Accept ჰედერს
// სანდოდ არ აგზავნიან, ამიტომ f_auto-ს არ ვანდობთ და კონკრეტულ JPEG-ს ვაძლევთ.
export const cloudinarySocialImage = (url) => cloudinaryImage(url, { format: "jpg" });

// რედაქტორით ჩაწერილ HTML-ში ყველა <img src> Cloudinary-ის ოპტიმიზებულ მისამართზე გადაგვყავს
export function cloudinaryHtmlImages(html) {
    if (!html) return html;

    return html.replace(/<img\s([^>]*)>/gi, (tag, attrs) => {
        const next = attrs.replace(
            /(^|\s)(src\s*=\s*")([^"]*)(")/i,
            (match, lead, key, src, end) => `${lead}${key}${cloudinaryImage(src)}${end}`
        );
        return next === attrs ? tag : `<img ${next}>`;
    });
}
