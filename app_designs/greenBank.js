const light =  {
    "basics":{ 
        "accents":{"primary":"#D5F0F9","secondary":"#f0fbee","tertiary":"#b0ecbd","quaternary":"#16902D"},
        "neutrals":{"primary":"#f5f5f5","secondary":"#ffffff","tertiary":"#ffffff","quaternary":"#fafafa"}
    },
    "texts":{
        "accents":{"primary":"#14922E","secondary":"#0F7D24","tertiary":"#23B23E","quaternary":"#05C5C6"},
        "neutrals":{"primary":"#000000","secondary":"#000000","tertiary":"#b1b1b1","quaternary":"#FFFFFF"}
    },
    "icons":{
        "accents":{"primary":"#14922E","secondary":"#0F7D24","tertiary":"#23B23E","quaternary":"#05C5C6"},
        "neutrals":{"primary":"#000000","secondary":"#000000","tertiary":"#b1b1b1","quaternary":"#FFFFFF"}
    },
    "specials":{
        "dimout":"#000000",
        "separator":"#000000",
        "shadow":{"primary":"#000000","secondary":"#ffffff"},
        "selector": {
            "primary":"#158F2A",
            "secondary":"#a8e7a8",
            "tertiary":"#FFFFFF",
            "quaternary":"#C2C2C2",
        }
    }
}

const dark =  {
    "basics":{ 
        "accents":{"primary":'#D5F0F9',"secondary":"#35B848","tertiary":"#5DB048","quaternary":"#16902D"},
        "neutrals":{"primary":"#f5f5f5","secondary":"#ffffff","tertiary":"#ffffff","quaternary":"#fafafa"}
    },
    "texts":{
        "accents":{"primary":"#14922E","secondary":"#0F7D24","tertiary":"#23B23E","quaternary":"#05C5C6"},
        "neutrals":{"primary":"#000000","secondary":"#000000","tertiary":"#B1B1B1","quaternary":"#FFFFFF"}
    },
    "icons":{
        "accents":{"primary":"#14922E","secondary":"#0F7D24","tertiary":"#23B23E","quaternary":"#05C5C6"},
        "neutrals":{"primary":"#000000","secondary":"#000000","tertiary":"#B1B1B1","quaternary":"#FFFFFF"}
    },
    "specials":{
        "dimout":"#000000",
        "separator":"#000000",
        "shadow":{"primary":"#000000","secondary":"#ffffff"},
        "selector": {
            "primary":"#158F2A",
            "secondary":"#5C8E65",
            "tertiary":"#C2C2C2",
            "quaternary":"#FFFFFF"
        }
    }
}


const style = {
    "borderRadius":{"primary":13,"secondary":13},
    "effects":{"blur":false,"shadows":{"design":"material","inner":{"use":false,"opacity":0},"countColors":1,"opacity":0.19,"pos":{"x1":0,"y1":0.33,"x2":0,"y2":0},"blur":0.42}},
    "fab":{"size":64,"pos":{"x":1,"y":1},"highlight":{"ignoredShadows":{"disable":false},"outline":false}},
    "lists":{"proximity":{"v":6.5,"h":12}},
    "modals":{"proximity":{"h":0},"highlight":{"dimOutDark":true,"gradient":false,"outline":false}},
    "navigationMenu":{"height":54,"type":"type_1","pos":{"y":0,"x":0,"dx":0},"icons":{"highlight":{"coloring":true,"filling":false},"signature":true}},
    "selectors":{"design":{"checkBox":"type_2","radioButton":"type_2","switch":"type_3"}},
    "palette": "greenBank",
}

const preset = {
    name: 'greenBank',
    fill: {
        colors: ["#16902D", "#5DB048"],
        locs: [0,1],
    },
    icon: {
        name: 'bank'
    },
    options: style
}

const palette = {
    //scheme: 'auto',
    title: "greenBank",
    light: light,
    dark: dark
}

const design = {
    preset: preset,
    palette: palette
}

export default design