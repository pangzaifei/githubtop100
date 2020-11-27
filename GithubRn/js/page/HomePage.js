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
    View,
    BackHandler
} from 'react-native';
import {
    createBottomTabNavigator,
} from 'react-navigation'
import CustomTheme from "./CustomTheme";
import SafeAreaViewPlus from "../common/SafeAreaViewPlus";


const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
        'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

type Props = {};
import PopularPage from "./PopularPage";
// import FavoritePage from "./FavoritePage";
import MyPage from "./MyPage";
import TrendingPage from "./TrendingPage";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import NavigationUtil from "../navigator/NavigationUtil";
import DynamicTabNavigator from "../navigator/DynamicTabNavigator";
import actions from "../action";
import {connect} from 'react-redux'
import { NavigationActions } from 'react-navigation'
import BackPressComponent from "../common/BackPressComponent";
import {onShowCustomThemeView} from "../action/theme";


class HomePage extends Component<Props> {

    constructor(props) {
        super(props);
        this.backPress=new BackPressComponent({backPress:this.onBackPress()})
    }

    componentDidMount(){
        this.backPress.componentDidMount();
    }
    componentWillUnmount(){
        this.backPress.componentWillUnmount();
    }

    onBackPress=()=>{
        const {dispatch,nav} =this.props;
        if(nav.routes[1].index===0){
            return false;
        }
        dispatch(NavigationActions.back());
        return true;
    };

    renderCustomThemeView(){
        const {customThemeViewVisible,onShowCustomThemeView}=this.props;//从最下面的connect中取出数据
        return (<CustomTheme
            visible={customThemeViewVisible}
            {...this.props}
            onClose={()=>onShowCustomThemeView(false)}
        />)
    }
    render() {
        const {theme}=this.props;
        NavigationUtil.navigation=this.props.navigation;
        return <SafeAreaViewPlus
            topColor={theme.themeColor}
        >
            <DynamicTabNavigator/>
            {this.renderCustomThemeView()}
        </SafeAreaViewPlus>
        return
    }
}

const mapStateToProps = state => ({
    nav:state.nav,
    customThemeViewVisible:state.theme.customThemeViewVisible,
    theme:state.theme.theme,
})
const mapDispatchToProps=dispatch=>({
    onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show))
});

export default connect(mapStateToProps,mapDispatchToProps)(HomePage);



// const mapStateToProps = state => ({
//     nav:state.nav
// });
//
// export default connect(mapStateToProps)(HomePage);

