import {getMenu} from "../api/index"
import {ElMessage} from "element-plus";
const getMenuList = () => {
    return getMenu().then(res => {
        if(res.code != 200 || res.errorCode != 0 ){
            ElMessage.error(res.errorMessage)
            return false;
        }
        return res.data
    })
}

const getButtonList = (router) => {
    return getMenu().then(res => {
        if(res.code != 200 || res.errorCode != 0 ){
            ElMessage.error(res.errorMessage)
            return false;
        }
        var buttonList = findButton(res.data,router)
        return buttonList
    })
}

const findButton = (data, path) => {
    var buttonList = [];
    Object.values(data).forEach(item => {
        if(item.path == path) {
            buttonList = item.buttons;
            return
        }

        if(item.children.length > 0) {
            findButton(item.children, path)
        }
    })
    return buttonList;
}

export  {
    getMenuList,
    getButtonList
}