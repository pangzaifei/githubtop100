import Types from '../../action/types'
import {FLAG_LANGUAGE} from "../../expand/dao/LanguageDao";
//根据action处理state
const defaultState={
    languages:[],
    keys:[]
}
/**
 * favorite:{
 *     popular:{
 *         projectModels:[],
 *         isLoading:false
 *     },
 *     trending:{
 *         projectModels:[],
 *         isLoading:false
 *     }
 * }
 * @param state
 * @param action
 * @returns {{theme: (onAction|string|Theme|ThemeReceived)}|{}}
 */
export default function onAction(state=defaultState,action ) {
    switch (action.type) {
        case Types.LANGUAGE_LOAD_SUCCESS://获取数据
            if(FLAG_LANGUAGE.flag_key===action.flag){
                return {
                    ...state,
                    keys:action.languages
                }
            }else{
                return {
                    ...state,
                    languages:action.languages
                }
            }

        default:
            return state;
    }
}
