/**
 * ბლოგის მიგრაცია: 4 სტატიკური სტატია (fly/src/views/BlogPageMore*) ბაზაში გადმოდის.
 * ძველი მისამართები 301-ით ახალზე მიდის — წესები საიტის middleware.js-შია ჩაწერილი.
 *
 * გაშვება:
 *   node scripts/seedPosts.js --list     # რა არის ბაზაში
 *   node scripts/seedPosts.js --apply    # ჩაწერა (slug-ით; ხელახლა გაშვება უსაფრთხოა)
 *
 * ტექსტი მხოლოდ ინგლისურად არსებობდა — ქართული თარგმანი ძველ გვერდებზეც არ იყო.
 * ამიტომ ka ცარიელია და საიტი ინგლისურს აჩვენებს (იგივე წესი, რაც გვერდებს), სათაურისა
 * და აღწერის გარდა — ისინი ძველი მეტა ტეგებიდან მოდის და ქართულადაც არსებობდა.
 *
 * სურათები fly/public/blog/-შია გადატანილი, ანუ მისამართები ფარდობითია.
 * ახალ სტატიებს ადმინი Cloudinary-ზე ატვირთავს.
 */
const mongoose = require("mongoose");
require("dotenv").config();

const Post = require("../jsonModels/postModal");
const Meta = require("../jsonModels/metaModal");
const { sanitizeHtml } = require("../utils/sanitizeHtml");

const section = (title, image, alt, text) =>
    `<h2>${title}</h2>` +
    `<p><img src="${image}" alt="${alt}" data-align="left" data-size="50">${text}</p>`;

