const light =  {
    "basics":{//F0A7C8 F4C4DE
        "accents":{"primary":"#18b4fe","secondary":"#fe63cb","tertiary":"#8ed2f2","quaternary":"#f202a3"},
        "neutrals":{"primary":"#e2f6ff","secondary":"#fff7ff","tertiary":"#eff8f5","quaternary":"#ffffff"}
    },
    "texts":{
        "accents":{"primary":"#f326b0","secondary":"#de63c5","tertiary":"#8CBD9E","quaternary":"#fad1f9"},
        "neutrals":{"primary":"#F2E8EB","secondary":"#331E13","tertiary":"#D3BCBD","quaternary":"#F4DEE5"}
    },
    "icons":{
        "accents":{"primary":"#f326b0","secondary":"#de63c5","tertiary":"#8CBD9E","quaternary":"#fad1f9"}, 
        "neutrals":{"primary":"#F2E8EB","secondary":"#331E13","tertiary":"#D3BCBD","quaternary":"#F4DEE5"}
    },
    "specials":{
        "dimout":"#000000",
        "separator":"#000000",
        "shadow":{"primary":"#000000","secondary":"#ffffff"},
        "selector": {
            "primary":"#8BE57E",
            "secondary":"#BCEEA8",
            "tertiary":"#F4FFE5",
            "quaternary":"#E5EFD3",
        }
    }
}

const dark =  {
    "basics":{//F0A7C8 F4C4DE
        "accents":{"primary":'#18B4FE',"secondary":"#5DB598","tertiary":"#B0E0F6","quaternary":"#F202A3"},
        "neutrals":{"primary":"#D8F7FC","secondary":"#E6E1E7","tertiary":"#F092B8","quaternary":"#8DD4F1"}
    },
    "texts":{
        "accents":{"primary":"#DF3E8E","secondary":"#BD307F","tertiary":"#8CBD9E","quaternary":"#509DE5"},
        "neutrals":{"primary":"#F2E8EB","secondary":"#331E13","tertiary":"#D3BCBD","quaternary":"#F4DEE5"}
    },
    "icons":{
        "accents":{"primary":"#DF3E8E","secondary":"#BD307F","tertiary":"#8CBD9E","quaternary":"#509DE5"},
        "neutrals":{"primary":"#F2E8EB","secondary":"#331E13","tertiary":"#D3BCBD","quaternary":"#F4DEE5"}
    },
    "specials":{
        "dimout":"#000000",
        "separator":"#000000",
        "shadow":{"primary":"#000000","secondary":"#ffffff"},
        "selector": {
            "primary":"#8BE57E",
            "secondary":"#BCEEA8",
            "tertiary":"#F4FFE5",
            "quaternary":"#E5EFD3"
        }
    }
}

const style = {
    "borderRadius":{"primary":36,"secondary":36},
    "effects":{"blur":false,"shadows":{"design":"square","inner":{"use":false,"opacity":0},"countColors":1,"opacity":0.54,"pos":{"x1":0.71,"y1":0.71,"x2":0,"y2":0},"blur":0.1}},
    "fab":{"size":68,"pos":{"x":1,"y":1},"highlight":{"ignoredShadows":{"disable":false},"outline":false}},
    "lists":{"proximity":{"v":6.5,"h":12}},
    "modals":{"proximity":{"h":12},"highlight":{"dimOutDark":false,"gradient":true,"outline":true}},
    "navigationMenu":{"height":48,"type":"type_1","pos":{"y":0,"x":0,"dx":0},"icons":{"highlight":{"coloring":true,"filling":true},"signature":false}},
    "palette":"custom",
    "selectors":{"design":{"checkBox":"type_2","radioButton":"type_1","switch":"type_3"}},
    "palette": "barbie",
}

const preset = {
    name: 'barbie',
    fill: {
        colors: ["#f202a3","#de63c5"],
        locs: [0,1],
    },
    icon: {
        name: 'human-female'
    },
    options: style
}

const palette = {
    //scheme: 'auto',
    title: "barbie",
    light: light,
    dark: dark
}

const design = {
    preset: preset,
    palette: palette
}

export default design