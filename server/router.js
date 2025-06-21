const { contact } = require('./controllers/contact');
const {createClient} = require('./controllers/createClient');
const { editStatus } = require('./controllers/editStatus');
const {emailSend} = require('./controllers/email');
const { getClient } = require('./controllers/getClient');
const { getID } = require('./controllers/getID');
const { getServices } = require('./controllers/getServices');
const { editServices } = require('./controllers/editServices');
const { createRateSection } = require('./controllers/createRateSection');
const { getRateSection } = require('./controllers/getRateSection');
const { editRateSection } = require('./controllers/editRateSection');
const { clientSendEmail } = require('./controllers/clientSendEmail');
const { deleteClient } = require('./controllers/deleteClient');
const { createContact } = require('./controllers/createContact');
const { getContactList } = require('./controllers/getContactList');
const { editContactList } = require('./controllers/editContactList');
const { createConditions } = require('./controllers/createConditions');
const { editConditions } = require('./controllers/editConditions');
const { getConditions } = require('./controllers/getConditions');
const { getClientByDateTime } = require('./controllers/getClientByDateTime');
const { createCompany } = require('./controllers/createCompany');
const { getCompany } = require('./controllers/getCompany');
const { login } = require('./controllers/login');
const { getClientsByCompanyId } = require('./controllers/getClientsByCompanyId');
const { deleteCompany } = require('./controllers/deleteCompany');

const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Welcome to Directions API");
});

router.get("/company", getCompany);
router.post("/company", createCompany);
router.post("/login", login);
router.put("/company/delete", deleteCompany);

router.get("/clientbycompany", getClientsByCompanyId);
router.post("/client", createClient);
router.post("/email", emailSend);
router.post("/sendtoclient", clientSendEmail);
router.post("/contact", contact);
router.get("/client", getClient);
router.post("/id", getID);
router.post("/datetime", getClientByDateTime);
router.put("/client/id", editStatus);
router.put("/delete", deleteClient);

router.get("/services", getServices);
router.put("/services/id", editServices);

router.post("/rate", createRateSection);
router.get("/rate", getRateSection);
router.put("/rate/id", editRateSection);

router.post("/contactlist", createContact);
router.get("/contactlist", getContactList);
router.put("/contactlist", editContactList);


router.post("/conditions", createConditions);
router.get("/conditions", getConditions);
router.put("/conditions", editConditions);
router.post("/upload", editConditions);



module.exports = router;
