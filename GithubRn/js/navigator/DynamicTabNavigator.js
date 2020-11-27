/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {
    createBottomTabNavigator,

} from 'react-navigation'
import {connect} from 'react-redux'



const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
        'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

type Props = {};
import PopularPage from "../page/PopularPage";
// import FavoritePage from "../page/FavoritePage";
import MyPage from "../page/MyPage";
import TrendingPage from "../page/TrendingPage";
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
// import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import NavigationUtil from "../navigator/NavigationUtil";
import createNavigator from "react-navigation/src/navigators/createNavigator";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {
    BottomTabBar,
} from 'react-navigation-tabs'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Foundation from 'react-native-vector-icons/Foundation'
import EventBus from 'react-native-event-bus'
import EventTypes from "../util/EventTypes";


const TABS = {
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: "最热",
            tabBarIcon: ({tintColor,focused}) => {
                return <Ionicons
                    name={'md-rocket'}
                    size={26}
                    style={{color:tintColor}}
                />
            }
        }
    },
    TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {
            tabBarLabel: '趋势',
            tabBarIcon: ({tintColor,focused}) => {
                return <Ionicons
                    name={'md-trending-up'}
                    size={26}
                    style={{color:tintColor}}
                />
            }
        }
    },
    // FavoritePage: {
    //     screen: FavoritePage,
    //     navigationOptions: {
    //         tabBarLabel: '收藏',
    //         tabBarIcon: ({tintColor,focused}) => {
    //             return <MaterialIcons
    //                 name={'favorite'}
    //                 size={26}
    //                 style={{color:tintColor}}
    //             />
    //         }
    //     }
    // },
    MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({tintColor,focused}) => {
                return <Foundation
                    name={"social-myspace"}
                    size={26}
                    style={{color:tintColor}}
                />
            }
        }
    }
};


class DynamicTabNavigator extends Component<Props> {
    constructor(props) {
        super(props);
        console.disableYellowBox=true;
    }


    _tabNavigator() {
        if(this.Tabs){
            return this.Tabs;
        }
        const {PopularPage,TrendingPage,MyPage}=TABS;
        const tabs={PopularPage,TrendingPage,MyPage};//要动态显示的tabs
        return this.Tabs=createBottomTabNavigator(tabs,{
            tabBarComponent:props=>{
                return <TabBarComponent theme={this.props.theme}{...props}/>
            }
        })

    }

    render() {
        const Tab = this._tabNavigator();
        return <Tab
            onNavigationStateChange={(prevState, newState,action) => {
                EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select,{
                    from:prevState.index,
                    to:newState.index
                })
            }}

        />
    }
}

class TabBarComponent extends React.Component{
    constructor(props) {
        super(props);
        this.theme={
            tintColor:props.activeTintColor,
            updateTime:new Date().getTime(),
        }
    }
    render(){
        return <BottomTabBar
            {...this.props}
            activeTintColor={this.props.theme.themeColor}
        />
    }

}

const mapStatetoProps=state=>({
    theme:state.theme.theme,
});

export default connect(mapStatetoProps)(DynamicTabNavigator);

