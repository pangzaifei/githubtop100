

export default class ArrayUtil {
    /**
     * 更新数据, 若已存在则从数组中删除,否则则添加到数组中
     * @param array
     * @param item
     */
    static updateArray(array,item) {
        for(let i = 0,len = array.length; i <len; i++) {
            let temp = array[i];
            if(item === temp) {
                array.splice(i,1);
                return;
            }
        }
        array.push(item)
    }

    /**
     * 将数组中的元素移除
     * @param array
     * @param item
     * @param id 要对比的属性(如果不传id则比较两元素在内存中的地址,传了则比较属性)
     * @returns {*}
     */
    static remove(array,item,id) {
        if(!array) return;
        for(let i = 0, l = array.length; i < l; i++) {
            const val = array[i];
            if(item === val || val && val[id] && val[id] === item[id]) {
                array.splice(i,1)
            }
        }
        return array
    }

    /**
     * 判断两个数组是否相等
     * @param arr1
     * @param arr2
     * @returns {boolean}
     */
    static isEqual(arr1,arr2) {
        if(!(arr1&&arr2))  return false;
        if(arr1.length !== arr2.length) return false;
        for(let i = 0, l = arr1.length; i < l; i++) {
            if(arr1[i] !== arr2[i]) return false
        }
        return true

    }


    static clone(from) {
        if(!from) return [];
        let newArray = [];
        for(let i = 0, l = from.length; i < l; i++) {
            newArray[i] = from[i];
        }
        return newArray
    }
}