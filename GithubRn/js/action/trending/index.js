import Types from '../types'
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore'
import {handleData} from '../ActionUtil'
//获取最热数据的异步action
/**
 *
 * @param storeName
 * @param url
 * @param pageSize
 * @returns {function(...[*]=)}
 */
export function onRefreshTrending(storeName,url,pageSize) {
    return dispatch=>{
        dispatch({type:Types.TRENDING_REFRESH,storeName:storeName});
        let dataStore=new DataStore();
        console.log('fffpzf',url);
        dataStore.fetchData(url,FLAG_STORAGE.flag_trending)
            .then(data=>{
                console.log('fffpzf',data);
                handleData(Types.TRENDING_REFRESH_SUCCESS,dispatch,storeName,data,pageSize)
            })
            .catch(error=>{
                console.log('fffpzf',error.toString());
                dispatch({
                    type:Types.TRENDING_REFRESH_FAIL,storeName,error
                });
            })
    }
}



export function onLoadMoreTrending(storeName,pageIndex,pageSize,dataArray=[],callBack) {
    return dispatch=>{
        setTimeout(()=>{
            if((pageIndex-1)*pageSize>=dataArray.length){
                if(typeof callBack==='function'){
                    callBack('no more')
                }
                dispatch({
                    type:Types.TRENDING_LOAD_MORE_FAIL,
                    error:'no more',
                    storeName:storeName,
                    pageIndex:--pageIndex,
                    projectModels:dataArray
                })
            }else{//本次和载入的最大数量
                let max=pageSize*pageIndex>dataArray.length?dataArray.length:pageSize*pageIndex;
                dispatch({
                    type:Types.TRENDING_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModels:dataArray.slice(0,max),
                    // projectModels: projectModels
                })
            }
        },500);
    }
}


