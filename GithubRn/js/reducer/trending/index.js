import Types from '../../action/types'
//根据action处理state
const defaultState={
}
/**
 * popular:{
 *     java:{
 *         items:[],
 *         isLoading:false
 *     },
 *     ios:{
 *         items:[],
 *         isLoading:false
 *     }
 * }
 * @param state
 * @param action
 * @returns {{theme: (onAction|string|Theme|ThemeReceived)}|{}}
 */
export default function onAction(state=defaultState,action ) {
    switch (action.type) {
        case Types.TRENDING_REFRESH_SUCCESS://下拉刷新成功
            return{
                ...state,//复制副本
                [action.storeName]:{
                    ...state[action.storeName],
                    items:action.items,//原始数据
                    projectModels:action.projectModels,//此次需要展示的数据
                    isLoading:false,
                    hideLoadMore:false,
                    pageIndex:action.pageIndex
                }
            };
        case Types.TRENDING_REFRESH://下拉刷新
            return{
                ...state,//复制副本
                [action.storeName]:{
                    ...state[action.storeName],
                    isLoading:true,
                    hideLoadMore:true,
                }
            };
        case Types.TRENDING_REFRESH_FAIL:
            return{
                ...state,//复制副本
                [action.storeName]:{
                    ...state[action.storeName],
                    isLoading:false,
                }
            };
        case Types.TRENDING_LOAD_MORE_SUCCESS://上拉加载更多
            return{
                ...state,//复制副本
                [action.storeName]:{
                    ...state[action.storeName],
                    projectModels:action.projectModels,
                    hideLoadingMore:false,
                    pageIndex:action.pageIndex,
                }
            };
        case Types.TRENDING_LOAD_MORE_FAIL://上拉加载更多失败
            return{
                ...state,//复制副本
                [action.storeName]:{
                    ...state[action.storeName],
                    // projectModels:action.projectModels,
                    hideLoadingMore:true,
                    pageIndex:action.pageIndex,
                }
            };
        // case Types.TRENDING_LOAD_MORE_FAIL:   //上拉加载更多失败
        //     return {
        //         ...state,
        //         [action.storeName]: {
        //             ...state[action.storeName],
        //             hideLoadingMore: true,
        //             pageIndex: action.pageIndex
        //         }
        //     }

        default:
            return state;
    }
}
