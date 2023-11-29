const light =  {
    "basics":{
        "accents":{"primary":"#E0878D","secondary":"#E692A1","tertiary":"#EEA7AB","quaternary":"#FFC7CD"},
        "neutrals":{"primary":"#EAB2B3","secondary":"#E6B5BB","tertiary":"#F3C4BE","quaternary":"#E9B7B6"}
    },
    "texts":{
        "accents":{"primary":"#E0878D","secondary":"#944F4A","tertiary":"#9C514B","quaternary":"#FFCECD"},
        "neutrals":{"primary":"#FFE5E7","secondary":"#442722","tertiary":"#A46961","quaternary":"#C29197"}
    },
    "icons":{
        "accents":{"primary":"#E0878D","secondary":"#944F4A","tertiary":"#9C514B","quaternary":"#FFCECD"},
        "neutrals":{"primary":"#FFE5E7","secondary":"#442722","tertiary":"#A46961","quaternary":"#C29197"}
    },
    "specials":{
        "dimout":"#000000",
        "separator":"#9D5B4D",
        "shadow":{"primary":"#9D5B4D","secondary":"#FFF0E9"},
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
        "accents":{"primary":"#E0878D","secondary":"#E692A1","tertiary":"#EEA7AB","quaternary":"#FFC7CD"},
        "neutrals":{"primary":"#563E3C","secondary":"#573D3E","tertiary":"#5D3F3D","quaternary":"#5D413D"}
    },
    "texts":{
        "accents":{"primary":"#E0878D","secondary":"#944F4A","tertiary":"#9C514B","quaternary":"#FFCECD"},
        "neutrals":{"primary":"#FFE5E7","secondary":"#FFE5E7","tertiary":"#A46961","quaternary":"#C29197"}
    },
    "icons":{
        "accents":{"primary":"#E0878D","secondary":"#944F4A","tertiary":"#9C514B","quaternary":"#FFCECD"},
        "neutrals":{"primary":"#FFE5E7","secondary":"#FFE5E7","tertiary":"#A46961","quaternary":"#C29197"}
    },
    "specials":{
        "dimout":"#000000",
        "separator":"#9D5B4D",
        "shadow":{"primary":"#9D5B4D","secondary":"#FFF0E9"},
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
        "primary": 36,
        "secondary": 36
    }, 
    "effects": {
        "blur": false, 
        "shadows": {
            "design": 'neomorphism',
            "inner": {
                'use': true,
                "opacity": 0.1
            },
            "countColors": 2,
            "blur": 0.31,
            "opacity": 0.32,
            "pos": {
                'x1':0.39,
                'y1':0.39,
                'x2':-0.39, 
                'y2':-0.39
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
            "v": 6, 
            "h": 12
        }
    },
    "modals": {
        "proximity":{
            "h": 12
        },
        "highlight": {"dimOutDark": true, "gradient": false, "outline": false}
    },
    "navigationMenu": {
        "height": 57, 
        "type": "type_1",
        "pos": {
            "y": 0,
            "x": 0,
            "dx": 0
        },
        "icons": {
            "highlight": {"coloring": true, "filling": true},
            "signature": false, 
        }
    }, 
    "palette": "cake",
    "selectors": {
        "design": {"checkBox": "type_2", "radioButton": "type_2", "switch": "type_3"}
    }
}


const preset = {
    name: 'cake',
    icon: {
        name: 'cupcake'
    },
    fill: {
        colors: [light.basics.accents.primary, light.basics.accents.secondary, light.basics.accents.tertiary],
        locs: [.3,.6,1],
    },
    options: style
}

const palette = {
    //scheme: 'auto',
    title: "cake",
    light: light,
    dark: dark
}

const design = {
    preset: preset,
    palette: palette
}

export default design