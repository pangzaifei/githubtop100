import {AsyncStorage} from 'react-native'
import Trending from 'GitHubTrending'

export const FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'}
export default class DataStore {


    fetchData(url, flag) {
        return new Promise((resolve, reject) => {
            this.fetchLocalData(url).then((wrapData) => {
                if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
                    resolve(wrapData);
                } else {
                    this.fetchNetData(url,flag).then((data) => {
                        resolve(this._wrapData(data));
                    }).catch((error) => {
                        reject(error);
                    })
                }
            }).catch((error) => {
                this.fetchNetData(url,flag).then((data) => {
                    resolve(this._wrapData(data));
                }).catch((error) => {
                    reject(error);
                })
            })
        })
    }

    //有效期检测
    static checkTimestampValid(timestamp) {
        const currentData = new Date();
        const targetDate = new Date();
        targetDate.setTime(timestamp);
        if (currentData.getMonth() !== targetDate.getMonth()) return false;
        if (currentData.getDate() !== targetDate.getDate()) return false;
        if (currentData.getHours() - targetDate.getHours() > 4) return false;
        return true;
    }


    saveData(url, data, callback) {
        if (!data || !url) return;
        AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback);
    }

    fetchLocalData(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                        console.error(e);
                    }
                } else {
                    reject(error);
                    console.error(error);
                }
            })
        });
    }

    _wrapData(data) {
        return {data: data, timestamp: new Date().getTime()};
    }

    //获取网络数据
    fetchNetData(url,flag) {
        return new Promise((resolve, reject) => {
            if(flag!==FLAG_STORAGE.flag_trending){
                fetch(url)
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        }
                        throw new Error('Network response was not ok.')
                    })
                    .then((responseData) => {
                        this.saveData(url, responseData)
                        resolve(responseData);
                    })
                    .catch((error) => {
                        reject(error);
                    })
            }else{
                new Trending().fetchTrending(url).then(items=>{
                    if(!items){
                        throw new Error('responseData is null');
                    }
                    this.saveData(url,items);
                    resolve(items);
                })
                    .catch(error=>{
                        reject(error)
                    })
            }



        })
    }

}