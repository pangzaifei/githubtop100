import {AsyncStorage} from 'react-native'
import langs from '../../res/data/langs'  //json类型的文件导入的话是一个json对象
import keys from '../../res/data/keys'
import ThemeFactory, {ThemeFlags} from "../../res/styles/ThemeFactory";
const THEME_KEY='theme_key'
export default class ThemeDao {
    getTheme() {//从数据库中获取主题
        return new Promise((resolve,reject) => {
            AsyncStorage.getItem(THEME_KEY, (error,result) => {
                if(error) {
                    reject(error);
                    return
                }
                //没有存储数据
                if(!result) {
                    this.save(ThemeFlags.Default);
                    result=ThemeFlags.Default;
                }
                resolve(ThemeFactory.createTheme(result))
            })
        })
    }

    /**
     * 保存主题
     * @param objectData
     */
    save(themeFlag) {
        //存储的是json字符串
        AsyncStorage.setItem(THEME_KEY,themeFlag,(error => {

        }))
    }

}