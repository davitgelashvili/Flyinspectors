const ClientModal = require("./../jsonModels/clientModal");

const getClientsByCompanyId = async (req, res) => {
    try {
        const { companyId } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const reverse = req.query.reverse === "true";

        if (!companyId) {
            return res.status(400).send("companyId is required");
        }

        const skip = (page - 1) * limit;
        const sortOrder = reverse ? -1 : 1;

        const clients = await ClientModal.find({ companyId })
            .sort({ _id: sortOrder })
            .skip(skip)
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
        console.error("Error getting clients by companyId:", error);
        return res.status(500).send("Something went wrong while getting clients!");
    }
};

module.exports = { getClientsByCompanyId };
