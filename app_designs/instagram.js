const light =  {
    "basics":{
        "accents":{"primary":"#ffffff","secondary":"#ffffff","tertiary":"#7f7f7f","quaternary":"#000000"},
        "neutrals":{"primary":"#fafafa","secondary":"#ffffff","tertiary":"#ffffff","quaternary":"#ffffff"}
    },
    "texts":{
        "accents":{"primary":"#000000","secondary":"#3599F1","tertiary":"#9ACEF5","quaternary":"#0195F7"},
        "neutrals":{"primary":"#000000","secondary":"#000000","tertiary":"#CECECE","quaternary":"#F1F1F1"}
    },
    "icons":{
        "accents":{"primary":"#000000","secondary":"#3599F1","tertiary":"#9ACEF5","quaternary":"#0195F7"},
        "neutrals":{"primary":"#000000","secondary":"#000000","tertiary":"#CECECE","quaternary":"#F1F1F1"}
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
        "accents":{"primary":"#000000","secondary":"#000000","tertiary":"#7f7f7f","quaternary":"#ffffff"},
        "neutrals":{"primary":"#191919","secondary":"#000000","tertiary":"#000000","quaternary":"#2a2a2a"}
    },
    "texts":{
        "accents":{"primary":"#ffffff","secondary":"#3997EE","tertiary":"#1C4D78","quaternary":"#0195F7"},
        "neutrals":{"primary":"#ffffff","secondary":"#ffffff","tertiary":"#4D4D4D","quaternary":"#E8E8E8"}
    },
    "icons":{
        "accents":{"primary":"#ffffff","secondary":"#3997EE","tertiary":"#1C4D78","quaternary":"#0195F7"},
        "neutrals":{"primary":"#ffffff","secondary":"#ffffff","tertiary":"#4D4D4D","quaternary":"#E8E8E8"}
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
        "secondary": 12
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
        "size": 64, 
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
        "height": 65, 
        "type": "type_1",
        "pos": {
            "y": 0,
            "x": 0,
            "dx": 0
        },
        "icons": {
            "highlight": {"coloring": false, "filling": true},
            "signature": false, 
        }
    }, 
    "palette": "instagram", 
    "selectors":{
        "design": {"checkBox": "type_1", "radioButton": "type_1", "switch": "type_1"} 
    }
}


const preset = {
    name: 'instagram',
    icon: {
        name: 'instagram'
    },
    fill: {
        colors: [light.basics.accents.primary, light.basics.accents.secondary, light.basics.accents.tertiary],
        locs: [.3,.6,1],
    },
    options: style
}

const palette = {
    //scheme: 'auto',
    title: "instagram",
    light: light,
    dark: dark
}

const design = {
    preset: preset,
    palette: palette
}

export default design