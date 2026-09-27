import Section from "./Section"

const Faq = () => {
    const data = [
        {
          sectionTitle: "section 1",
          list: [
            {
              title: 'ra xdeba?',
              body: 'ar vici ra xdeba',
            },
            {
              title: 'ra xdeba 2?',
              body: 'arc es vici ra xdeba',
            }
          ]
        },
        {
          sectionTitle: "section 2",
          list: [
            {
              title: 'ra xdeba?',
              body: 'ar vici ra xdeba',
            },
            {
              title: 'ra xdeba 2?',
              body: 'arc es vici ra xdeba',
            }
          ]
        }
    ]

    return (
        <div>
            {data.map((item) => {
                <Section item={item}/>
            })}
        </div>
    )
}

export default Faq