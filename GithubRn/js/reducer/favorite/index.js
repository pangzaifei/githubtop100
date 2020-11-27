import Types from '../../action/types'
//根据action处理state
const defaultState={
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
        case Types.FAVORITE_LOAD_DATA://获取数据
            return{
                ...state,//复制副本
                [action.storeName]:{
                    ...state[action.storeName],
                    isLoading:true,
                }
            };
        case Types.FAVORITE_LOAD_SUCCESS://下拉获取数据成功
            return{
                ...state,//复制副本
                [action.storeName]:{
                    ...state[action.storeName],
                    projectModels:action.projectModels,//从action中获取数据
                    isLoading:false,
                }
            };
        case Types.FAVORITE_LOAD_FAIL:
            return{
                ...state,//复制副本
                [action.storeName]:{
                    ...state[action.storeName],
                    isLoading:false,
                }
            };

        default:
            return state;
    }
}
