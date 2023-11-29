

import { listsHorizontalProximity } from "../../../app_values/AppDefault";

import useSizes from "../../../app_hooks/useSizes";

const SCREEN_PROXIMYTY_HRZ = listsHorizontalProximity['true']

const STYCKYS_HEIGHT = 33
const HEADER_TOOL_HEIGHT = 50
const SECTIONS_SELECTOR_HEIGHT = 46

const MARGIN_BOBBER = 8


const useTasksSizes = () => {
    const {width,height, osHeights: {statusBar, navigationBar}} = useSizes()

    const PRIMARY_HEADER_HEIGHT = statusBar+HEADER_TOOL_HEIGHT
    const SECONDARY_HEADER_HEIGHT = PRIMARY_HEADER_HEIGHT + SECTIONS_SELECTOR_HEIGHT

    const LIST_ITEM_SIZE = {
        h: width/2 + 1,
        w: width/2 + 1
    }
    const HEAD_COMPONENT_HEIGHT = LIST_ITEM_SIZE.h + 20

    return {
        STATUS_BAR_HEIGHT: statusBar,
        OS_NAVIGATION_BAR_HEIGHT: navigationBar,

        SCREEN_PROXIMYTY_HRZ: SCREEN_PROXIMYTY_HRZ,

        STYCKYS_HEIGHT: STYCKYS_HEIGHT,
        HEADER_TOOL_HEIGHT: HEADER_TOOL_HEIGHT,
        SECTIONS_SELECTOR_HEIGHT: SECTIONS_SELECTOR_HEIGHT,
        PRIMARY_HEADER_HEIGHT: PRIMARY_HEADER_HEIGHT,
        SECONDARY_HEADER_HEIGHT: SECONDARY_HEADER_HEIGHT,

        HEAD_COMPONENT_HEIGHT: HEAD_COMPONENT_HEIGHT,
        LIST_ITEM_SIZE: LIST_ITEM_SIZE,

        MARGIN_BOBBER:  MARGIN_BOBBER,

        DEVICE_H: height,
        DEVICE_W: width
    }
}

export default useTasksSizes


export const TRANSPARENT_COLOR = '#00000000'

