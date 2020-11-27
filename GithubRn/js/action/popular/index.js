import Types from '../types'
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore'
import {_projectModels, handleData} from '../ActionUtil'
//获取最热数据的异步action
/**
 *
 * @param storeName
 * @param url
 * @param pageSize
 * @returns {function(...[*]=)}
 */
export function onRefreshPopular(storeName,url,pageSize,favoriteDao) {
    return dispatch=>{
        dispatch({type:Types.POPULAR_REFRESH,storeName:storeName});
        let dataStore=new DataStore();
        dataStore.fetchData(url,FLAG_STORAGE.flag_popular)
            .then(data=>{
                handleData(Types.POPULAR_REFRESH_SUCCESS,dispatch,storeName,data,pageSize,favoriteDao)
            })
            .catch(error=>{
                console.log(error);
                dispatch({
                    type:Types.POPULAR_REFRESH_FAIL,storeName,error
                });
            })
    }
}
export function onLoadMorePopular(storeName,pageIndex,pageSize,dataArray=[],favoriteDao,callBack) {
    return dispatch=>{
        setTimeout(()=>{
            if((pageIndex-1)*pageSize>=dataArray.length){
                if(typeof callBack==='function'){
                    callBack('no more')
                }
                dispatch({
                    type:Types.POPULAR_LOAD_MORE_FAIL,
                    error:'no more',
                    storeName:storeName,
                    pageIndex:--pageIndex,
                })
            }else{//本次和载入的最大数量
                let max=pageSize*pageIndex>dataArray.length?dataArray.length:pageSize*pageIndex;
                _projectModels(dataArray.slice(0,max),favoriteDao,data=>{
                    dispatch({
                        type:Types.POPULAR_LOAD_MORE_SUCCESS,
                        storeName,
                        pageIndex,
                        projectModels:data,
                    })
                })

            }
        },500);
    }
}

export function onFlushPopularFavorite(storeName,pageIndex,pageSize,dataArray=[],favoriteDao) {
    return dispatch=>{
        let max=pageSize*pageIndex>dataArray.length?dataArray.length:pageSize * pageIndex;
        _projectModels(dataArray.slice(0,max),favoriteDao,data=>{
            dispatch({
                type:Types.FLUSH_POPULAR_FAVORITE,
                storeName,
                pageIndex,
                projectModels:data,
            })
        })
    }

}


// function handleData(dispatch,storeName,data,pageSize) {
//     let fixItems=[];
//     if(data&&data.data&&data.data.items){
//         fixItems=data.data.items;
//     }
//
//     dispatch({
//         type:Types.POPULAR_REFRESH_SUCCESS,
//         items:fixItems,
//         projectModels:pageSize>fixItems.length?fixItems:fixItems.slice(0,pageSize),//第一次加载的数据
//         storeName,
//         pageIndex:1
//     })
//
// }
