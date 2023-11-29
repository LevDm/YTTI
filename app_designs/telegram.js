const light =  {
    "basics":{
        "accents":{"primary":"#517DA2","secondary":"#50A3E7","tertiary":"#599ED5","quaternary":"#D6ECFF"},
        "neutrals":{"primary":"#F3F3F3","secondary":"#ffffff","tertiary":"#ffffff","quaternary":"#ffffff"}
    },
    "texts":{
        "accents":{"primary":"#267FC1","secondary":"#3BA3F8","tertiary":"#3BA3F8","quaternary":"#31A1ED"},
        "neutrals":{"primary":"#ffffff","secondary":"#000000","tertiary":"#B1B4B9","quaternary":"#B1B4B9"}
    },
    "icons":{
        "accents":{"primary":"#267FC1","secondary":"#3BA3F8","tertiary":"#3BA3F8","quaternary":"#31A1ED"},
        "neutrals":{"primary":"#ffffff","secondary":"#000000","tertiary":"#B1B4B9","quaternary":"#B1B4B9"}
    },
    "specials":{  
        "dimout":"#000000",
        "separator":"#000000",
        "shadow":{"primary":"#000000","secondary":"#ffffff"},
        "selector": {
            "primary":"#4088F6",
            "secondary":"#9BC2FB",
            "tertiary":"#E8E8E8",
            "quaternary":"#ACACAC",
        }
    }
}

const dark =  {
    "basics":{
        "accents":{"primary":"#232325","secondary":"#5CA1DC","tertiary":"#1F1F1F","quaternary":"#5AB5EC"},
        "neutrals":{"primary":"#000000","secondary":"#191919","tertiary":"#222222","quaternary":"#191919"}
    },
    "texts":{
        "accents":{"primary":"#86B9EE","secondary":"#429EE1","tertiary":"#429EE1","quaternary":"#8596A0"},
        "neutrals":{"primary":"#ffffff","secondary":"#E9E9EB","tertiary":"#606060","quaternary":"#606060"}
    },
    "icons":{
        "accents":{"primary":"#86B9EE","secondary":"#429EE1","tertiary":"#429EE1","quaternary":"#8596A0"},
        "neutrals":{"primary":"#ffffff","secondary":"#E9E9EB","tertiary":"#606060","quaternary":"#606060"}
    },
    "specials":{ 
        "dimout":"#000000",
        "separator":"#ffffff",
        "shadow":{"primary":"#000000","secondary":"#ffffff"},
        "selector": {
            "primary":"#4088F6",
            "secondary":"#9BC2FB",
            "tertiary":"#E8E8E8",
            "quaternary":"#ACACAC",
        }
    }
}

const style = {
    "borderRadius": {
        "primary": 0,
        "secondary": 31
    }, 
    "effects": {
        "blur": false, 
        "shadows": {
            "design": 'none',
            "inner": {
                "use": false,
                "opacity": 0
            },
            "countColors": 0,
            "blur": 0,
            "opacity": 0,
            "pos": {
                "x1":0,
                "y1":0,
                "x2":0, 
                "y2":0
            }
        }
    }, 
    "fab": {
        "size": 70, 
        "pos": {
            "x": 1,
            "y": 1
        },
        "highlight": {
            'ignoredShadows': {'disable': false},
            "outline": false, 
        }
    },
    "lists": {
        "proximity":{
            "v": 0.25, 
            "h": 0
        }
    },
    "modals": {
        "proximity":{
            "h": 0
        },
        "highlight": {"dimOutDark": true, "gradient": false, "outline": false}
    },
    "navigationMenu": {
        "height": 53, 
        "type": "type_2",
        "pos": {
            "y": 0,
            "x": 0,
            "dx": 0
        },
        "icons": {
            "highlight": {"coloring": false, "filling": false},
            "signature": true, 
        }
    }, 
    "palette": "telegram", 
    "selectors":{
        "design": {"checkBox": "type_1", "radioButton": "type_1", "switch": "type_1"} 
    }
}


const preset = {
    name: 'telegram',
    icon: {
        name: 'send',//'send-circle-outline'
    },
    fill: {
        colors: ["#50A3E7","#599ED5"],
        locs: [0,1],
    },
    options: style
}

const palette = {
    //scheme: 'auto',
    title: "telegram",
    light: light,
    dark: dark
}

const design = {
    preset: preset,
    palette: palette
}

export default design