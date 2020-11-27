import { combineReducers } from 'redux'
import theme from './theme'
import popular from './popular'
import trending from './trending'
import favorite from './favorite'
import language from './language'
import {rootCom,RootNavigator} from "../navigator/AppNavigator";

/**
 * 1 指定默认state
 */
const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom))
/**
 * 创建自己的navigation reducer
 */
const navReducer = (state = navState,action) => {
    const nextState = RootNavigator.router.getStateForAction(action,state);
    //如果nextState为null或未定义, 则返回原始state
    return nextState || state
}
/**
 * 合并
 * @type {Reducer<unknown>}
 */
const index = combineReducers({
    nav: navReducer,
    theme: theme,
    popular:popular,
    trending:trending,
    favorite:favorite,
    language:language,
})

export default index;

// import {combineReducers} from 'redux'
// import theme from './theme'
// import {rootCom,RootNavigator} from "../navigator/AppNavigator";
//
// //1.指定默认state
// const navState =RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom));
//
// //2.创建navigation reducer
// const navReducer=(state=navState,action) => {
//     const nextState=RootNavigator.router.getStateForAction(action, this.state);
//     return nextState||state;
// }
//
// //3.合并reducer
// // const index =combineReducers({
// //     nav:navReducer,
// //     theme:theme,
// // });
//
// const index = combineReducers({
//     nav: navReducer,
//     theme: theme,
// })
//
// export default index;