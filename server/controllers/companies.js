const CompanyModal = require("../jsonModels/companyModal");
const { sendError } = require("../utils/body");

const generateUniqueCompanyId = async () => {
    for (;;) {
        const candidate = Math.floor(10000 + Math.random() * 90000).toString();
        const existing = await CompanyModal.findOne({ companyId: candidate });
        if (!existing) return candidate;
    }
};

const getCompany = async (req, res) => {
    try {
        // password სქემაში select:false-ია, ანუ პასუხში არ მოყვება
        return res.status(200).send(await CompanyModal.find());
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting companies!");
    }
};

const createCompany = async (req, res) => {
    try {
        // new + save(), და არა create() — რომ pre('save') hook-მა პაროლი დაჰეშოს.
        // companyId spread-ის შემდეგ იწერება, ანუ გარედან ვერ დაყენდება.
        const company = new CompanyModal({
            ...req.body,
            companyId: await generateUniqueCompanyId(),
        });

        const saved = await company.save();

        return res.status(200).send(saved);
    } catch (error) {
        return sendError(res, error, "Something went wrong while creating the company!");
    }
};

const deleteCompany = async (req, res) => {
    try {
        const { companyId } = req.body;
        if (!companyId) return res.status(400).send("companyId is required");

        const deleted = await CompanyModal.findOneAndDelete({ companyId });
        if (!deleted) return res.status(404).send("Company not found");

        return res.status(200).send({ message: "Company successfully deleted", companyId });
    } catch (error) {
        return sendError(res, error, "Something went wrong while deleting the company!");
    }
};

module.exports = { getCompany, createCompany, deleteCompany };
