const { isEnabled, minScore } = require("../utils/recaptcha");

/**
 * საიტის გასაღები ბრაუზერს სჭირდება, მაგრამ NEXT_PUBLIC_* ცვლადები Next-ში
 * build-ის დროს იკერება — cPanel-ის runtime გარემო მათ ვერ მისწვდებოდა.
 * ამიტომ გასაღებს აქედან ვაწვდით: საიდუმლო არ არის (გვერდის HTML-ში ისედაც
 * ჩანს) და პანელზე/env-ზე შეცვლა build-ს აღარ მოითხოვს.
 */
const getRecaptchaConfig = (req, res) => {
    return res.status(200).json({
        enabled: isEnabled(),
        siteKey: process.env.RECAPTCHA_SITE_KEY || "",
        minScore: minScore(),
    });
};

module.exports = { getRecaptchaConfig };
