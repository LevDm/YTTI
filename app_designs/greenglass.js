
const light =  {
    "basics":{
        "accents":{"primary":"#50c878","secondary":"#77d47d","tertiary":"#9ee0a2","quaternary":"#c4edc7"},
        "neutrals":{"primary":"#ebf4e9","secondary":"#ffffff","tertiary":"#fafafa","quaternary":"#ffffff"}
    },
    "texts":{
        "accents":{"primary":"#50c878","secondary":"#77d47d","tertiary":"#9ee0a2","quaternary":"#c4edc7"},
        "neutrals":{"primary":"#ffffff","secondary":"#000000","tertiary":"#a3a4a5","quaternary":"#a3a4a5"}
    },
    "icons":{
        "accents":{"primary":"#50c878","secondary":"#77d47d","tertiary":"#9ee0a2","quaternary":"#c4edc7"},
        "neutrals":{"primary":"#ffffff","secondary":"#000000","tertiary":"#a3a4a5","quaternary":"#a3a4a5"}
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
        "accents":{"primary":"#50c878","secondary":"#37ae3f","tertiary":"#2b8731","quaternary":"#1e6123"},
        "neutrals":{"primary":"#0a0a0a","secondary":"#191919","tertiary":"#2c2c2f","quaternary":"#191919"}
    },
    "texts":{
        "accents":{"primary":"#50c878","secondary":"#37ae3f","tertiary":"#2b8731","quaternary":"#1e6123"},
        "neutrals":{"primary":"#efefef","secondary":"#ececec","tertiary":"#7b7c7e","quaternary":"#7b7c7e"}
    },
    "icons":{
        "accents":{"primary":"#50c878","secondary":"#37ae3f","tertiary":"#2b8731","quaternary":"#1e6123"},
        "neutrals":{"primary":"#efefef","secondary":"#ececec","tertiary":"#7b7c7e","quaternary":"#7b7c7e"}
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
        "primary": 18,
        "secondary": 18
    }, 
    "effects": {
        "blur": false, 
        "shadows": {
            "design": 'material',
            "inner": {
                "use": false,
                "opacity": 0
            },
            "countColors": 1,
            "blur": 0.42,
            "opacity": 0.19,
            "pos": {
                "x1":0,
                "y1":0.33,
                "x2":0, 
                "y2":0
            }
        }
    }, 
    "fab": {
        "size": 70, 
        "pos": {
            "x": 1,
            "y": 0
        },
        "highlight": {
            'ignoredShadows': {'disable': false},
            "outline": false, 
        }
    },
    "lists": {
        "proximity":{
            "v": 7.25, 
            "h": 0
        }
    },
    "modals": {
        "proximity":{
            "h": 0
        },
        "highlight": {"dimOutDark": true, "gradient": false, "outline": true}
    },
    "navigationMenu": {
        "height": 64, 
        "type": "type_1",
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
    "palette": "greenGlass", 
    "selectors":{
        "design": {"checkBox": "type_1", "radioButton": "type_1", "switch": "type_1"}, 
    }
}


const preset = {
    name: 'greenGlass',
    icon: {
        name: 'leaf' //bottle-soda-classic-outline
    },
    fill: {
        colors: [light.basics.accents.primary, light.basics.accents.secondary, light.basics.accents.tertiary],
        locs: [.3,.6,1],
    },
    options: style
}

const palette = {
    //scheme: 'auto',
    title: "greenGlass",
    light: light,
    dark: dark
}

const design = {
    preset: preset,
    palette: palette
}

export default design