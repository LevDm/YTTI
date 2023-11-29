
const light =  {
    "basics":{
        "accents":{"primary":"#01816A","secondary":"#01A985","tertiary":"#00bc9c","quaternary":"#effffc"},
        "neutrals":{"primary":"#F7F8FA","secondary":"#ffffff","tertiary":"#ffffff","quaternary":"#ffffff"}
    },
    "texts":{
        "accents":{"primary":"#02A787","secondary":"#00A583","tertiary":"#B0E2D7","quaternary":"#8596A0"},
        "neutrals":{"primary":"#ffffff","secondary":"#000000","tertiary":"#DADFE2","quaternary":"#81939F"}
    },
    "icons":{
        "accents":{"primary":"#02A787","secondary":"#00A583","tertiary":"#B0E2D7","quaternary":"#8596A0"},
        "neutrals":{"primary":"#ffffff","secondary":"#000000","tertiary":"#DADFE2","quaternary":"#81939F"}
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
        "accents":{"primary":"#1F2C34","secondary":"#04A885","tertiary":"#273741","quaternary":"#1B9C7D"},
        "neutrals":{"primary":"#0C131B","secondary":"#131A22","tertiary":"#121212","quaternary":"#1C1C1E"}
    },
    "texts":{
        "accents":{"primary":"#03A886","secondary":"#01A583","tertiary":"#0A463E","quaternary":"#8596A0"},
        "neutrals":{"primary":"#ffffff","secondary":"#E9E9EB","tertiary":"#334048","quaternary":"#81939F"}
    },
    "icons":{
        "accents":{"primary":"#03A886","secondary":"#01A583","tertiary":"#0A463E","quaternary":"#8596A0"},
        "neutrals":{"primary":"#ffffff","secondary":"#E9E9EB","tertiary":"#334048","quaternary":"#81939F"}
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
        "secondary": 29
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
    "palette": "whatsapp", 
    "selectors":{
        "design": {"checkBox": "type_2", "radioButton": "type_2", "switch": "type_2"}, 
    }
}


const preset = {
    name: 'whatsapp',
    icon: {
        name: 'whatsapp'
    },
    fill: {
        colors: ["#01A985","#00bc9c"],
        locs: [0,1],
    },
    options: style
}

const palette = {
    //scheme: 'auto',
    title: "whatsapp",
    light: light,
    dark: dark
}

const design = {
    preset: preset,
    palette: palette
}

export default design