import { Card } from "../../components/ui/Card"

export const CardGroup = ( {cards} ) => {
    return(
        <>
            {cards && 
                <div className={`grid grid-cols-2 xl:grid-cols-${cards.length} gap-4 mb-4`}>
                    {cards.map((card, index) => (
                        <Card key={index} title={card.title} content={card.content} />
                    ))}
                </div>
            }
        </>
    )
}