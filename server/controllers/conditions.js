const ConditionsModal = require("../jsonModels/ConditionsModal");
const { sendError } = require("../utils/body");

const getConditions = async (req, res) => {
    try {
        return res.status(200).send(await ConditionsModal.find());
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting conditions!");
    }
};

const createConditions = async (req, res) => {
    try {
        const created = await ConditionsModal.create(req.body);
        return res.status(200).send(created);
    } catch (error) {
        return sendError(res, error, "Something went wrong while creating the condition!");
    }
};

const editConditions = async (req, res) => {
    try {
        // _id უცვლელია — თუ განახლებაში მოხვდება, MongoDB შეცდომას დააბრუნებს
        const { _id, ...updates } = req.body;
        if (!_id) return res.status(400).send("_id is required.");

        const updated = await ConditionsModal.findByIdAndUpdate(_id, updates, {
            new: true,
            runValidators: true,
        });

        if (!updated) return res.status(404).send("Condition not found.");

        return res.status(200).send(updated);
    } catch (error) {
        return sendError(res, error, "Something went wrong while updating the condition!");
    }
};

module.exports = { getConditions, createConditions, editConditions };
