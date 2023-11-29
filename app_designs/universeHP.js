const light =  {
    "basics":{
        "accents":{"primary":"#f6ad0e","secondary":"#da2a2a","tertiary":"#fbd974","quaternary":"#D59418"},
        "neutrals":{"primary":"#BCB38E","secondary":"#e0d4b5","tertiary":"#d6c69c","quaternary":"#E0DAB1"},
    },
    "texts":{
        "accents":{"primary":"#842810","secondary":"#E28B76","tertiary":"#E26A6A","quaternary":"#FEDD2C"},
        "neutrals":{"primary":"#301800","secondary":"#4C3F2C","tertiary":"#AD9F8E","quaternary":"#9F0104"},
    },
    "icons":{
        "accents":{"primary":"#842810","secondary":"#E28B76","tertiary":"#E26A6A","quaternary":"#FEDD2C"},
        "neutrals":{"primary":"#301800","secondary":"#4C3F2C","tertiary":"#AD9F8E","quaternary":"#9F0104"}
    },
    "specials":{
        "dimout":"#000000",
        "separator":"#000000",
        "shadow":{"primary":"#000000","secondary":"#ffffff"},
        "selector": {
            "primary":"#F7BD00",
            "secondary":"#DBB995",
            "tertiary":"#EFF7F7",
            "quaternary":"#B7AD9C",
        }
    }
}

const dark =  {
    "basics":{
        "accents":{"primary":'#F6AE11',"secondary":"#B30304","tertiary":"#F1B607","quaternary":"#D59418"},
        "neutrals":{"primary":"#BCB38E","secondary":"#E0D4B5","tertiary":"#","quaternary":"#E0DAB1"}
    },
    "texts":{
        "accents":{"primary":"#E54E27","secondary":"#E28B76","tertiary":"#E26A6A","quaternary":"#FEDD2C"},
        "neutrals":{"primary":"#301800","secondary":"#4C3F2C","tertiary":"#AD9F8E","quaternary":"#9F0104"}
    },
    "icons":{
        "accents":{"primary":"#E54E27","secondary":"#E28B76","tertiary":"#E26A6A","quaternary":"#FEDD2C"},
        "neutrals":{"primary":"#301800","secondary":"#4C3F2C","tertiary":"#AD9F8E","quaternary":"#9F0104"}
    },
    "specials":{
        "dimout":"#000000",
        "separator":"#000000",
        "shadow":{"primary":"#000000","secondary":"#ffffff"},
        "selector": {
            "primary":"#F7BD00",
            "secondary":"#DBB995",
            "tertiary":"#EFF7F7",
            "quaternary":"#B7AD9C",
        }
    }   
}

const style = {
    "borderRadius":{"primary":1,"secondary":1},
    "effects":{"blur":false,"shadows":{"design":"full","inner":{"use":false,"opacity":0},"countColors":1,"opacity":0.18,"pos":{"x1":0,"y1":0,"x2":0,"y2":0},"blur":0.52}},
    "fab":{"size":62,"pos":{"x":1,"y":0},"highlight":{"ignoredShadows":{"disable":false},"outline":false}},
    "lists":{"proximity":{"v":6.5,"h":0}},
    "modals":{"proximity":{"h":0},"highlight":{"dimOutDark":true,"gradient":false,"outline":false}},
    "navigationMenu":{"height":62,"type":"type_1","pos":{"y":0,"x":0,"dx":0},"icons":{"highlight":{"coloring":false,"filling":true},"signature":true}},
    "palette": "universeHP",
    "selectors":{"design":{"checkBox":"type_1","radioButton":"type_2","switch":"type_3"}}
}

const preset = {
    name: 'universeHP',
    fill: {
        colors: ["#f6ad0e","#da2a2a"],
        locs: [.5,.5],
    },
    icon: {
        name: 'lightning-bolt'
    },
    options: style
}

const palette = {
    //scheme: 'auto',
    title: "universeHP",
    light: light,
    dark: dark
}

const design = {
    preset: preset,
    palette: palette
}

export default design