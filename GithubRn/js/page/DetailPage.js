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
    View,TouchableOpacity,WebView
} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import ViewUtil from "../util/ViewUtil";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationUtil from "../navigator/NavigationUtil";
import BackPressComponent from "../common/BackPressComponent";
import FavoriteDao from "../expand/dao/FavoriteDao";
import SafeAreaViewPlus from "../common/SafeAreaViewPlus";

const TRENDING_URL = 'https://github.com/'

type Props = {};
const THEME_COLOR='#678'
export default class DetailPage extends Component<Props> {

    constructor(props) {
        super(props);
        this.params=this.props.navigation.state.params;
        const {projectModel,flag,theme}=this.params;
        this.favoriteDao=new FavoriteDao(flag);
        this.url=projectModel.item.html_url||TRENDING_URL+projectModel.item.fullName;
        const title=projectModel.item.full_name||projectModel.item.fullName;

        // if(!projectModel.item.html_url){
        //     // this.url=this.url.split("\"")[0];
        //     // const len=this.url.split("/")[4].length;
        //     // console.log("fffpzf"+",长度:"+len)
        //    const urls=this.url.split("\/");
        //     // console.log("fffpzf","leng:"+urls.length);
        //   urls.forEach((item,index)=>{
        //
        //       console.log("fffpzf"+"结果:"+item+",index:"+index);
        //   })
        //     // this.url=this.url.substring(0,len);
        // }
        if(!projectModel.item.html_url){
            // this.url=this.url.split("\/")[this.url.split("\/").length-1];
            // console.log("fffpzf"+"结果:"+this.url);
            // // const len=this.url.split("/")[4].length;
            // // console.log("fffpzf"+",长度:"+len)
            const urls=this.url.split("\/");
            // // console.log("fffpzf","leng:"+urls.length);
            let needUrl="";
            urls.forEach((item,index)=>{

                console.log("fffpzf"+"结果:"+item+",index:"+index);
                if(index<=4){
                    if(index==0){
                        needUrl=needUrl+item;
                    }else{
                        needUrl=needUrl+"/"+item;
                    }

                }
            })
            if(!needUrl.empty){
                this.url=needUrl;
            }

            // console.log("fffpzf"+",needUrl:"+needUrl)
            // this.url=this.url.substring(0,len);
        }

        console.log("fffpzf"+this.url);
        // console.log("fffpzf"+title)
        this.state={
            title:title,
            url:this.url,
            canGoBack:false,
            isFavorite:projectModel.isFavorite
        }
        this.backPress=new BackPressComponent({backPress:()=>this.onBackPress()})

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
    onFavoriteButtonClick(){
        const {projectModel,callback}=this.params;
        const isFavorite=projectModel.isFavorite=!projectModel.isFavorite;
        callback(isFavorite);
        this.setState({
            isFavorite:isFavorite,
        });
        let key=projectModel.item.fullName?projectModel.item.fullName:projectModel.item.id.toString();
        if(projectModel.isFavorite){
            this.favoriteDao.saveFavoriteItem(key,JSON.stringify(projectModel.item))
        }else{
            this.favoriteDao.removeFavoriteItem(key);
        }


    }
    renderRightButton() {
        return <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={()=>{
                this.onFavoriteButtonClick()
            }}>
                {/*收藏按钮*/}
                <FontAwesome
                    name={this.state.isFavorite?'star':'star-o'}
                    size={20}
                    style={{color: 'white', marginRight: 10}}
                />
                {/*分享按钮*/}
                {ViewUtil.getShareButton(() => {
                    // 分享按钮点击回调
                })}
            </TouchableOpacity>
        </View>
    }
    onNavigationStateChange(navState){
        this.setState({
            canGoBack:navState.canGoBack,
            url:navState.url,
        })
    }
    render() {
        const {theme}=this.params;
        const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null;
        let navigationBar=<NavigationBar
            leftButton={ViewUtil.getLeftBackButton(()=>this.onBack())}
            title={this.state.title }
            titleLayoutStyle={titleLayoutStyle}
            style={theme.styles.navBar}
            rightButton={this.renderRightButton()}
        />
        return (
           <SafeAreaViewPlus
           topColor={theme.themeColor}
           >
                {navigationBar}
                <WebView
                    ref={webView=>this.webView=webView}
                    startInLoadingState={true}
                    onNavigationStateChange={e=>this.onNavigationStateChange(e)}
                    source={{uri:this.state.url}}
                />
               </SafeAreaViewPlus>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
