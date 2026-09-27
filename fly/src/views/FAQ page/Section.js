const Section = ({item}) =>{
    return (
        <div className="faq__section">
            hii
            <h1>{item?.sectionTitle}</h1>
            {item?.list?.map((li) => {
                return (
                    <div className="item">
                        <div className="item__head">
                            <img src="icon" alt="icon" />
                            <h2>{li.title}</h2>
                        </div>
                        <div className="item__body">
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Section