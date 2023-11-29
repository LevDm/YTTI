const light =  {
    "basics":{
        "accents":{"primary":"#0077ff","secondary":"#3392ff","tertiary":"#8ec3ff","quaternary":"#9bc9ff"},
        "neutrals":{"primary":"#edecf1","secondary":"#ffffff","tertiary":"#fafafa", "quaternary":"#ffffff"}
    },
    "texts":{
        "accents":{"primary":"#0077ff","secondary":"#2784E4","tertiary":"#93C6F1","quaternary":"#477AA9"},
        "neutrals":{"primary":"#ffffff","secondary":"#000000","tertiary":"#a3a4a5","quaternary":"#F7F7F7"}
    },
    "icons":{
        "accents":{"primary":"#0077ff","secondary":"#2784E4","tertiary":"#93C6F1","quaternary":"#477AA9"},
        "neutrals":{"primary":"#ffffff","secondary":"#000000","tertiary":"#a3a4a5","quaternary":"#F7F7F7"}
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
        "accents":{"primary":"#0077ff","secondary":"#3392ff","tertiary":"#66adff","quaternary":"#71b3ff"},
        "neutrals":{"primary":"#0a0a0a","secondary":"#191919","tertiary":"#2c2c2f", "quaternary":"#191919"}
    },
    "texts":{
        "accents":{"primary":"#ffffff","secondary":"#4F9BF1","tertiary":"#395682","quaternary":"#5788C3"},
        "neutrals":{"primary":"#efefef","secondary":"#ececec","tertiary":"#7b7c7e","quaternary":"#F2F2F2"}
    },
    "icons":{
        "accents":{"primary":"#ffffff","secondary":"#4F9BF1","tertiary":"#395682","quaternary":"#5788C3"},
        "neutrals":{"primary":"#efefef","secondary":"#ececec","tertiary":"#7b7c7e","quaternary":"#F2F2F2"}
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
        "primary": 22,
        "secondary": 35
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
            "v": 2, 
            "h": 0
        }
    },
    "modals": {
        "proximity":{
            "h": 12
        },
        "highlight": {"dimOutDark": true, "gradient": false, "outline": false}
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
            "highlight": {"coloring": true, "filling": false},
            "signature": true, 
        }
    }, 
    "palette": "vk", 
    "selectors":{
        "design": {"checkBox": "type_2", "radioButton": "type_2", "switch": "type_2"}
    }
}



const preset = {
    name: 'vk',
    icon: {
        name: 'chat'
    },
    fill: {
        colors: [light.basics.accents.primary, light.basics.accents.secondary, light.basics.accents.tertiary],
        locs: [.3,.6,1],
    },
    options: style
}

const palette = {
    //scheme: 'auto',
    title: "vk",
    light: light,
    dark: dark
}

const design = {
    preset: preset,
    palette: palette
}

export default design