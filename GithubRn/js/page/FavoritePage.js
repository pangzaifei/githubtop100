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
    Button,
    FlatList,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import {connect} from 'react-redux'
import actions from '../action/index'
import {
    createMaterialTopTabNavigator,
} from 'react-navigation'

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
        'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});
import PopularItem from '../common/PopularItem'
import Toast from "react-native-easy-toast";
import NavigationBar from "../common/NavigationBar";

const URL='https://api.github.com/search/repositories?q=';
const QUERY_STR='&sort=stars'
const THEME_COLOR='#678';
const favoriteDao=new FavoriteDao(FLAG_STORAGE.flag_popular);
type Props = {};
export default class FavoritePage extends Component<Props> {
    constructor(props) {
        super(props);
        this.tabNames=['最热','趋势'];
    }
// export default class FavoritePage extends Component<Props> {
//         constructor(props) {
//             super(props)
//             console.disableYellowBox = true
//         }

    render() {
        let statusBar={
            backgroundColor:THEME_COLOR,
            barStyle:'light-content',
        };
        let navigationBar=<NavigationBar
        title={'最热'} statusBar={statusBar}
        style={{backgroundColor:THEME_COLOR}}
        />

        const TabNavigator=createMaterialTopTabNavigator(
            {
                'Popular': {
                    screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular}/>,
                    navigationOptions: {
                        title:'最热'
                    }
                },
                'Trending': {
                    screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending}/>,
                    navigationOptions: {
                        title:'趋势'
                    }
                }
            },{
                tabBarOptions:{
                    tabStyle:styles.tabStyle,
                    upperCaseLabel:false,
                    style:{
                        backgroundColor: '#678'//设置topbar背景色
                    },
                    indicatorStyle:styles.indicatorStyle,//标签指示器样式
                    labelStyle:styles.labelStyle,//文字的样式
                }
            }
        )
        return <View style={styles.container}>
            {navigationBar}
            <TabNavigator/>
        </View>
    }
}
import NavigationUtil from "../navigator/NavigationUtil";
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import TrendingItem from "../common/TrendingItem";
import EventTypes from "../util/EventTypes";
import EventBus from "react-native-event-bus"

class FavoriteTab extends Component<Props> {
    constructor(props) {
        super(props);
        const {flag} = this.props;
        this.storeName = flag;
        this.favoriteDao=new FavoriteDao(flag);
    }

    componentDidMount() {
        this.loadData(true);
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select,this.listener=data=>{
            if(data.to===2){
                this.loadData(false);
            }
        })
    }

    componentWillUnmount(){
        EventBus.getInstance().removeListener(this.listener);
    }

    loadData(isShowLoading) {
      const {onLoadFavoriteData} =this.props;
      onLoadFavoriteData(this.storeName,isShowLoading)

    }

    /**
     * 获取与当前页面有关的数据
     * @private
     */
    _store(){
        const {favorite}=this.props;
        console.log('fffpzf',"this.storeName:"+this.storeName+",this.props:"+this.props.toString())

        let store = favorite[this.storeName]
        if(!store){
            store={
                items:[],
                isLoading:false,
                projectModels:[],
            }
        }
        return store;
    }

    onFavorite(item,isFavorite){
        FavoriteUtil.onFavorite(this.favoriteDao,item,isFavorite,this.props.flag)
        if(this.storeName === FLAG_STORAGE.flag_popular) {
            EventBus.getInstance().fireEvent(EventTypes.favorite_change_popular)
        }else if(this.storeName === FLAG_STORAGE.flag_trending) {
            EventBus.getInstance().fireEvent(EventTypes.favoriteChanged_trending)
        }
    }
    renderItem(data) {
        const {theme}=this.props;
        const item = data.item;
        const Item=this.storeName===FLAG_STORAGE.flag_popular?PopularItem:TrendingItem;
        return <Item
            theme={theme}
            projectModel={item}
            onSelect={(callback) => {
                NavigationUtil.goPage({
                    theme,
                    projectModel:item,
                    flag:this.storeName,
                    callback,
                },'DetailPage')
            }}
            onFavorite={(item,isFavorite)=>this.onFavorite(item,isFavorite)}
        />

    }

        render() {
            let store=this._store();
            return (
                <View style={styles.container}>
                    <FlatList
                        data={store.projectModels}
                        renderItem={data => this.renderItem(data)}
                        keyExtractor={item => "" + (item.item.id||item.item.fullName)}
                        refreshControl={
                            <RefreshControl
                                title={'Loading'}
                                titleColor={THEME_COLOR}
                                colors={[THEME_COLOR]}
                                refreshing={store.isLoading}
                                onRefresh={() => this.loadData(true)}
                                tintColor={THEME_COLOR}
                            />
                        }

                    />
                    <Toast ref={'toast'}
                    position={'center'}/>
                </View>
            );
        }
}

const mapStateToProps=state=>({
    favorite:state.favorite
});
const mapDispatchToProps=dispatch=>({
    onLoadFavoriteData: (storeName,isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName,isShowLoading))
});

const FavoriteTabPage = connect(mapStateToProps,mapDispatchToProps)(FavoriteTab)


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    tabStyle: {
        minWidth:50,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    indicatorStyle: {
        height:2,
        backgroundColor:'white'
    },
    labelStyle: {
        fontSize: 13,
        marginTop:6,
        marginBottom: 6
    },
    indicatorContainer:{
        alignItems:"center"
    },
    indicator:{
        color:'red',
        margin:10
    }
});
