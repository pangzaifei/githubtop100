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
import {connect} from 'react-redux';
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
const favoriteDao=new FavoriteDao(FLAG_STORAGE.flag_popular);
type Props = {};
class PopularPage extends Component<Props> {
    constructor(props) {
        super(props);
        //加载标签
        // this.tabNames=['Java','Android','IOS','React','React Native','PHP'];
        const {onLoadLanguage}=this.props;
        onLoadLanguage(FLAG_LANGUAGE.flag_key);
    }
    _genTabs(){
        const tabs={};
        const {keys,theme}=this.props;
        keys.forEach((item,index)=>{
            if(item.checked){
                tabs[`tab${index}`]={
                    screen:props=><PopularTabTabPage {...props} tabLabel={item.name} theme={theme}/>,  //传递参数，重要
                    navigationOptions:{
                        title:item.name
                    }
                }
            }

        });
        return tabs;
    }
    render() {
        const {keys,theme}=this.props;
        let statusBar={
            backgroundColor:theme.themeColor,
            barStyle:'light-content',
        };
        let navigationBar=<NavigationBar
            title={'最热'} statusBar={statusBar}
            style={theme.styles.navBar}
        />

        const TabNavigator=keys.length?createMaterialTopTabNavigator(
            this._genTabs(),{
                tabBarOptions:{
                    tabStyle:styles.tabStyle,
                    upperCaseLabel:false,
                    scrollEnabled:true,
                    style:{
                        backgroundColor: theme.themeColor//设置topbar背景色
                    },
                    indicatorStyle:styles.indicatorStyle,//标签指示器样式
                    labelStyle:styles.labelStyle,//文字的样式
                },
                lazy:true //每次只渲染一个列表
            }
        ):null;
        return <View style={styles.container}>
            {navigationBar}
            {TabNavigator&&<TabNavigator/>}

        </View>
    }
}
import NavigationUtil from "../navigator/NavigationUtil";
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import EventBus from 'react-native-event-bus'
import EventTypes from "../util/EventTypes";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";


const mapPopularStateToProps = state => ({
    //订阅了一个keys将其映射在props上面, 那就是language 这个reducer的keys
    keys: state.language.keys,
    theme:state.theme.theme,
})
const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})
export default connect(mapPopularStateToProps,mapPopularDispatchToProps)(PopularPage)

const pageSize=99;
class PopularTab extends Component<Props> {
    constructor(props) {
        super(props);
        const {tabLabel} = this.props;
        this.storeName = tabLabel;
        this.isFavoriteChange=false;
    }

    componentDidMount() {
        this.loadData();
        //两个监听   1收藏模块最热中item收藏发生变化的监听 2底部tab切换
        EventBus.getInstance().addListener(EventTypes.favorite_change_popular,this.favoriteChangeListener = () => {
            this.isFavoriteChanged = true
        })
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select,this.bottomTabSelectListener = data => {
            if(data.to === 0 && this.isFavoriteChanged) {
                this.loadData(null,true)
            }
        })

    }
    componentWillUnmount(): void {
        EventBus.getInstance().removeListener(this.favoriteChangeListener)
        EventBus.getInstance().removeListener(this.bottomTabSelectListener)
    }

    loadData(loadMore,refreshFavorite) {
        const {onRefreshPopular,onLoadMorePopular,onFlushPopularFavorite} = this.props;
        const store=this._store();
        const url = this.genFetchUrl(this.storeName);
        if(loadMore){
            onLoadMorePopular(this.storeName, ++store.pageIndex,pageSize,store.items,favoriteDao,callback=>{
                this.refs.toast.show('没有更多了')
            });
        }else if(refreshFavorite){
            onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
        } else{
            onRefreshPopular(this.storeName, url,pageSize,favoriteDao);
        }

    }

    /**
     * 获取与当前页面有关的数据
     * @private
     */
    _store(){
        const {popular}=this.props;
        let store=popular[this.storeName];
        if(!store){
            store={
                items:[],
                isLoading:false,
                projectModels:[],
                hideLoadingMore:true,
            }
        }
        return store;
    }

    genFetchUrl(key) {
        return URL + key + QUERY_STR;
    }

    renderItem(data) {
        const item = data.item;
        const {theme}=this.props;
        return <PopularItem
            projectModel={item}
            theme={theme}
            onSelect={(callback) => {
                NavigationUtil.goPage({
                    theme,
                    projectModel:item,
                    flag:FLAG_STORAGE.flag_popular,
                    callback
                },'DetailPage')
            }}
            onFavorite={(item,isFavorite)=>FavoriteUtil.onFavorite(favoriteDao,item,isFavorite,FLAG_STORAGE.flag_popular)}
        />

    }
    genIndicator(){
        return this._store().hideLoadingMore?null:
            <View style={styles.indicatorContainer}>
                <ActivityIndicator style={styles.indicator}
                />
                <Text>正在加载更多</Text>
            </View>
    }
    render() {
        // const {popular} = this.props;
        // let store = popular[this.storeName];
        // if (!store) {
        //     store = {
        //         items: [],
        //         isLoading: false,
        //     }
        // }

        let store=this._store();
        const {theme}=this.props;
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => "" + item.item.id}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={theme.themeColor}
                            colors={[theme.themeColor]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                            tintColor={theme.themeColor}
                        />
                    }
                    ListFooterComponent={()=>this.genIndicator()}
                    onEndReached={()=>{//列表滚动到底部会回调此方法
                        console.log('--onEndReached ')
                        setTimeout(()=>{
                            if(this.canLoadMore){
                                this.loadData(true);
                                this.canLoadMore=false;
                            }
                        },100);

                    }}
                    onEndReachedThreshold={0.5}//比值
                    onMomentumScrollBegin={()=>{
                        this.canLoadMore=true;
                        console.log('--onMomentumScrollBegin ')
                    }}

                />
                <Toast ref={'toast'}
                       position={'center'}/>
            </View>
        );
    }
}

const mapStateToProps=state=>({
    popular:state.popular
});
const mapDispatchToProps=dispatch=>({
    onRefreshPopular: (storeName,url,pageSize,favoriteDao)=>dispatch(actions.onRefreshPopular(storeName,url,pageSize,favoriteDao)),
    onLoadMorePopular: (storeName,pageIndex,pageSize,items,favoriteDao,callBack)=>(actions.onLoadMorePopular(storeName,pageIndex,pageSize,items,favoriteDao,callBack)),
    onFlushPopularFavorite: (storeName,pageIndex,pageSize,items,favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName,pageIndex,pageSize,items,favoriteDao))
});

const PopularTabTabPage=connect(mapStateToProps,mapDispatchToProps)(PopularTab)



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
