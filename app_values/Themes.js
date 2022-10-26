const Emerald = { 
    theme: "emerald",
    scheme: 'light',
    statusBar: 'light',//'auto','inverted' ,'light' ,'dark'
    basics: {
        accents: {
            primary: '#50c878',
            secondary: '#73d28e', 
            tertiary: '#92dba4', 
            quaternary: '#aee5ba',
        },
        neutrals: {
            primary: '#ffffff', 
            secondary: '#000000', 
            tertiary: '#808080',
        },
        grounds: {
            primary: '#ffffff', 
            secondary: '#f5f5f5', 
        },
    },
    texts: {
        accents: {
            primary: '#50c878',
            secondary: '#73d28e', 
            tertiary: '#92dba4', 
            quaternary: '#aee5ba',
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
            secondary: '#73d28e', 
            tertiary: '#92dba4', 
            quaternary: '#aee5ba',
        },
        neutrals: {
            primary: '#ffffff', 
            secondary: '#000000', 
            tertiary: '#808080',
        },
    },
    navigateBar: {
        ground: '#ffffff',
        transparentGround: '#00000020',
        icons: {active: '#50c878', notActive: '#000000'},
        text: {active: '#50c878', notActive: '#000000'},
    },
    modals: {
        thumb: '#50c878',
        outline: '#50c878',
        ground: '#ffffff',

        basics: {
            ground: {
                primary: '#fafafa',
                secondary: '#ffffff',
                tertiary: '#50c878',
            }
        },
        texts: {
            primary: '#000000',
            secondary: '#ffffff',
            tertiary: '#808080',
        },
        icons: {
            primary: '#000000',
            secondary: '#ffffff',
            tertiary: '#808080',
        }


    },
    specials: {
        fire: {
            primary: '#f00',
            secondary: '#a5a5a5',
        },
        transparents: {
            dim: '#00000025',
        }
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
            primary: '#ffffff', 
            secondary: '#000000', 
            tertiary: '#808080',
        },
        grounds: {
            primary: '#ffffff', 
            secondary: '#f5f5f5', 
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
    navigateBar: {
        ground: '#ffffff',
        transparentGround: '#00000020',
        icons: {active: '#6b8e23', notActive: '#000000'},
        text: {active: '#6b8e23', notActive: '#000000'},
    },
    modals: {
        thumb: '#6b8e23',
        outline: '#6b8e23',
        ground: '#ffffff', 

        basics: {
            ground: {
                primary: '#fafafa',
                secondary: '#ffffff',
                tertiary: '#6b8e23',
            }
        },
        texts: {
            primary: '#000000',
            secondary: '#ffffff',
            tertiary: '#808080',
        },
        icons: {
            primary: '#000000',
            secondary: '#ffffff',
            tertiary: '#808080',
        }
    },
    specials: {
        fire: {
            primary: '#f00',
            secondary: '#a5a5a5',
        },
        transparents: {
            dim: '#00000025',
        }
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
            primary: '#000', 
            secondary: '#fff', 
            tertiary: '#808080',
        },
        grounds: {
            primary: '#fff', 
            secondary: '#f5f5f5', 
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
    navigateBar: {
        ground: '#ffffff',
        transparentGround: '#00000020',
        icons: {active: '#6b8e23', notActive: '#000000'},
        text: {active: '#6b8e23', notActive: '#000000'},
    },
    modals: {
        thumb: '#6b8e23',
        outline: '#6b8e23',
        ground: '#ffffff',
        
        basics: {
            ground: {
                primary: '#fafafa',
                secondary: '#ffffff',
                tertiary: '#6b8e23',
            }
        },
        texts: {
            primary: '#000000',
            secondary: '#ffffff',
            tertiary: '#808080',
        },
        icons: {
            primary: '#000000',
            secondary: '#ffffff',
            tertiary: '#808080',
        }
    },
    specials: {
        fire: {
            primary: '#f00',
            secondary: '#a5a5a5',
        },
        transparents: {
            dim: '#00000025',
        }
    },
}

import nightThemesColorsAppList from "./ThemesNight"

const themesColorsAppList = [
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
export const themesApp = ["emerald", "olive", "gold"]; 