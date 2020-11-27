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
    ScrollView,
    Alert
} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index'
import {
    createMaterialTopTabNavigator,
} from 'react-navigation'
import NavigationUtil from "../navigator/NavigationUtil";
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import EventBus from 'react-native-event-bus'
import EventTypes from "../util/EventTypes";
import LanguageDao, {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import CheckBox from "react-native-check-box";
import Ionicons from 'react-native-vector-icons/Ionicons'
import GlobalStyles from "../res/GlobalStyles";

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
        'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});
import PopularItem from '../common/PopularItem'
import Toast from "react-native-easy-toast";
import NavigationBar from "../common/NavigationBar";
import ViewUtil from "../util/ViewUtil";
import ArrayUtil from "../util/ArrayUtil";

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
type Props = {};

class CustomKeyPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: e => this.onBackPress(e)})
        this.changeValues = [];
        this.isRemoveKey = !!this.params.isRemoveKey;
        this.languageDao = new LanguageDao(this.params.flag);
        this.state = {
            keys: []
        }
    }

    componentDidMount(): void {
        this.backPress.componentDidMount();
        //如果props中标签为空 则从本地存储中获取标签
        if (CustomKeyPage._keys(this.props).length === 0) {
            let {onLoadLanguage} = this.props;
            onLoadLanguage(this.params.flag)
        }
        this.setState({
            keys: CustomKeyPage._keys(this.props),
        })
    }

    componentWillUnmount(): void {
        this.backPress.componentWillUnmount();
    }

    static _keys(props, original, state) {
        const {flag, isRemoveKey} = props.navigation.state.params;
        let key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
        if (isRemoveKey && !original) {
            //移除标签并且不需要原始数据
            //这句话的意思是优先使用state里面的数据,如果state里面没有数据 则使用props
            return state && state.keys && state.keys.length !== 0
                && state.keys || props.language[key].map(val => {
                    return {
                        //注意: 不能直接修改props copy一份
                        ...val,
                        checked:false
                    }
                })
        } else {
            return props.language[key];
        }

    }

    onBack(){
        if(this.changeValues.length>0){
            Alert.alert('提示','要保存修改嘛?',
                [{
                    text:'否',onPress: () => {
                        NavigationUtil.goBack(this.props.navigation)
                    }
                },{
                    text:'是',onPress: () => {
                        this.onSave()
                    }
                }]
            )
        }else{
            NavigationUtil.goBack(this.props.navigation)
        }


    }
    onBackPress(e) {
        this.onBack();
        return true
    }
    //触发onLoadLanguage的action之后 会回调这个方法
    static getDerivedStateFromProps(nextProps,prevState) {
        //如果新老数据不相等
        if(prevState.keys !== CustomKeyPage._keys(nextProps,null,prevState)) {
            //则会将新的数据 同步到state里面去
            return {
                keys: CustomKeyPage._keys(nextProps,null,prevState)
            }
        }
        return null;
    }

    _genTabs() {
        const tabs = {};
        const {keys} = this.props;
        keys.forEach((item, index) => {
            if (item.checked) {
                tabs[`tab${index}`] = {
                    screen: props => <PopularTabTabPage {...props} tabLabel={item.name}/>,  //传递参数，重要
                    navigationOptions: {
                        title: item.name
                    }
                }
            }

        });
        return tabs;
    }
    renderView() {
        let dataArray = this.state.keys;
        if(!dataArray || dataArray.length === 0) return;
        let len = dataArray.length;
        let views = [];
        for(let i = 0, l = len; i < l; i+=2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {/*生成一行数据,每行显示两列*/}
                        {this.renderCheckBox(dataArray[i],i)}
                        {i + 1 < len && this.renderCheckBox(dataArray[i + 1], i+ 1)}

                    </View>
                    <View style={GlobalStyles.line}></View>
                </View>
            )
        }
        return views
    }
    _checkedImage(checked) {
        const { theme } = this.params;
        return <Ionicons
            name={checked ? 'ios-checkbox' : 'md-square-outline'}
            size={20}
            style={{color: THEME_COLOR}}
        />
    }
    onClick(data,index){
        data.checked=!data.checked;
        ArrayUtil.updateArray(this.changeValues,data);
        this.state.keys[index]=data;
        this.setState({
            keys:this.state.keys
        })
    }
    renderCheckBox(data,index) {
        return <CheckBox
            style={{flex: 1,padding:10}}
            onClick={() => this.onClick(data,index)}
            isChecked={data.checked}
            leftText={data.name}
            checkedImage={this._checkedImage(true)}
            unCheckedImage={this._checkedImage(false)}
        />
    }


    onSave(){
        if(this.changeValues.length === 0) {
            NavigationUtil.goBack(this.props.navigation)
            return
        }
        let keys;
        //移除标签的特殊处理
        if(this.isRemoveKey) {
            for(let i = 0,l = this.changeValues.length; i < l;i++) {
                ArrayUtil.remove(keys = CustomKeyPage._keys(this.props,true),this.changeValues[i],"name");
            }
        }

        this.languageDao.save(keys||this.state.keys);
        //刷新数据
        const { onLoadLanguage } = this.props;
        onLoadLanguage(this.params.flag)
        NavigationUtil.goBack(this.props.navigation)

    }

    render() {
        let title = this.isRemoveKey ? '标签移除' : '自定义标签';
        title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言': title
        let rightButtonTitle = this.isRemoveKey ? '移除' : '保存'
        let navigationBar = <NavigationBar
            title={title}
            leftButton={ViewUtil.getLeftBackButton(()=>this.onBack())}
            style={{backgroundColor: THEME_COLOR}}
            rightButton={ViewUtil.getRightButton(rightButtonTitle,()=>this.onSave())}
        />;
        return <View style={styles.container}>
            {navigationBar}
            <ScrollView>
                {this.renderView()}
            </ScrollView>
        </View>


    }


}


const mapPopularStateToProps = state => ({
    //订阅了一个keys将其映射在props上面, 那就是language 这个reducer的keys
    language: state.language
})
const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(CustomKeyPage)

const pageSize = 10;
const mapStateToProps = state => ({
    popular: state.popular
});
const mapDispatchToProps = dispatch => ({
    onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
    onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => (actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
    onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
});

const PopularTabTabPage = connect(mapStateToProps, mapDispatchToProps)(CustomKeyPage)


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
        minWidth: 50,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize: 13,
        marginTop: 6,
        marginBottom: 6
    },
    indicatorContainer: {
        alignItems: "center"
    },
    indicator: {
        color: 'red',
        margin: 10
    }
});
