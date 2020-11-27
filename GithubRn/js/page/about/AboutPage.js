import React, {Component} from 'react';
import {
    Button,
    Platform,
    StyleSheet,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    Linking
} from 'react-native';
import NavigationUtil from "../../navigator/NavigationUtil";
import {MORE_MENU} from "../../common/MORE_MENU";
import GlobalStyles from "../../res/GlobalStyles";
import AboutCommon, {FLAG_ABOUT} from "./AboutCommon";
import config from '../../res/data/config.json'
import ViewUtil from "../../util/ViewUtil";
import BackPressComponent from "../../common/BackPressComponent";


type Props = {};

const THEME_COLOR = '#678';

export default class AboutPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.params=this.props.navigation.state.params;
        this.aboutCommon=new AboutCommon({
            ...this.params,
            navigation:this.props.navigation,
            flagAbout:FLAG_ABOUT.flag_about,
        },data=>this.setState({...data}));

        this.state={
            data:config,//默认数据
        }
        this.backPress=new BackPressComponent({backPress:()=>this.onBackPress()})

    }


    onClick(menu) {
        let RouteName,params={};
        switch (menu) {
            case MORE_MENU.Tutorial:
                RouteName='WebViewPage';
                params.title='教程';
                params.url = 'https://www.baidu.com'
                break
            case MORE_MENU.Feedback:
                const url='mailto://pzfpang449@gmail.com';
                Linking.canOpenURL(url)
                    .then(support=>{
                        if(!support){
                            console.log("Cant handle url:"+url);
                        }else{
                            Linking.openURL(url);
                        }
                    }).catch(e=>{
                    console.error('An error occurred',e);
                });
                break
            case MORE_MENU.About_Author:
                RouteName = 'AboutMePage';
                break

        }
        if(RouteName){
            NavigationUtil.goPage(params,RouteName);
        }
    }

    getItem(menu) {
        return ViewUtil.getMenuItem(() => {
            this.onClick(menu)
        }, menu,THEME_COLOR)
    }

    render() {
        const content = <View>
            {/*{this.getItem(MORE_MENU.Tutorial)}*/}
            {/*<View style={GlobalStyles.line}/>*/}
            {/*{this.getItem(MORE_MENU.About_Author)}*/}
            {/*<View style={GlobalStyles.line}/>*/}
            {/*{this.getItem(MORE_MENU.Feedback)}*/}
        </View>
        return this.aboutCommon.render(content,this.state.data.app)
    }

    componentDidMount(){
        this.backPress.componentDidMount();
    }
    componentWillUnmount(){
        this.backPress.componentWillUnmount();
    }

    onBackPress(){
        this.onBack();
        return true;
    }


    onBack(){
        if(this.state.canGoBack){
            this.webView.goBack();
        }else{
            NavigationUtil.goBack(this.props.navigation)
        }

    }
}

