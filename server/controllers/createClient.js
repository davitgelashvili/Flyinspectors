const ClientModal = require("./../jsonModels/clientModal");

// ფუნქცია უნიკალური 5-ციფრიანი ID-სთვის
const generateUniqueId = async () => {
    let unique = false;
    let newId;

    while (!unique) {
        newId = Math.floor(10000 + Math.random() * 90000).toString();
        const existing = await ClientModal.findOne({ userId: newId });
        if (!existing) unique = true;
    }

    return newId;
};

const createClient = async (req, res) => {
    try {
    
        const {
            passportImage,
            ticketImage,
            otherImage,
            signature,
            companyId,
            companyName,
            firstName,
            lastName,
            phone,
            email,
            city,
            address,
            problem,
            flightNumber,
            date,
            select,
            description,
            oldStatus,
            createDate
        } = req.body;

        const userId = await generateUniqueId();  // უნიკალური 5-ციფრიანი ID
    
        const client = new ClientModal({
            passportImage: String(passportImage),
            ticketImage: String(ticketImage),
            otherImage: String(otherImage),
            signature: String(signature),
            companyId: String(companyId),
            companyName: companyName,
            userId: userId,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
            city: city,
            address: address,
            problem: problem,
            flightNumber: flightNumber,
            date: date,
            select: select,
            description: description,
            status: "Application has received",
            oldStatus: oldStatus,
            createDate: createDate
        });
    
        const clients = await client.save();
    
        return res.status(200).send(clients);
    } catch (error) {
        return res.status(500).send("Something went wrong while creating car!");
    }
};

module.exports = {createClient}