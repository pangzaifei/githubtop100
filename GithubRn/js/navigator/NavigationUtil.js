export default class NavigationUtil {
    static resetToHomePage(params){
        const {navigation}=params;
        navigation.navigate("Main");
    }

    /**
     * 返回上一页
     * @param navigation
     */
    static goBack(navigation){
        navigation.goBack();
    }

    /**
     * 跳转指定页面
     */
    static goPage(params,page){
        // const {navigation}=params;
        const navigation=NavigationUtil.navigation;
        if(!navigation){
            console.log("NavigationUtil.navigation不能Wie空");
            return;
        }else{
            navigation.navigate(page,{...params})
        }
    }
}