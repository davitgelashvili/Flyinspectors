const servicesModal = require("../jsonModels/servicesModal");
const { sendError } = require("../utils/body");

const getServices = async (req, res) => {
    try {
        return res.status(200).send(await servicesModal.find());
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting services!");
    }
};

const createService = async (req, res) => {
    try {
        // სქემაში არარსებულ ველებს mongoose თავად აგდებს (strict: true)
        const created = await servicesModal.create(req.body);
        return res.status(200).send(created);
    } catch (error) {
        return sendError(res, error, "Something went wrong while creating the service!");
    }
};

const editServices = async (req, res) => {
    try {
        // id საძიებო გასაღებია — განახლებაში არ უნდა მოხვდეს, თორემ ჩანაწერს გასაღები შეეცვლება
        const { id, ...updates } = req.body;
        if (!id) return res.status(400).send("id is required.");

        const updated = await servicesModal.findOneAndUpdate({ id }, updates, {
            new: true,
            runValidators: true,
        });

        if (!updated) return res.status(404).send("Service not found.");

        return res.status(200).send(updated);
    } catch (error) {
        return sendError(res, error, "Something went wrong while updating the service!");
    }
};

module.exports = { getServices, createService, editServices };
