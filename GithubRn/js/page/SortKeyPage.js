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
    Alert,
    TouchableHighlight
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
import SortableListView from 'react-native-sortable-listview'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


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

class SortKeyPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: e => this.onBackPress(e)})
        this.languageDao = new LanguageDao(this.params.flag);
        this.state = {
            checkedArray: SortKeyPage._keys(this.props),//初始化时从props中取出checkedArray
        }
    }

    componentDidMount(): void {
        this.backPress.componentDidMount();
        //如果props中标签为空 则从本地存储中获取标签
        if (SortKeyPage._keys(this.props).length === 0) {
            let {onLoadLanguage} = this.props;
            onLoadLanguage(this.params.flag)
        }
    }

    componentWillUnmount(): void {
        this.backPress.componentWillUnmount();
    }

    // static _keys(props,state) {
    //     //如果state里面有checkedArray 则使用state
    //     if(state&&state.checkedArray&&state.checkedArray.length) {
    //         return state.checkedArray
    //     }
    //     //否则从原始数据中获取checkedArray
    //     const flag = SortKeyPage._flag(props);
    //     let dataArray = props.language[flag] || [];
    //     let keys = [];
    //     for(let i = 0, j = dataArray.length; i < j; i++) {
    //         let data = dataArray[i];
    //         if(data.checked) {
    //             keys.push(data)
    //         }
    //     }
    //     return keys
    // }

    static _keys(props,state) {
        //如果state里面有checkedArray 则使用state
        if(state&&state.checkedArray&&state.checkedArray.length) {
            return state.checkedArray
        }
        //否则从原始数据中获取checkedArray
        const flag = SortKeyPage._flag(props);
        let dataArray = props.language[flag] || [];
        let keys = [];
        for(let i = 0, j = dataArray.length; i < j; i++) {
            let data = dataArray[i];
            if(data&&data.checked) {
                keys.push(data)
            }
        }
        return keys
    }
    static _flag(props) {
        const {flag} = props.navigation.state.params;
        return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages'
    }
    // static _flag(props) {
    //     const {flag} = props.navigation.state.params;
    //     return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages'
    //     let dataArray=props.language[flag]||[];
    //     let keys=[];
    //     for(let i = 0, j = dataArray.length; i < j; i++) {
    //         let data = dataArray[i];
    //         if(data.checked) {
    //             keys.push(data)
    //         }
    //     }
    //     return keys
    // }

    onBack(){
        if(!ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
            Alert.alert('提示','要保存修改嘛?',
                [{
                    text:'否',onPress: () => {
                        NavigationUtil.goBack(this.props.navigation)
                    }
                },{
                    text:'是',onPress: () => {
                        this.onSave(true)
                    }
                }]
            )
        }else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }
    onBackPress(e) {
        this.onBack();
        return true
    }
    //触发onLoadLanguage的action之后 会回调这个方法
    static getDerivedStateFromProps(nextProps,prevState) {
        const checkedArray=SortKeyPage._keys(nextProps,null,prevState);
        //如果新老数据不相等
        if(prevState.keys !== checkedArray) {
            //则会将新的数据 同步到state里面去
            return {
                keys: checkedArray
            }
        }
        return null;
    }
    onSave(hasChecked){
        if(!hasChecked) {
            //如果没有排序则直接返回
            if(ArrayUtil.isEqual(SortKeyPage._keys(this.props),this.state.checkedArray)) {
                NavigationUtil.goBack(this.props.navigation)
                return
            }
        }

        //刷新数据
        this.languageDao.save(this.getSortResult());
        const { onLoadLanguage } = this.props;
        onLoadLanguage(this.params.flag)
        NavigationUtil.goBack(this.props.navigation)

    }

    getSortResult() {
        const flag = SortKeyPage._flag(this.props);
        //从原始数据中复制一份数据出来,以便对这份数据进行排序
        let sortResultArray = ArrayUtil.clone(this.props.language[flag])
        //获取排序之前的排列顺序
        const originalCheckedArray = SortKeyPage._keys(this.props);
        //遍历排序之前的数据, 用排序之后的数据checkedArray替换
        for(let i = 0, j = originalCheckedArray.length; i < j;i++) {
            let item = originalCheckedArray[i];
            //找到要替换的元素所在位置
            let index = this.props.language[flag].indexOf(item)
            //进行替换
            sortResultArray.splice(index,1,this.state.checkedArray[i])
        }
        return sortResultArray
    }



    render() {
        let title = this.params.flag === FLAG_LANGUAGE.flag_language ? '语言排序': '标签排序'
        let navigationBar = <NavigationBar
            title={title}
            leftButton={ViewUtil.getLeftBackButton(()=>this.onBack())}
            style={{backgroundColor: THEME_COLOR}}
            rightButton={ViewUtil.getRightButton('保存',()=>this.onSave())}
        />;
        return <View style={styles.container}>
            {navigationBar}
            <SortableListView
                style={{flex : 1}}
                data={this.state.checkedArray}
                order={Object.keys(this.state.checkedArray)}
                onRowMoved={e => {
                    this.state.checkedArray.splice(e.to,0,this.state.checkedArray.splice(e.from,1)[0])
                    this.forceUpdate()
                }}
                renderRow={row => <SortCell data={row} {...this.params}/>}
            />
        </View>
        // return <View></View>
    }
}
class SortCell extends Component {
    render() {
        return <TouchableHighlight
            underlayColor={'#eee'}
            style={this.props.data.checked ? styles.item : styles.hidden}
            {...this.props.sortHandlers}>
            <View style={{marginLeft: 10, flexDirection: 'row'}}>
                <MaterialCommunityIcons
                    name={'sort'}
                    size={16}
                    style={{marginRight: 10, color: THEME_COLOR}}/>
                <Text>{this.props.data.name}</Text>
            </View>
        </TouchableHighlight>
    }
}


const mapPopularStateToProps = state => ({
    //订阅了一个keys将其映射在props上面, 那就是language 这个reducer的keys
    language: state.language
})
const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(SortKeyPage)


const styles = StyleSheet.create({
    container: {
        flex:1
    },
    hidden: {
        height: 0
    },
    item: {
        backgroundColor: "#F8F8F8",
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 50,
        justifyContent: 'center'
    },
});