const POSTS = [
    {
        slug: "flight-cancellation-reasons",
        cover: "/blog/cancelled-flights.png",
        coverAlt: {
            en: "A passenger aircraft on the apron",
            ka: "სამგზავრო თვითმფრინავი აეროპორტის ბაქანზე",
        },
        title: {
            en: "The most common reasons why flights get cancelled",
            ka: "ფრენების გაუქმების ყველაზე გავრცელებული მიზეზები",
        },
        excerpt: {
            en: "Bad weather, mechanical issues, lack of aircraft or passengers — why airlines cancel flights and what it means for your rights.",
            ka: "ამინდი, ტექნიკური ხარვეზი, თვითმფრინავის ან მგზავრების ნაკლებობა — რატომ უქმდება რეისები და რას ნიშნავს ეს თქვენი უფლებებისთვის.",
        },
        metaTitle: {
            en: "The most common reasons why flights get cancelled — Flyinspectors",
            ka: "ფრენების გაუქმების ყველაზე გავრცელებული მიზეზები — Flyinspectors",
        },
        metaDescription: {
            en: "Bad weather, mechanical issues, lack of aircraft or passengers — why airlines cancel flights and what it means for your rights.",
            ka: "ამინდი, ტექნიკური ხარვეზი, თვითმფრინავის ან მგზავრების ნაკლებობა — რატომ უქმდება რეისები და რას ნიშნავს ეს თქვენი უფლებებისთვის.",
        },
        content: {
            en:
                "<p>Summer, vacations, holidays, these are periods when most people plan their dream trips. Everything is ready and only thing you have to do, is to go to the airport and get in your plane. What is the worst that may happen when you are going to start your trip? — Words on the huge screen: …..flight cancelled! Why happened so, that flights get cancelled?</p>" +
                section(
                    "Mechanical issues",
                    "/blog/mechanical-issues.png",
                    "Aircraft maintenance at the airport",
                    "Anything remotely out of sync in the aircraft will be cause for either delay or cancellation. Every part of the plane needs to be in perfect condition, so checking everything usually takes more time and it causes delay or cancellation."
                ) +
                section(
                    "Bad weather",
                    "/blog/bad-weather.jpg",
                    "Storm clouds over the runway",
                    "Weather conditions are the most common reasons for flight delay or cancellation. It can be a very good weather, sunny and dry where you are, but strong wind and storm in the place which is your destination. Such weather conditions make the plane stay on the ground and interrupt planned flight."
                ) +
                section(
                    "Lack of passengers",
                    "/blog/lack-of-passengers.jpg",
                    "Empty seats in an aircraft cabin",
                    "Flying a plane is very expensive. There are several payments and fees which has the airline, like fuel and vehicles and etc. So, if the number of empty seats in the plane is big, the flight probably gets cancelled."
                ) +
                section(
                    "Lack of aircraft",
                    "/blog/lack-of-aircraft.jpg",
                    "An aircraft parked at the gate",
                    "An airline operates a fixed fleet. When an aircraft is delayed, grounded or reassigned to another route, there is often no spare plane to take its place — and the flight gets cancelled."
                ),
            ka: "",
        },
        publishedAt: "2024-06-01",
    },
    {
        slug: "best-airports-in-the-world",
        cover: "/blog/airports.jpg",
        coverAlt: {
            en: "A bright, spacious airport terminal",
            ka: "ნათელი, ფართო აეროპორტის ტერმინალი",
        },
        title: {
            en: "Airports that you may never want to leave",
            ka: "აეროპორტები, რომელთა დატოვებაც არ მოგინდებათ",
        },
        excerpt: {
            en: "A look at the most comfortable airports in the world, where waiting for a flight becomes part of the journey.",
            ka: "მსოფლიოს ყველაზე კომფორტული აეროპორტები, სადაც რეისის ლოდინი მოგზაურობის ნაწილად იქცევა.",
        },
        metaTitle: {
            en: "Airports that you may never want to leave — Flyinspectors",
            ka: "აეროპორტები, რომელთა დატოვებაც არ მოგინდებათ — Flyinspectors",
        },
        metaDescription: {
            en: "A look at the most comfortable airports in the world, where waiting for a flight becomes part of the journey.",
            ka: "მსოფლიოს ყველაზე კომფორტული აეროპორტები, სადაც რეისის ლოდინი მოგზაურობის ნაწილად იქცევა.",
        },
        content: {
            en:
                "<p>International air travel is normally a pretty stressful affair. We hustle just to get to the airport. Then we stand through long lines in both security and passport check, pass all necessary stages. These everything may be exhausting. But there are some airports out there that you may never want to leave. These airports were built to impress travelers, not just to shuttle them around the world. Let’s take a look at some of the coolest attractions at airports:</p>" +
                section(
                    "Hong Kong International Airport (Hong Kong SAR, China) — Aviation Museum",
                    "/blog/airport-terminal.jpg",
                    "Hong Kong International Airport terminal",
                    "Where do we begin with the Hong Kong International Airport? There’s an IMAX, virtual golf course, aromatherapy spa, and tons of shops inside. Oh, there’s also a small aviation museum complete with flight simulators called the Aviation Discovery Centre."
                ) +
                section(
                    "Hamad International Airport (Qatar) — Indoor swimming pool",
                    "/blog/airport-pool.jpg",
                    "Indoor swimming pool at the airport",
                    "Opened in 2014, the Hamad International Airport features a 25 meter, temperature-controlled indoor lap pool. It is open to the public and for only $35 one can take advantage of the pool, gym and Jacuzzi."
                ) +
                section(
                    "Incheon International Airport (South Korea) — Gardens",
                    "/blog/airport-terminal.jpg",
                    "Garden inside Incheon International Airport",
                    "Since opening in 2001, this has been rated one of the top airports in the world. Incheon International includes fascinating architecture and various gardens sprinkled throughout its terminals."
                ) +
                section(
                    "Kuala Lumpur International Airport (Malaysia) — Jungle boardwalk",
                    "/blog/airport-terminal.jpg",
                    "Jungle boardwalk inside Kuala Lumpur International Airport",
                    "One of the world’s busiest airports since it opened in 1998, travelers are often amazed at the Jungle Boardwalk and the palm trees inside the Satellite Terminal gardens, which are encased in circular glass."
                ) +
                section(
                    "Munich International Airport (Germany) — Ice rink",
                    "/blog/airport-terminal.jpg",
                    "Winter market at Munich International Airport",
                    "There is no other airport in the world that supplies its travelers with both a brewery and giant ice rink. During Christmas the airport holds a winter market where travelers can skate around and then try various brews."
                ) +
                section(
                    "Adolfo Suárez Madrid–Barajas Airport (Spain) — Unique architecture",
                    "/blog/airport-terminal.jpg",
                    "Terminal 4 roof at Madrid-Barajas Airport",
                    "One of the two largest airports in Europe based on sheer size, Terminal 4 at Madrid-Barajas is the crown jewel. With angular architecture, flowing dome roofs, circular ceiling windows, and giant cross beams, Terminal 4 is a modern wonder."
                ) +
                section(
                    "San Francisco International Airport (U.S.A.) — Yoga room",
                    "/blog/airport-yoga.jpg",
                    "Yoga room at San Francisco International Airport",
                    "San Francisco International Airport’s international terminal features a yoga room to offer its travelers a way to relax after a long overnight flight. There is also the SFO Library and Museum in the International Terminal that has exhibits and books on hand."
                ),
            ka: "",
        },
        publishedAt: "2024-06-15",
    },
    {
        slug: "travelling-with-pets",
        cover: "/blog/pets.jpg",
        coverAlt: {
            en: "A dog in a travel carrier at the airport",
            ka: "ძაღლი სამგზავრო გადასაყვან ყუთში აეროპორტში",
        },
        title: {
            en: "Travelling with pets",
            ka: "მოგზაურობა ცხოველებთან ერთად",
        },
        excerpt: {
            en: "Vaccination requirements, carrier rules and tips to avoid problems when flying with your pet.",
            ka: "ვაქცინაციის მოთხოვნები, გადაყვანის წესები და რჩევები, რომ ფრენისას პრობლემები აარიდოთ თავი.",
        },
        metaTitle: {
            en: "Travelling with pets — Flyinspectors",
            ka: "მოგზაურობა ცხოველებთან ერთად — Flyinspectors",
        },
        metaDescription: {
            en: "Vaccination requirements, carrier rules and tips to avoid problems when flying with your pet.",
            ka: "ვაქცინაციის მოთხოვნები, გადაყვანის წესები და რჩევები, რომ ფრენისას პრობლემები აარიდოთ თავი.",
        },
        content: {
            en:
                "<p>Everyone wants to travel with their pets, here are some tips, how to avoid problems while traveling.</p>" +
                section(
                    "Your animal must have all required vaccines in order to be permitted on board",
                    "/blog/pets-vaccination.jpg",
                    "A veterinarian examining a cat",
                    "All dogs and cats traveling within the European Union must be identified by an electronic chip. It should also possess a European passport. Provided and completed by an authorized veterinarian, the passport identifies your pet and certifies that it is properly vaccinated. We recommend that you check with the embassy of your destination country to learn more about national regulations. For example, for travel to Ireland, Sweden, the United Kingdom or Malta, additional sanitary conditions apply."
                ) +
                section(
                    "Check the regulations of both countries",
                    "/blog/pets-regulation.jpg",
                    "Pet travel documents",
                    "For travel outside the European Union, be sure to consider the regulations enforced in both the originating and destination countries (vaccinations, quarantine, etc.). Airlines decline all responsibility for any costs incurred (booking modification fees, hotel stay, kennel fees, etc.) in case your animal is refused transport due to non-compliance with their provisions, or in case your animal is refused upon arrival due to non-compliance with the provisions established by the country of destination."
                ),
            ka: "",
        },
        publishedAt: "2024-07-01",
    },
    {
        slug: "what-we-know-about-pilots",
        cover: "/blog/pilots.jpg",
        coverAlt: {
            en: "Pilots in an aircraft cockpit",
            ka: "პილოტები თვითმფრინავის კაბინაში",
        },
        title: {
            en: "What we know about pilots",
            ka: "რა ვიცით პილოტების შესახებ",
        },
        excerpt: {
            en: "Aviation shapes the modern world, but how much do we really know about the people who fly the aircraft?",
            ka: "ავიაცია თანამედროვე სამყაროს ქმნის, მაგრამ რამდენად ვიცნობთ ადამიანებს, რომლებიც თვითმფრინავს მართავენ?",
        },
        metaTitle: {
            en: "What we know about pilots — Flyinspectors",
            ka: "რა ვიცით პილოტების შესახებ — Flyinspectors",
        },
        metaDescription: {
            en: "Aviation shapes the modern world, but how much do we really know about the people who fly the aircraft?",
            ka: "ავიაცია თანამედროვე სამყაროს ქმნის, მაგრამ რამდენად ვიცნობთ ადამიანებს, რომლებიც თვითმფრინავს მართავენ?",
        },
        content: {
            en:
                "<p>There are probably no people who would deny the importance of aviation in today’s fast-moving world. The question is how much do we really know about aviation and pilots? Undoubtedly, there are countless interesting and surprising facts about pilots that may surprise you. That is why we have chosen to create a list of the most astonishing facts about pilots. Who knows, maybe after reading this article you will be able to add some new facts about aviation and the pilot profession to your knowledge pool.</p>",
            ka: "",
        },
        publishedAt: "2024-07-15",
    },
];

