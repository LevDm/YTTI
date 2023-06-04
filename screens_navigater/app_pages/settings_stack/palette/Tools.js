export const fullPaletteObjectUPD = (copiedObject, pathList, newValue) => {
    'worklet';
    const shemes = ['light', 'dark']
    const newObject = JSON.parse(JSON.stringify(copiedObject));
  
    const multiPath = Array.isArray(pathList[0])
  
    for(let i = 0; i<pathList.length; i++){
      const onePathList = multiPath? pathList[i] : pathList
      const oneValue = multiPath? newValue[i] : newValue
      const allShemesUpdate = (onePathList[0] != shemes[0] && onePathList[0] != shemes[1])
      for(let primaryKey of shemes){
        const resPath = allShemesUpdate? [primaryKey, ...onePathList] : onePathList
        //console.log(resPath,'=',oneValue)
        switch(resPath.length){
          case 1: 
            newObject[resPath[0]] = oneValue;
            break;
          case 2: 
            newObject[resPath[0]][resPath[1]] = oneValue;
            break;
          case 3: 
            newObject[resPath[0]][resPath[1]][resPath[2]] = oneValue;
            break;
          case 4: 
            newObject[resPath[0]][resPath[1]][resPath[2]][resPath[3]] = oneValue;
            break;
          case 5: 
            newObject[resPath[0]][resPath[1]][resPath[2]][resPath[3]][resPath[4]] = oneValue;
            break;
          default:
            console.log('!!!>PAINTER_EASE_UPDATE_DOES_NOT_HAVE_THIS_OBJECT_LVL',onePathList.length, onePathList);
        }
        if(!allShemesUpdate){break}
      }
      if(!multiPath){break}
    }
    return newObject
}


export const getFromObject = (object, pathList) => {
  'worklet';

  const multiPath = Array.isArray(pathList[0])

  let findValue = []
  
  for(let i = 0; i<pathList.length; i++){
    const onePathList = multiPath? pathList[i] : pathList

    const resPath =  onePathList
 
    switch(resPath.length){
      case 1: 
        findValue.push(object[resPath[0]]);
        break;
      case 2: 
        findValue.push(object[resPath[0]][resPath[1]])
        break;
      case 3: 
        findValue.push(object[resPath[0]][resPath[1]][resPath[2]])
        break;
      case 4: 
        findValue.push(object[resPath[0]][resPath[1]][resPath[2]][resPath[3]])
        break;
      case 5: 
        findValue.push(object[resPath[0]][resPath[1]][resPath[2]][resPath[3]][resPath[4]])
        break;
      default:
        console.log('!!!>PAINTER_EASE_FIND_DOES_NOT_HAVE_THIS_OBJECT_LVL',onePathList.length, onePathList);
    }
    if(!multiPath){break}
  }

  if(findValue.length == 0){
    return undefined
  } 
  else if (findValue.length == 1){
    return findValue[0]
  }
  return findValue
}