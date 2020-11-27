/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import NavigationUtil from "../navigator/NavigationUtil";
import SplashScreen from "react-native-splash-screen";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class WelcomePage extends Component<Props> {
  componentDidMount(){
    //欢迎页停几秒进主页
  this.timer=setTimeout(()=>{
      // const {navigation}=this.props;
      // navigation.navigate("Main")
    SplashScreen.hide();
    NavigationUtil.resetToHomePage({
      navigation:this.props.navigation
    })
    },2000);
  }
  componentWillUnMount(){
    //页面关闭取消timeout
    this.timer&&clearTimeout(this.timer);
  }
  render() {//可以在这里弹广告
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
