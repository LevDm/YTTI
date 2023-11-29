const light =  {
    "basics":{
        "accents": {"primary":'#6b8e23',"secondary":"#85a04a","tertiary":"#9eb36d","quaternary":"#b6c590"},
        "neutrals":{"primary":"#E7DED5","secondary":"#E7DED5","tertiary":"#E4DED2","quaternary":"#ECE2D9"}
    },
    "texts":{
        "accents": {"primary":'#6b8e23',"secondary":"#85a04a","tertiary":"#9eb36d","quaternary":"#b6c590"},
        "neutrals":{"primary":"#E9FFC1","secondary":"#776D00","tertiary":"#557057","quaternary":"#86997A"}
    },
    "icons":{
        "accents": {"primary":'#6b8e23',"secondary":"#85a04a","tertiary":"#9eb36d","quaternary":"#b6c590"},
        "neutrals":{"primary":"#E9FFC1","secondary":"#776D00","tertiary":"#557057","quaternary":"#86997A"}
    },
    "specials":{
        "dimout":"#000000",
        "separator":"#336000",
        "shadow":{"primary":"#683400","secondary":"#EBFFDD"},
        "selector": {
            "primary":"#4088F6",
            "secondary":"#9BC2FB",
            "tertiary":"#E8E8E8",
            "quaternary":"#ACACAC",
        }
    }
}

const dark =  {
    "basics": {
        "accents": {"primary":"#536e1b","secondary":"#799244","tertiary":"#95ac60","quaternary":"#adbe83"},
        "neutrals":{"primary":"#3D3C3A","secondary":"#3D3C3A","tertiary":"#383634","quaternary":"#353331"}
    },
    "texts":{
        "accents":{"primary":"#536e1b","secondary":"#799244","tertiary":"#95ac60","quaternary":"#adbe83"},
        "neutrals":{"primary":"#bfd19d","secondary":"#fffbd1","tertiary":"#39623d","quaternary":"#718465"}
    },
    "icons":{
        "accents":{"primary":"#536e1b","secondary":"#799244","tertiary":"#95ac60","quaternary":"#adbe83"},
        "neutrals":{"primary":"#bfd19d","secondary":"#fffbd1","tertiary":"#39623d","quaternary":"#718465"}
    },
    "specials":{
        "dimout":"#000000",
        "separator":"#e8ffce",
        "shadow":{"primary":"#222222","secondary":"#EBFFDD"},
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
        "primary": 29,
        "secondary": 16
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
        "size": 68, 
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
            "v": 6.5, 
            "h": 12
        }
    },
    "modals": {
        "proximity":{
            "h": 12
        },
        "highlight": {"dimOutDark": false, "gradient": false, "outline": true}
    },
    "navigationMenu": {
        "height": 49, 
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
    "palette": "olive",
    "selectors": {
        "design": {"checkBox": "type_1", "radioButton": "type_1", "switch": "type_3"}
    }
}


const preset = {
    name: 'olive',
    fill: {
        colors: [light.basics.accents.primary, light.basics.accents.secondary, light.basics.accents.tertiary],
        locs: [.3,.6,1],
    },
    icon: {
        name: 'tortoise'
    },
    options: style
}

const palette = {
    //scheme: 'auto',
    title: "olive",
    light: light,
    dark: dark
}

const design = {
    preset: preset,
    palette: palette
}

export default design