const light =  {
    "basics":{
        "accents":{"primary":"#ffffff","secondary":"#c1c1c1","tertiary":"#e1e1e1","quaternary":"#ff1111"},
        "neutrals":{"primary":"#f1f1f1","secondary":"#ffffff","tertiary":"#ffffff","quaternary":"#f1f1f1"}
    },
    "texts":{
        "accents":{"primary":"#000000","secondary":"#1f1f1f","tertiary":"#2f2f2f","quaternary":"#ff1111"},
        "neutrals":{"primary":"#111111","secondary":"#222222","tertiary":"#CECECE","quaternary":"#F1F1F1"}
    },
    "icons":{
        "accents":{"primary":"#000000","secondary":"#1f1f1f","tertiary":"#2f2f2f","quaternary":"#ff1111"},
        "neutrals":{"primary":"#111111","secondary":"#222222","tertiary":"#CECECE","quaternary":"#F1F1F1"}
    },
    "specials":{  
        "dimout":"#000000",
        "separator":"#000000",
        "shadow":{"primary":"#000000","secondary":"#ffffff"},
        "selector": {
            "primary":"#4088F6",
            "secondary":"#9BC2FB",
            "tertiary":"#ffffff",
            "quaternary":"#E8E8E8",
        }
    }
}

const dark =  {
    "basics":{
        "accents":{"primary":"#1a1a1a","secondary":"#2d2d2d","tertiary":"#303030","quaternary":"#991111"},
        "neutrals":{"primary":"#000000","secondary":"#0a0a0a","tertiary":"#141414","quaternary":"#3a3a3a"}
    },
    "texts":{
        "accents":{"primary":"#ffffff","secondary":"#f3f3f3","tertiary":"#ececec","quaternary":"#991111"},
        "neutrals":{"primary":"#ffffff","secondary":"#ffffff","tertiary":"#666666","quaternary":"#E8E8E8"}
    },
    "icons":{
        "accents":{"primary":"#ffffff","secondary":"#f3f3f3","tertiary":"#ececec","quaternary":"#991111"},
        "neutrals":{"primary":"#ffffff","secondary":"#ffffff","tertiary":"#666666","quaternary":"#E8E8E8"}
    },
    "specials":{ 
        "dimout":"#000000",
        "separator":"#ffffff",
        "shadow":{"primary":"#000000","secondary":"#ffffff"},
        "selector": {
            "primary":"#4088F6",
            "secondary":"#9BC2FB",
            "tertiary":"#ffffff",
            "quaternary":"#ACACAC",
        }
    }
}



const newStyle = {
    "borderRadius": {
        "primary": 0,
        "secondary": 36
    }, 
    "effects": {
        "blur": false, 
        "shadows": {
            "design": 'full',
            "inner": {
                "use": false,
                "opacity": 0.36,
            },
            "countColors": 1,
            "opacity": 0.36,
            "pos": {
                "x1": 0,
                "y1": 0,
                "x2": 0,
                "y2": 0
            },
            "blur": 0.2
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
            "v":2.75, 
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
        "type": "type_1",
        "pos": {
            "y": 0,
            "x": 0,
            "dx": 0
        },
        "icons": {
            "highlight": {"coloring": true, "filling": true},
            "signature": true, 
        }
    }, 
    "palette": "stock", 
    "selectors":{
        "design": {"checkBox": "type_2", "radioButton": "type_2", "switch": "type_3"}, 
    }
}


const preset = {
    name: 'YTTI-stock',
    icon: {
        name: 'clock-time-one-outline'//'numeric-0-circle-outline'
    },
    fill: {
        colors: [light.basics.accents.primary, light.basics.accents.secondary, light.basics.accents.tertiary],
        locs: [.3,.6,1],
    },
    options: newStyle
}

const palette = {
    //scheme: 'auto',
    title: "stock",
    light: light,
    dark: dark
}

const design = {
    preset: preset,
    palette: palette
}

export default design