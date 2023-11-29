const light =  {
    "basics":{
        "accents":{"primary":"#e896ff","secondary":"#cdb1f2","tertiary":"#93c7f2","quaternary":"#bfd8f9"},
        "neutrals":{"primary":"#EEF2FB","secondary":"#F3F3FD","tertiary":"#F3F3FD","quaternary":"#EEF2FB"}
    },
    "texts":{
        "accents":{"primary":"#e896ff","secondary":"#cdb1f2","tertiary":"#93c7f2","quaternary":"#b7daf6"},
        "neutrals":{"primary":"#f6fbff","secondary":"#3e526b","tertiary":"#506186","quaternary": "#AEB8D2"}
    },
    "icons":{
        "accents":{"primary":"#e896ff","secondary":"#cdb1f2","tertiary":"#93c7f2","quaternary":"#bfd8f9"},
        "neutrals":{"primary":"#f6fbff","secondary":"#37485e","tertiary":"#506186","quaternary":"#AEB8D2"}
    },
    "specials":{
        "dimout":"#000000",
        "separator": "#93c7ff",
        "shadow":{"primary": "#300030", "secondary": "#bbbbff"},
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
        "accents":{"primary":"#e06eff","secondary":"#b78eec","tertiary":"#6fb5ee","quaternary":"#9ac2f5"},
        "neutrals":{"primary":"#172024","secondary":"#172024","tertiary":"#172024", "quaternary":"#1a1a1a"}
    },
    "texts":{
        "accents":{"primary":"#e896ff","secondary":"#cdb1f2","tertiary":"#93c7f2","quaternary":"#9ac2f5"},
        "neutrals":{"primary":"#f7fbff","secondary":"#b9c9e0","tertiary":"#48597d","quaternary":"#d4dbe9"}
    },
    "icons":{
        "accents":{"primary":"#e896ff","secondary":"#cdb1f2","tertiary":"#93c7f2","quaternary":"#9ac2f5"},
        "neutrals":{"primary":"#f7fbff","secondary":"#b9c9e0","tertiary":"#48597d","quaternary":"#d4dbe9"}
    },
    "specials":{
        "dimout":"#000000",
        "separator": "#b4c9f5",
        "shadow": {"primary": "#522252", "secondary": "#bbbbff"},
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
        "primary": 9,
        "secondary": 18
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
            "v": 10, 
            "h": 12
        }
    },
    "modals": {
        "proximity":{
            "h": 12
        },
        "highlight": {"dimOutDark": false, "gradient": true, "outline": false}
    },
    "navigationMenu": {
        "height": 59, 
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
    "palette": "neoPluePink",
    "selectors": {
        "design": {"checkBox": "type_1", "radioButton": "type_2", "switch": "type_3"}
    }
}



const preset = {
    name: 'neoPluePink',
    fill: {
        colors: [light.basics.accents.primary, light.basics.accents.secondary, light.basics.accents.tertiary],
        locs: [.3,.6,1],
    },
    icon: {
        name: 'flower-tulip'
    },
    options: style
}

const palette = {
    //scheme: 'auto',
    title: "neoPluePink",
    light: light,
    dark: dark
}

const design = {
    preset: preset,
    palette: palette
}

export default design