const rateSectionModel = require("../jsonModels/rateSectionModel");
const { sendError } = require("../utils/body");

const getRateSection = async (req, res) => {
    try {
        return res.status(200).send(await rateSectionModel.find());
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting rates!");
    }
};

const createRateSection = async (req, res) => {
    try {
        const created = await rateSectionModel.create(req.body);
        return res.status(200).send(created);
    } catch (error) {
        return sendError(res, error, "Something went wrong while creating the rate!");
    }
};

const editRateSection = async (req, res) => {
    try {
        const { id, ...updates } = req.body;
        if (!id) return res.status(400).send("id is required.");

        const updated = await rateSectionModel.findOneAndUpdate({ id }, updates, {
            new: true,
            runValidators: true,
        });

        if (!updated) return res.status(404).send("Rate not found.");

        return res.status(200).send(updated);
    } catch (error) {
        return sendError(res, error, "Something went wrong while updating the rate!");
    }
};

module.exports = { getRateSection, createRateSection, editRateSection };
