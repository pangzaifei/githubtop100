import React from 'react'
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
export default class ViewUtil {
    /**
     * 获取左侧的返回按钮
     * @param callBack
     */
    static getLeftBackButton(callBack) {
        return <TouchableOpacity
            style={{padding: 8, paddingLeft: 12}}
            onPress={callBack}
        >
            <Ionicons
                name={'ios-arrow-back'}
                size={26}
                style={{color: 'white'}}
            />

        </TouchableOpacity>
    }
    static getRightButton(title,callback) {
        return <TouchableOpacity
            style={{alignItems: 'center'}}
            onPress={callback}
        >
            <Text style={{fontSize: 20,color: '#FFFFFF',marginRight:10 }}>{title}</Text>
        </TouchableOpacity>
    }

    static getShareButton(callBack) {
        return <TouchableOpacity
            underlayColor={'transparent'}
            onPress={callBack}
        >
            <Ionicons
                name={'md-share'}
                size={20}
                style={{opacity: 0.9, marginRight: 10, color: 'white'}}
            />
        </TouchableOpacity>
    }
    static getSettingItem(callback, text, color, Icons, icon, expandableIco) {
        return <TouchableOpacity
            onPress={callback}
            style={styles.setting_item_container}
        >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {Icons && icon ?
                    <Icons
                        name={icon}
                        size={16}
                        style={{color: color, marginRight: 10}}
                    /> :
                    <View style={{opacity: 1, width: 16, height: 16, marginRight: 10}}></View>
                }
                <Text>{text}</Text>
            </View>
            <Ionicons
                name={expandableIco ? expandableIco : 'ios-arrow-forward'}
                size={16}
                style={{
                    marginRight: 10,
                    alignSelf: 'center',
                    color: color || 'black'
                }}
            />
        </TouchableOpacity>
    }

    static getMenuItem(callback,menu,color,expandableIco) {
        return ViewUtil.getSettingItem(callback,menu.name,color,menu.Icons,menu.icon,expandableIco)
    }




}



const styles = StyleSheet.create({
    setting_item_container: {
        backgroundColor: 'white',
        padding: 10,
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    }
})