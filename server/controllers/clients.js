const ClientModal = require("../jsonModels/clientModal");
const { sendError } = require("../utils/body");

const INITIAL_STATUS = "Application has received";

const generateUniqueId = async () => {
    for (;;) {
        const candidate = Math.floor(10000 + Math.random() * 90000).toString();
        const existing = await ClientModal.findOne({ userId: candidate });
        if (!existing) return candidate;
    }
};

const createClient = async (req, res) => {
    try {
        // სერვერის ველები spread-ის შემდეგ იწერება, ანუ კლიენტის გამოგზავნილს
        // გადააწერს — userId, status და oldStatus გარედან ვერ დაყენდება
        const client = await ClientModal.create({
            ...req.body,
            userId: await generateUniqueId(),
            status: INITIAL_STATUS,
            oldStatus: INITIAL_STATUS,
        });

        return res.status(200).send(client);
    } catch (error) {
        return sendError(res, error, "Something went wrong while creating the application!");
    }
};

const getClient = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const reverse = req.query.reverse === "true";

        const clients = await ClientModal.find()
            .sort({ _id: reverse ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalClients = await ClientModal.countDocuments();

        return res.status(200).send({
            data: clients,
            pagination: {
                page,
                limit,
                totalClients,
                totalPages: Math.ceil(totalClients / limit),
                reverse,
            },
        });
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting clients!");
    }
};

const getClientsByCompanyId = async (req, res) => {
    try {
        const { companyId } = req.query;
        if (!companyId) return res.status(400).send("companyId is required");

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const reverse = req.query.reverse === "true";

        const clients = await ClientModal.find({ companyId })
            .sort({ _id: reverse ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalClients = await ClientModal.countDocuments({ companyId });

        return res.status(200).json({
            data: clients,
            pagination: {
                page,
                limit,
                totalClients,
                totalPages: Math.ceil(totalClients / limit),
                reverse,
            },
        });
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting clients!");
    }
};

const getClientByDateTime = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        if (!startDate || !endDate) {
            return res.status(400).send("startDate and endDate are required.");
        }

        const clients = await ClientModal.aggregate([
            { $addFields: { createDateISO: { $toDate: "$createDate" } } },
            { $match: { createDateISO: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
        ]);

        return res.status(200).json(clients);
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting clients!");
    }
};

// ადმინი: სრული ჩანაწერი ნომრით. getID-ს ვერ ვიყენებთ — ის საჯაროა და მხოლოდ სტატუსს აბრუნებს.
const getClientByUserId = async (req, res) => {
    try {
        const client = await ClientModal.findOne({ userId: req.params.userId });
        if (!client) return res.status(404).send("Application not found.");

        return res.status(200).send(client);
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting the application!");
    }
};

// საჯარო: კლიენტი განაცხადის ნომრით სტატუსს ამოწმებს.
// ნომერი 5-ციფრიანია, ანუ გამოცნობადი — ამიტომ სრული ჩანაწერი არ ბრუნდება.
const getID = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).send("userId is required.");

        const client = await ClientModal.findOne({ userId }).select("userId status -_id");
        if (!client) return res.status(404).send("Application not found.");

        return res.status(200).send(client);
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting the application!");
    }
};

const editStatus = async (req, res) => {
    try {
        // userId საძიებო გასაღებია — განახლებაში არ უნდა მოხვდეს
        const { userId, ...updates } = req.body;
        if (!userId) return res.status(400).send("userId is required.");

        const updated = await ClientModal.findOneAndUpdate({ userId }, updates, {
            new: true,
            runValidators: true,
        });

        if (!updated) return res.status(404).send("Application not found.");

        return res.status(200).send(updated);
    } catch (error) {
        return sendError(res, error, "Something went wrong while updating the status!");
    }
};

const deleteClient = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).send("userId is required.");

        const client = await ClientModal.findOneAndDelete({ userId });
        if (!client) return res.status(404).send("Client not found!");

        return res.status(200).send({ message: "Client deleted successfully", client });
    } catch (error) {
        return sendError(res, error, "Something went wrong while deleting the client.");
    }
};

module.exports = {
    createClient,
    getClient,
    getClientsByCompanyId,
    getClientByDateTime,
    getID,
    getClientByUserId,
    editStatus,
    deleteClient,
};