// ბლოგის სიის მეტა ტეგები: ადმინი → მეტა თეგები → ბლოგი.
// ჩანაწერის გარეშე სიას სათაური არ ექნებოდა (ძველი ტექსტი pageMeta.js-იდან მოვიდა).
const BLOG_META = {
    path: "/blog",
    title: {
        en: "Blog — Flyinspectors",
        ka: "ბლოგი — Flyinspectors",
    },
    description: {
        en: "Articles about air passenger rights, flight cancellations and delays, airports and travel tips.",
        ka: "სტატიები მგზავრთა უფლებების, ფრენის გაუქმებისა და დაგვიანების, აეროპორტებისა და მოგზაურობის შესახებ.",
    },
};

async function main() {
    const mode = process.argv[2];

    if (mode !== "--list" && mode !== "--apply") {
        console.error("გამოიყენე --list ან --apply");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URL);

    if (mode === "--list") {
        const posts = await Post.find().sort({ publishedAt: -1 });
        console.log(`posts კოლექციაში ${posts.length} ჩანაწერია`);
        for (const p of posts) {
            const date = p.publishedAt ? p.publishedAt.toISOString().slice(0, 10) : "—";
            const ka = p.title?.ka?.trim() ? "ka+en" : "en";
            console.log(`  ${date}  ${p.slug.padEnd(34)} ${ka.padEnd(6)} ${p.published ? "" : "(გამოუქვეყნებელი)"}`);
        }
        await mongoose.disconnect();
        return;
    }

    for (const post of POSTS) {
        const data = {
            ...post,
            publishedAt: new Date(post.publishedAt),
            content: {
                en: sanitizeHtml(post.content.en),
                ka: sanitizeHtml(post.content.ka),
            },
        };

        // slug-ზე upsert: ხელახალი გაშვება დუბლს არ ქმნის. ადმინში შეტანილი
        // ცვლილება გადაიწერება, ამიტომ სკრიპტი მხოლოდ მიგრაციისთვისაა.
        const result = await Post.findOneAndUpdate(
            { slug: post.slug },
            { $set: data },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true, rawResult: true }
        );

        const created = !result.lastErrorObject?.updatedExisting;
        console.log(`  ${created ? "შეიქმნა " : "განახლდა"}  ${post.slug}`);
    }

    // სიის მეტა ტეგები — მხოლოდ თუ ჯერ არ არის (ადმინში ჩასწორებულს არ ვეხებით)
    const existingMeta = await Meta.findOne({ path: BLOG_META.path });
    if (existingMeta) {
        console.log(`\n  მეტა "/blog" უკვე არსებობს — ხელუხლებელი დარჩა`);
    } else {
        await Meta.create(BLOG_META);
        console.log(`\n  მეტა "/blog" შეიქმნა`);
    }

    console.log("\nმზადაა. ქართული ტექსტი სტატიებს არ აქვს — ადმინში (ბლოგი) უნდა ჩაიწეროს.");
    console.log("მის გარეშე ქართულ ვერსიაზე ინგლისური ტექსტი ჩანს.");

    await mongoose.disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
