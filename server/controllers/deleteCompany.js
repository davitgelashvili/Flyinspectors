const CompanyModal = require("../jsonModels/companyModal");

const deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).send("companyId is required");
    }

    const deleted = await CompanyModal.findOneAndDelete({ companyId });

    if (!deleted) {
      return res.status(404).send("Company not found");
    }

    return res.status(200).send("Company successfully deleted");
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).send("Something went wrong while deleting company!");
  }
};

module.exports = { deleteCompany };
