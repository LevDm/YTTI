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

const Gold = {
    theme: "gold",
    scheme: 'light',
    statusBar: 'dark',//'auto','inverted' ,'light' ,'dark'
    basics: {
        accents: {
            primary: '#ffea98',
            secondary: '#ffe474', 
            tertiary:  '#ffdd4c',
            quaternary: '#ffd700',
        },
        neutrals: {
            primary: '#f5f5f5', 
            secondary: '#ffffff', 
            tertiary: '#000000',
        },
    },
    texts: {
        accents: {
            primary: '#ffea98',
            secondary: '#ffe474', 
            tertiary:  '#ffdd4c',
            quaternary: '#ffd700',
        },
        neutrals: {
            primary: '#000', 
            secondary: '#fff', 
            tertiary: '#808080',
        },
    },
    icons: {
        accents: {
            primary: '#ffea98',
            secondary: '#ffe474', 
            tertiary:  '#ffdd4c',
            quaternary: '#ffd700',
        },
        neutrals: {
            primary: '#000', 
            secondary: '#fff', 
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
        light: Gold,
        dark: nightThemesColorsAppList[2]
    }, 
]

const themesColorsAppList0 = [Emerald, Olive, Gold]
export default themesColorsAppList;
export const themesApp = ["custom","emerald", "olive", "gold"]; 