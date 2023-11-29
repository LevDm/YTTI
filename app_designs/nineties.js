const light =  {
    "basics":{
        "accents":{"primary":"#C8A2E8","secondary":"#B6B6E8","tertiary":"#FCDEB8","quaternary":"#755FAA"},
        "neutrals":{"primary":"#E0E0DE","secondary":"#E3DAEF","tertiary":"#C3E8F0","quaternary":"#CDF3F7"}
    },
    "texts":{
        "accents":{"primary":"#3DA1DC","secondary":"#FCDEB8","tertiary":"#755FAA","quaternary":"#1E595C"},
        "neutrals":{"primary": "#000000","secondary":"#000000","tertiary":"#8A78A5","quaternary":"#1E595C"}
    },
    "icons":{
        "accents":{"primary":"#3DA1DC","secondary":"#49DDA9","tertiary":"#64C79B","quaternary":"#4BB6BC"},
        "neutrals":{"primary": "#000000","secondary":"#000000","tertiary": "#2E0E61","quaternary":"#C5A3F0"}
    },
    "specials":{
        "dimout":"#000000",
        "separator": "#000000",
        "shadow": {"primary": "#37204C", "secondary": "#D3F0F9"},
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
        "accents":{"primary":"#392749","secondary":"#7A43A8","tertiary":"#A8947C","quaternary":"#8361D8"},
        "neutrals":{"primary":"#1D1F1E","secondary":"#29232D","tertiary":"#0C0E0F","quaternary":"#0E1111"}
    },
    "texts":{
        "accents":{"primary":"#3DA1DC","secondary":"#FCDEB8","tertiary":"#755FAA","quaternary":"#1E595C"},
        "neutrals":{"primary": "#E6DAF2","secondary":"#fefefe","tertiary":"#8A78A5","quaternary":"#1E595C"}
    },
    "icons":{
        "accents":{"primary":"#3DA1DC","secondary":"#49DDA9","tertiary":"#64C79B","quaternary":"#4BB6BC"},
        "neutrals":{"primary": "#E6DAF2","secondary":"#fefefe","tertiary": "#561BB5","quaternary":"#C5A3F0"}
    },
    "specials":{
        "dimout":"#000000",
        "separator": "#000000",
        "shadow":{"primary": "#37204C", "secondary": "#D3F0F9"},
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
        "primary": 1,
        "secondary": 1
    }, 
    "effects": {
        "blur": false,
        "shadows": {
            "design": 'square',
            "inner": {
                "use": false,
                "opacity": 0
            },
            "countColors": 1,
            "blur": 0.1,
            "opacity": 0.54,
            "pos": {
                "x1":0.71,
                "y1":0.71,
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
            "v": 12, 
            "h": 12
        }
    },
    "modals": {
        "proximity":{
            "h": 0
        },
        "highlight": {"dimOutDark": true, "gradient": false, "outline": true}
    },
    "navigationMenu": {
        "height": 66, 
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
    "palette": "nineties",
    "selectors": {
        "design": {"checkBox": "type_2", "radioButton": "type_2", "switch": "type_3"}
    }
}


const preset = {
    name: "nineties",
    fill: {
        colors: [light.basics.accents.primary, light.basics.accents.secondary, light.basics.accents.tertiary],
        locs: [.3,.6,1],
    },
    icon: {
        name: 'microsoft-windows-classic' //'roman-numeral-9'
    },
    options: style
}

const palette = {
    //scheme: 'auto',
    title: "nineties",
    light: light,
    dark: dark
}

const design = {
    preset: preset,
    palette: palette
}

export default design