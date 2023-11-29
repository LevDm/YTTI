const light =  {
    "basics":{
        "accents":{"primary":"#F3E601","secondary":"#fdf401","tertiary":"#2BF4F7","quaternary":"#2BF4F7"},
        "neutrals":{"primary":"#050C11","secondary":"#210A10","tertiary":"#361216","quaternary":"#0E0A18"}
    },
    "texts":{
        "accents":{"primary":"#2BF4F7","secondary":"#d9d100","tertiary":"#fdf401","quaternary":"#AEAEAF"},
        "neutrals":{"primary": "#00060D","secondary":"#FF554F","tertiary":"#4FB4BE","quaternary":"#1E595C"}
    },
    "icons":{
        "accents":{"primary":"#2BF4F7","secondary":"#DA3F3B","tertiary":"#8E2623","quaternary":"#4BB6BC"},
        "neutrals":{"primary": "#00060D","secondary":"#FF554F","tertiary":"#1E595C","quaternary":"#4FB4BE"}
    },
    "specials":{
        "dimout": "#000000",
        "separator": "#942E2C",
        "shadow": {"primary": "#FD5B59", "secondary": "#2BF4F7"},
        "selector": {
            "primary":"#2BFFB2",
            "secondary":"#1E595C",
            "tertiary":"#E8E8E8",
            "quaternary":"#ACACAC",
        }
    }
}

const dark =  {
    "basics":{
        "accents":{"primary":"#C9BC02","secondary":"#CCC102","tertiary":"#23C6C6","quaternary":"#2BF4F7"},
        "neutrals":{"primary":"#050C11","secondary":"#210A10","tertiary":"#361216","quaternary":"#0E0A18"}
    },
    "texts":{
        "accents":{"primary":"#2BF4F7","secondary":"#d9d100","tertiary":"#fdf401","quaternary":"#AEAEAF"},
        "neutrals":{"primary": "#00060D","secondary":"#FF554F","tertiary":"#4FB4BE","quaternary":"#1E595C"}
    },
    "icons":{
        "accents":{"primary":"#2BF4F7","secondary":"#DA3F3B","tertiary":"#8E2623","quaternary":"#4BB6BC"},
        "neutrals":{"primary": "#00060D","secondary":"#FF554F","tertiary":"#1E595C","quaternary":"#4FB4BE"}
    },
    "specials":{ 
        "dimout": "#000000",
        "separator": "#942E2C",
        "shadow": {"primary": "#FD5B59", "secondary": "#2BF4F7"},
        "selector": {
            "primary":"#2BFFB2",
            "secondary":"#1E595C",
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
            "v": 9, 
            "h": 12
        }
    },
    "modals": {
        "proximity":{
            "h": 0
        },
        "highlight": {"dimOutDark": false, "gradient": true, "outline": true}
    },
    "navigationMenu": {
        "height": 50, 
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
    "palette": "cyber",
    "selectors": {
        "design": {"checkBox": "type_2", "radioButton": "type_1", "switch": "type_3"}
    }
}


const preset = {
    name: "cyber",
    icon: {
        name: 'chip'
    },
    fill: {
        colors: [light.basics.accents.primary, light.basics.accents.secondary, light.basics.accents.tertiary],
        locs: [.3,.6,1],
    },
    options: style
}

const palette = {
    //scheme: 'auto',
    title: "cyber",
    light: light,
    dark: dark
}

const design = {
    preset: preset,
    palette: palette
}

export default design