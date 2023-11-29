
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

export default presets = [
    {
        name: 'YTTI-custom',
        icon: {
            name: 'account-circle-outline'
        },
        options: null
    },
    uiStock.preset,
    uiYellowBank.preset,
    uiWhatsap.preset,
    uiTelegram.preset,
    uiVK.preset,
    olive.preset,
    nineties.preset,
    uiCake.preset,
    uiCyber.preset,
    uiGreenglass.preset,
    uiInstagram.preset,
    uiNeoBluePink.preset,

    uiGreenBank.preset,
    uiBarbie.preset,
    uiUniverseHP.preset
]

export const presetsNames = presets.map((item)=>item.name)
