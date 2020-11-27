import React,{Component} from 'react'
import { BackHandler } from 'react-native'
//当用户设置了backPress 的时候  安卓物理返回键回调的时候会回调这个监听
export default class BackPressComponent {
    constructor(props) {
        this._hardwareBackPress = this.onHardwareBackPress.bind(this)
        this.props = props
    }

    componentDidMount() {
        if(this.props.backPress) BackHandler.addEventListener('hardwareBackPress',this._hardwareBackPress)
    }

    componentWillUnmount() {
        if(this.props.backPress) BackHandler.removeEventListener('hardwareBackPress',this._hardwareBackPress)
    }


    onHardwareBackPress(e) {
        return this.props.backPress(e)
    }
}