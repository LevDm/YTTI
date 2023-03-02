const Emerald = { 
    theme: "emerald",
    scheme: 'light',
    statusBar: 'light',//'auto','inverted' ,'light' ,'dark'
    basics: {
        accents: {
            primary: '#50c878',
            secondary: '#77d496',  
            tertiary: '#9ee0b4',
            quaternary: '#c5edd2',
        },
        neutrals: {
            primary: '#f5f5f5', 
            secondary: '#ffffff', 
            tertiary: '#000000',
        },
    },
    texts: {
        accents: {
            primary: '#50c878',
            secondary: '#77d496',  
            tertiary: '#9ee0b4',
            quaternary: '#c5edd2',
        },
        neutrals: {
            primary: '#ffffff', 
            secondary: '#000000', 
            tertiary: '#808080',
        },
    },
    icons: {
        accents: {
            primary: '#50c878',
            secondary: '#77d496',  
            tertiary: '#9ee0b4',
            quaternary: '#c5edd2',
        },
        neutrals: {
            primary: '#ffffff', 
            secondary: '#000000', 
            tertiary: '#808080',
        },
    },
    specials: {
        fire: {
            primary: '#f00',
            secondary: '#a5a5a5',
        },
    },
    
}

const Olive = {
    theme: "olive",
    scheme: 'light',
    statusBar: 'light',//'auto','inverted' ,'light' ,'dark'
    basics: {
        accents: {
            primary: '#6b8e23',
            secondary: '#85a04a', 
            tertiary: '#9eb36d', 
            quaternary: '#b6c590',
        },
        neutrals: {
            primary: '#f5f5f5', 
            secondary: '#ffffff', 
            tertiary: '#000000',
        },
    },
    texts: {
        accents: {
            primary: '#6b8e23',
            secondary: '#85a04a', 
            tertiary: '#9eb36d', 
            quaternary: '#b6c590',
        },
        neutrals: {
            primary: '#ffffff', 
            secondary: '#000000', 
            tertiary: '#808080',
        },
    },
    icons: {
        accents: {
            primary: '#6b8e23',
            secondary: '#85a04a', 
            tertiary: '#9eb36d', 
            quaternary: '#b6c590',
        },
        neutrals: {
            primary: '#ffffff', 
            secondary: '#000000', 
            tertiary: '#808080',
        },
    },
    specials: {
        fire: {
            primary: '#f00',
            secondary: '#a5a5a5',
        },
    },
}

const MorpPinkBlue = {
    "theme":"morpPinkBlue",
    "scheme":"light","statusBar":"auto",
    "basics":{"accents":{"primary":"#e896ff","secondary":"#cdb1f2","tertiary":"#93c7f2","quaternary":"#bfd8f9"},"neutrals":{"primary":"#ebf8ff","secondary":"#ebf8ff","tertiary":"#464646"}},
    "texts":{"accents":{"primary":"#e896ff","secondary":"#cdb1f2","tertiary":"#93c7f2","quaternary":"#b7daf6"},"neutrals":{"primary":"#f6fbff","secondary":"#3e526b","tertiary":"#b4c9f5"}},
    "icons":{"accents":{"primary":"#e896ff","secondary":"#cdb1f2","tertiary":"#93c7f2","quaternary":"#bfd8f9"},"neutrals":{"primary":"#f6fbff","secondary":"#37485e","tertiary":"#b4c9f5"}},
    "specials":{"fire":{"primary":"#f00","secondary":"#a5a5a5"}}
}

import nightThemesColorsAppList from "./ThemesNight"

const themesColorsAppList = [
    null,
    {
        light: Emerald,
        dark: nightThemesColorsAppList[0]
    },
    {
        light: Olive,
        dark: nightThemesColorsAppList[1]
    },
    {
        light: MorpPinkBlue,
        dark: nightThemesColorsAppList[2]
    }, 
]

export default themesColorsAppList;
export const themesApp = ["custom","emerald", "olive", "morpPinkBlue"]; 