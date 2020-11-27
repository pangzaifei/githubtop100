import {AsyncStorage} from 'react-native'
import langs from '../../res/data/langs'  //json类型的文件导入的话是一个json对象
import keys from '../../res/data/keys'
export const FLAG_LANGUAGE = {flag_language: 'language_dao_language',flag_key: 'language_dao_key'}
export default class LanguageDao {
    constructor(flag) {
        this.flag=flag;
    }


    fetch() {
        return new Promise((resolve,reject) => {
            AsyncStorage.getItem(this.flag, (error,result) => {
                if(error) {
                    reject(error);
                    return
                }
                //没有存储数据
                if(!result) {
                    let data = this.flag === FLAG_LANGUAGE.flag_language ? langs : keys
                    this.save(data);
                    resolve(data)
                }else {
                    try{
                        resolve(JSON.parse(result))  //如果库里面有数据则将json对象返回
                    }catch (e) {
                        reject(e)
                    }
                }
            })
        })
    }

    /**
     * 保存语言或标签
     * @param objectData
     */
    save(objectData) {
        let stringData = JSON.stringify(objectData);
        //存储的是json字符串
        AsyncStorage.setItem(this.flag,stringData,(error,result) => {

        })
    }

}