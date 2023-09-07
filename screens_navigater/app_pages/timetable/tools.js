

const STRUCTURE = [
    {
        category: "today",            
        data: [
            {
                param: "p1 c1",
            },
            {
                param: "p2 c1",
            },
            {
                param: "p3 c1",
            },
            {
                param: "p4 c1",
            },
            {
                param: "p5 c1",
            },
        ]
    },
    {   
        category: "tomorrow",
        data: [
            {
                param:"p1 c2",
            },                
            {
                param:"p2 c2",
            },     
            {
                param:"p3 c2",
            },                
            {
                param:"p4 c2",
            },                                  
        ]
    },
    {   
        category: "week",
        data: [
            {
                param:"p1 c3",
            },
            {
                param:"p2 c3",
            },
            {
                param:"p3 c3",
            },
        ]
    },
    {   
        category: "later",
        data: [
            {
                param:"p1 c4",
            },
            {
                param:"p2 c4",
            },
        ]
    },
    {   
        category: "overdue",
        data: [
            {
                param:"p1 c5",
            },
        ]
    },
]

export const categorysCustomizer = []
export const structureCustomizer = []

for(let id = 0; id<STRUCTURE.length; id++){
    const itemCust = STRUCTURE[id]

    const category = itemCust.category
    const rawData = itemCust.data

    const data = []
    
    for(let el of rawData){
        let newEl = {
            ...el,
            indexSection: id,
            category: category, 
        }
        data.push(newEl)
    }

    

    let startIndexSect = 0
    for(let i = 0; i < id; i ++){
        startIndexSect += structureCustomizer[i].data.length
    }

    structureCustomizer.push({
        indexSection: id,
        category: category,
        data: [data]
    })



    categorysCustomizer.push(
        category,
    )
}


export const allStructurParams = [];
for (let el of structureCustomizer){
    let startIndexSect = 0
    for(let i = 0; i < el.indexSection; i ++){
        startIndexSect += el.data.length
    }

    (el.data.flat()).map((item, index)=>{
        newItem = {
            globalIndex: startIndexSect+index,
            ...item,
            indexInSection: index,
        }
        allStructurParams.push(newItem)
    })
}

//console.log('allStructurParams', allStructurParams)
//console.log('structureCustomizer', structureCustomizer)