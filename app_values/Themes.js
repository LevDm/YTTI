

import uiStock from '../app_designs/stock'
import uiYellowBank from '../app_designs/yellowBank'
import uiWhatsap from '../app_designs/whatsapp'
import uiTelegram from '../app_designs/telegram'
import uiVK from '../app_designs/vk'
import olive from '../app_designs/olive'
import nineties from '../app_designs/nineties'
import uiCake from '../app_designs/cake'
import uiCyber from '../app_designs/cyber'
import uiGreenglass from '../app_designs/greenglass'
import uiInstagram from '../app_designs/instagram'
import uiNeoBluePink from '../app_designs/neoBluePink'
import uiGreenBank from '../app_designs/greenBank'
import uiBarbie from '../app_designs/barbie'
import uiUniverseHP from '../app_designs/universeHP'


const themesColorsAppList = [
    null, //place custom theme
    uiStock.palette,
    uiYellowBank.palette,
    uiWhatsap.palette,
    uiTelegram.palette,
    uiVK.palette,
    olive.palette,
    nineties.palette,
    uiCake.palette,
    uiCyber.palette,
    uiGreenglass.palette,
    uiInstagram.palette,
    uiNeoBluePink.palette,
    uiGreenBank.palette,
    uiBarbie.palette,
    uiUniverseHP.palette,
]

export default themesColorsAppList;
export const themesApp = themesColorsAppList.map((item, index)=>index!=0? item.title : 'custom')
