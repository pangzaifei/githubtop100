import {
    createStackNavigator, createMaterialTopTabNavigator, createBottomTabNavigator,
    createSwitchNavigator
} from 'react-navigation'
import WelcomePage from "../page/WelcomePage";
import HomePage from "../page/HomePage";
import FetchDemoPage from "../page/FetchDemoPage";
import DetailPage from "../page/DetailPage";
import {connect} from 'react-redux'
import DataStorageDemoPage from "../page/DataStorageDemoPage";
import {createReactNavigationReduxMiddleware, reduxifyNavigator} from 'react-navigation-redux-helpers'
export const rootCom='Init';
import WebViewPage from "../page/WebViewPage";
import AboutPage from "../page/about/AboutPage";
// import AboutMePage from "../page/about/AboutMePage";
import CustomKeyPage from "../page/CustomKeyPage";
import SortKeyPage from "../page/SortKeyPage";

const InitNavigator = createStackNavigator({
    WelcomePage: {
        screen: WelcomePage,
        navigationOptions: {
            header: null,//navigation全屏显示
        }
    }
});
const MainNavigator = createStackNavigator({
    HomePage: {
        screen: HomePage,
        navigationOptions: {
            header: null,
        }
    },
    DetailPage: {
        screen: DetailPage,
        navigationOptions: {
            header: null,
        }
    },
    WebViewPage: {
        screen: WebViewPage,
        navigationOptions: {
            header:null,
        }
    },
    AboutPage: {
        screen: AboutPage,
        navigationOptions: {
            header:null,
        }
    },
    // AboutMePage:{//添加关于我的导航
    //     screen: AboutMePage,
    //     navigationOptions: {
    //         header:null,
    //     }
    // },
    CustomKeyPage:{//添加关于我的导航
        screen: CustomKeyPage,
        navigationOptions: {
            header:null,
        }
    },
    SortKeyPage:{//
        screen: SortKeyPage,
        navigationOptions: {
            header:null,
        }
    }

});

export const RootNavigator = createSwitchNavigator({
    Init: InitNavigator,
    Main: MainNavigator,

}, {
    navigationOptions: {
        header: null,
    }
})

export const middleware = createReactNavigationReduxMiddleware(
    'root',
    state => state.nav
)

const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');
const mapStateToProps = state => ({
    state: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
