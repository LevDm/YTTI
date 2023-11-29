const light =  {
    "basics":{
        "accents":{"primary":'#FFFFFF',"secondary":"#FEDD2C","tertiary":"#FFE769","quaternary":"#4145FC"},
        "neutrals":{"primary":"#f5f5f5","secondary":"#ffffff","tertiary":"#ffffff","quaternary":"#fafafa"}
    },
    "texts":{
        "accents":{"primary":"#579CF7","secondary":"#4088F6","tertiary":"#9BC2FB","quaternary":"#FEDD2C"},
        "neutrals":{"primary":"#101111","secondary":"#353535","tertiary":"#ACACAC","quaternary":"#FFFFFF"}
    },
    "icons":{
        "accents":{"primary":"#579CF7","secondary":"#4088F6","tertiary":"#9BC2FB","quaternary":"#FEDD2C"},
        "neutrals":{"primary":"#101111","secondary":"#353535","tertiary":"#ACACAC","quaternary":"#FFFFFF"}
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
        "accents":{"primary":"#FEDD2C","secondary":"#FFDD4F","tertiary":"#FFE769","quaternary":"#4145FC"},
        "neutrals":{"primary":"#121212","secondary":"#1C1C1E","tertiary":"#121212","quaternary":"#1C1C1E"}
    },
    "texts":{
        "accents":{"primary":"#3A7BD9","secondary":"#4088F6","tertiary":"#33538E","quaternary":"#438DF6"},
        "neutrals":{"primary":"#f8f8f8","secondary":"#E9E9EB","tertiary":"#545456","quaternary":"#E8E8E8"}
    },
    "icons":{
        "accents":{"primary":"#3A7BD9","secondary":"#4088F6","tertiary":"#33538E","quaternary":"#438DF6"},
        "neutrals":{"primary":"#f8f8f8","secondary":"#E9E9EB","tertiary":"#545456","quaternary":"#E8E8E8"}
    },
    "specials":{
        "dimout":"#000000",
        "separator":"#eeeeee",
        "shadow":{"primary":"#444444","secondary":"#ffffff"},
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
        "primary": 26,
        "secondary": 28
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
        "size": 62, 
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
            "highlight": {"coloring": true, "filling": false},
            "signature": true, 
        }
    }, 
    "palette": "yellowBank",
    "selectors": {
        "design": {"checkBox": "type_2", "radioButton": "type_2", "switch": "type_2"}
    }
}

const preset = {
    name: 'yellowBank',
    fill: {
        colors: ["#FEDD2C","#FFE769"],
        locs: [0,1],
    },
    icon: {
        name: 'bank'
    },
    options: style
}

const palette = {
    //scheme: 'auto',
    title: "yellowBank",
    light: light,
    dark: dark
}

const design = {
    preset: preset,
    palette: palette
}

export default design