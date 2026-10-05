const contactModal = require("../jsonModels/contactModal");
const { sendError } = require("../utils/body");

const getContactList = async (req, res) => {
    try {
        return res.status(200).send(await contactModal.find());
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting the contact list!");
    }
};

const createContact = async (req, res) => {
    try {
        const created = await contactModal.create(req.body);
        return res.status(200).send(created);
    } catch (error) {
        return sendError(res, error, "Something went wrong while creating the contact!");
    }
};

// საკონტაქტო მონაცემები ერთ დოკუმენტშია — ფრონტი res[0]-ს იღებს, ამიტომ საძიებო გასაღები არ არის.
// ძველ ვერსიაში findOneAndUpdate ერთი არგუმენტით იძახებოდა, ანუ განახლების ობიექტი
// ფილტრად გადაეცემოდა და ჩანაწერი რეალურად არ იცვლებოდა.
const editContactList = async (req, res) => {
    try {
        const updated = await contactModal.findOneAndUpdate({}, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updated) return res.status(404).send("Contact list not found.");

        return res.status(200).send(updated);
    } catch (error) {
        return sendError(res, error, "Something went wrong while updating the contact list!");
    }
};

module.exports = { getContactList, createContact, editContactList };
