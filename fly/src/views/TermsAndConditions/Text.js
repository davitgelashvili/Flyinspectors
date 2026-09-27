import { getConditions } from "@/api/serverApi";

async function Text({ lang }) {
    const data = await getConditions();

    return (
        <div className="container">
            {data.map((item) => (
                <div key={item._id}>
                    <h3>{item.title?.[lang]}</h3>
                    <p>{item.description?.[lang]}</p>
                </div>
            ))}
        </div>
    )
}

export default Text;
