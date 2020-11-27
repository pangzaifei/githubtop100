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
    ActivityIndicator,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index'
import {
    createMaterialTopTabNavigator,
} from 'react-navigation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
        'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});
import TrendingItem from '../common/TrendingItem'
import Toast from "react-native-easy-toast";
import NavigationBar from "../common/NavigationBar";
import TrendingDialog,{TimeSpans} from "../common/TrendingDialog";
import TimeSpan from "../model/TimeSpans";

const URL='https://github.com/trending/';
const QUERY_STR='&sort=stars'
const THEME_COLOR='#678';
const EVENT_TYPE_TIME_CHANGE='EVENT_TYPE_TIME_CHANGE';
type Props = {};
class TrendingPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.state={
            timeSpan:TimeSpans[0],
        }
        const { onLoadLanguage } = this.props
        onLoadLanguage(FLAG_LANGUAGE.flag_language)
        //保存上一个key
        this.preKeys=[];

    }
    _genTabs(){
        const tabs={};
        const {keys,theme}=this.props;
        this.preKeys=keys;
        keys.forEach((item,index)=>{
            if(item.checked){
                tabs[`tab${index}`]={
                    screen:props=><TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item.name} theme={theme}/>,  //传递参数，重要
                    navigationOptions:{
                        title:item.name
                    }
                }
            }

        });
        return tabs;
    }

    renderTitleView(){
        return <View>
            <TouchableOpacity underlayColor='transparent'
            onPress={()=>this.dialog.show()}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{
                        fontSize:18,
                        color:'#FFFFFF',
                        fontWeight:'400'
                    }}>趋势{this.state.timeSpan.showText}</Text>
                    <MaterialIcons
                        name={'arrow-drop-down'}
                        size={22}
                        style={{color:'white'}}
                    />
                </View>


            </TouchableOpacity>
        </View>
    }
    onSelectTimesSpan(tab){
        this.dialog.dismiss();
        this.setState({
            timeSpan:tab
        })
        //发送事件
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_CHANGE,tab);
    }

    renderTrendingDialog(){
        return <TrendingDialog
            ref={dialog=>this.dialog=dialog}
            onSelect={tab=>this.onSelectTimesSpan(tab)}
        />
    }
    _tabNav(){
        if(!this.tabNav||ArrayUtil.isEqual(this.preKeys,this.props.keys)){
            this.tabNav=createMaterialTopTabNavigator(
                this._genTabs(),{
                    tabBarOptions:{
                        tabStyle:styles.tabStyle,
                        upperCaseLabel:false,
                        scrollEnabled:true,
                        style:{
                            backgroundColor: '#678'//设置topbar背景色
                        },
                        indicatorStyle:styles.indicatorStyle,//标签指示器样式
                        labelStyle:styles.labelStyle,//文字的样式
                    },
                    lazy:true
                }
            )
        }
        return this.tabNav;

    }

    render() {
        const {keys}=this.props;
        let statusBar={
            backgroundColor:THEME_COLOR,
            barStyle:'light-content',
        };
        let navigationBar=<NavigationBar
            titleView={this.renderTitleView()}
            statusBar={statusBar}
            style={{backgroundColor:THEME_COLOR}}
        />

        const TabNavigator=keys.length?this._tabNav():null;

        return <View style={styles.container}>
            {navigationBar}
            {TabNavigator&&<TabNavigator/>}
            {this.renderTrendingDialog()}
        </View>
    }
}
import NavigationUtil from "../navigator/NavigationUtil";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import ArrayUtil from "../util/ArrayUtil";

const mapTrendingStateToProps = state => ({
    keys: state.language.languages
});
const mapTrendingDispatchToProps = dispatch => ({
    onLoadLanguage: flag => dispatch(actions.onLoadLanguage(flag))
})
export default connect(mapTrendingStateToProps,mapTrendingDispatchToProps)(TrendingPage)


const pageSize=99;
class TrendingTab extends Component<Props> {
    constructor(props) {
        super(props);
        const {tabLabel,timeSpan} = this.props;
        this.storeName = tabLabel;
        this.timeSpan=timeSpan;
    }

    componentDidMount() {
        this.loadData();
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_CHANGE,(timeSpan) => {
            this.timeSpan = timeSpan;
            this.loadData();
        })

    }
    componentWillUnmount() {
        if(this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove()
        }
    }

    loadData(loadMore) {
        const {onRefreshTrending,onLoadMoreTrending} = this.props;
        const store=this._store();
        const url = this.genFetchUrl(this.storeName);
        if(loadMore){
            onLoadMoreTrending(this.storeName, ++store.pageIndex,pageSize,store.items,callback=>{
                this.refs.toast.show('没有更多了')
            });
        }else{
            onRefreshTrending(this.storeName, url,pageSize);
        }

    }

    /**
     * 获取与当前页面有关的数据
     * @private
     */
    _store(){
        const {trending}=this.props;
        let store=trending[this.storeName];
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
        return URL + key +'?'+ this.timeSpan.searchText;
    }

    renderItem(data) {
        const {theme}=this.props;
        const item = data.item;
        console.log('fffpzf',"a111_item:"+item.toString());
        return <TrendingItem
            projectModel={item}
            theme={theme}
            onSelect={(callback) => {
                NavigationUtil.goPage({
                    theme,
                    projectModel:item,
                    flag:FLAG_STORAGE.flag_trending,
                    callback,

                },'DetailPage')

            }}
        />
        // return <View></View>
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
                            onRefresh={() => this.loadData()}
                            tintColor={THEME_COLOR}
                        />
                    }
                    ListFooterComponent={()=>this.genIndicator()}
                    onEndReached={()=>{//列表滚动到底部会回调此方法
                        console.log('--onEndReached ')
                        setTimeout(()=>{
                            if(this.canLoadMore){
                                console.log('--去加载更多 ')
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
    trending:state.trending,
    theme:state.theme.theme,
});
const mapDispatchToProps=dispatch=>({
    onRefreshTrending: (storeName,url,pageSize)=>dispatch(actions.onRefreshTrending(storeName,url,pageSize)),
    onLoadMoreTrending: (storeName,pageIndex,pageSize,items,callBack)=>(actions.onLoadMoreTrending(storeName,pageIndex,pageSize,items,callBack))

});

const TrendingTabPage=connect(mapStateToProps,mapDispatchToProps)(TrendingTab)



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
