import Types from '../types'
import LanguageDao from "../../expand/dao/LanguageDao";
//获取最热数据的异步action
/**
 *
 * @param storeName
 * @param url
 * @param pageSize
 * @returns {function(...[*]=)}
 */
export function onLoadLanguage(flagKey) {
    return async dispatch=>{
        try {
            let languages= await new LanguageDao(flagKey).fetch();//获取数据
            //数据获取完之后，dispatch一个action
            dispatch({type:Types.LANGUAGE_LOAD_SUCCESS,languages:languages,flag:flagKey})
        }catch (e) {
            console.log(e)
        }

    }
}