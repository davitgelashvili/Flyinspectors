const { login, logout, me, updateMe } = require("./controllers/auth");
const { register, getUsers, createUser, updateUser, deleteUser } = require("./controllers/users");
const {
  createClient,
  getClient,
  getClientsByCompanyId,
  getClientByDateTime,
  getID,
  getClientByUserId,
  editStatus,
  deleteClient,
} = require("./controllers/clients");
const { getCompany, createCompany, deleteCompany } = require("./controllers/companies");
const { getServices, createService, editServices } = require("./controllers/services");
const { getRateSection, createRateSection, editRateSection } = require("./controllers/rates");
const { getContactList, createContact, editContactList } = require("./controllers/contactList");
const { getConditions, createConditions, editConditions } = require("./controllers/conditions");
const { getPages, getPageBySlug, createPage, updatePage, deletePage } = require("./controllers/pages");
const { getActiveRedirects, getAllRedirects, createRedirect, updateRedirect, deleteRedirect } = require("./controllers/redirects");
const { getHero, updateHero } = require("./controllers/hero");
const { getOptions, updateOptions } = require("./controllers/options");
const { getHow, updateHow } = require("./controllers/how");
const { getWhy, updateWhy } = require("./controllers/why");
const { getFaqs, createFaq, updateFaq, deleteFaq } = require("./controllers/faq");
const { getMeta, updateMeta } = require("./controllers/meta");
const { getTerms, updateTerms } = require("./controllers/terms");
const { getOffices, updateOffices } = require("./controllers/offices");
const { emailSend } = require("./controllers/email");
const { clientSendEmail } = require("./controllers/clientSendEmail");
const { contact } = require("./controllers/contact");
const { getMailPassword, updateMailPassword, testMailPassword } = require("./controllers/mailSettings");
const { requireAuth, requireRole } = require("./middleware/auth");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Welcome to Directions API");
});

/* ── სესია და რეგისტრაცია ──────────────────────────────── */
router.post("/register", register);   // საჯარო — role ყოველთვის "user"
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.put("/me", requireAuth, updateMe);   // საკუთარი მონაცემები, role-ის გარეშე

/* ── საჯარო: საიტის კონტენტი (მხოლოდ კითხვა) ───────────── */
router.get("/services", getServices);
router.get("/rate", getRateSection);
router.get("/contactlist", getContactList);
router.get("/conditions", getConditions);
router.get("/hero", getHero);
router.get("/options", getOptions);
router.get("/how", getHow);
router.get("/why", getWhy);
router.get("/faq", getFaqs);                // ?home=true — მხოლოდ მთავარზე მონიშნულები
router.get("/meta", getMeta);
router.get("/terms", getTerms);
router.get("/offices", getOffices);
router.get("/pages", getPages);            // ?all=true — ადმინისთვის, გამოუქვეყნებლებთან ერთად
router.get("/pages/:slug", getPageBySlug);
router.get("/redirects", getActiveRedirects);   // მხოლოდ ჩართულები — საიტის middleware იყენებს

/* ── საჯარო: მომხმარებლის ფორმები ──────────────────────── */
router.post("/client", createClient);           // განაცხადის შევსება
router.post("/id", getID);                      // სტატუსის შემოწმება (მხოლოდ status)
router.post("/contact", contact);               // საკონტაქტო ფორმა
router.post("/email", emailSend);               // განაცხადის შეტყობინება გუნდს
router.post("/sendtoclient", clientSendEmail);  // განაცხადის ნომერი კლიენტს

/* ── კონტენტის მართვა: editor ან admin ─────────────────── */
const editor = [requireAuth, requireRole("editor")];
router.post("/services", ...editor, createService);
router.put("/services/id", ...editor, editServices);

router.post("/rate", ...editor, createRateSection);
router.put("/rate/id", ...editor, editRateSection);

router.post("/contactlist", ...editor, createContact);
router.put("/contactlist", ...editor, editContactList);

router.post("/conditions", ...editor, createConditions);
router.put("/conditions", ...editor, editConditions);

router.put("/hero", ...editor, updateHero);
router.put("/options", ...editor, updateOptions);
router.put("/how", ...editor, updateHow);
router.put("/why", ...editor, updateWhy);

router.post("/faq", ...editor, createFaq);
router.put("/faq", ...editor, updateFaq);
router.put("/faq/delete", ...editor, deleteFaq);

router.put("/meta", ...editor, updateMeta);
router.put("/terms", ...editor, updateTerms);
router.put("/offices", ...editor, updateOffices);

router.post("/pages", ...editor, createPage);
router.put("/pages", ...editor, updatePage);
router.put("/pages/delete", ...editor, deletePage);

router.get("/redirects/all", ...editor, getAllRedirects);
router.post("/redirects", ...editor, createRedirect);
router.put("/redirects", ...editor, updateRedirect);
router.put("/redirects/delete", ...editor, deleteRedirect);

/* ── განაცხადები: მხოლოდ admin ─────────────────────────── */
const adminOnly = [requireAuth, requireRole()];
router.get("/client", ...adminOnly, getClient);
router.get("/client/:userId", ...adminOnly, getClientByUserId);   // სრული ჩანაწერი (/id საჯაროა — მხოლოდ status)
router.get("/clientbycompany", ...adminOnly, getClientsByCompanyId);
router.post("/datetime", ...adminOnly, getClientByDateTime);
router.put("/client/id", ...adminOnly, editStatus);
router.put("/delete", ...adminOnly, deleteClient);

/* ── მომხმარებლების მართვა: მხოლოდ admin ───────────────── */
router.get("/users", ...adminOnly, getUsers);
router.post("/users", ...adminOnly, createUser);
router.put("/users", ...adminOnly, updateUser);
router.put("/users/delete", ...adminOnly, deleteUser);

/* ── კომპანიები (განაცხადების რეფერალი): მხოლოდ admin ──── */
router.get("/company", ...adminOnly, getCompany);
router.post("/company", ...adminOnly, createCompany);
router.put("/company/delete", ...adminOnly, deleteCompany);

/* ── მეილის აპლიკაციის პაროლი: მხოლოდ admin ─────────────── */
router.get("/mailpassword", ...adminOnly, getMailPassword);
router.put("/mailpassword", ...adminOnly, updateMailPassword);
router.post("/mailpassword/test", ...adminOnly, testMailPassword);

module.exports = router;
