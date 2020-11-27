/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Button,
    Platform,
    StyleSheet,
    Text,
    View,
    TextInput
} from 'react-native';
import actions from "../action";

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
        'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

type Props = {};
export default class FetchDemoPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            showText: ''
        }
    }

    loadData() {
        //https://api.github.com/search/repositories?q=java
        let url = 'https://api.github.com/search/repositories?q=${this.searchKey}'
        console.log("url", this.searchKey);
        fetch(url)
            .then(response => response.text())
            .then(responseText => {
                showText:responseText;
            })
    }

    loadData2() {
        //https://api.github.com/search/repositories?q=java
        let url = 'https://api.github.com/search/repositories?q=${this.searchKey}'
        console.log("url", this.searchKey);
        fetch(url)
            .then(response =>{
                if(response.ok){
                    return response.text();
                }
                throw new Error('Network response was not ok.');
            })
            .then(responseText => {
                showText:responseText;
            })
            .catch(e=>{
                showText:e.toString();
            })
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>FetchDemoPage</Text>
                <View style={styles.input_container}>
                    <TextInput style={styles.input}
                               onChangeText={text => {
                                   this.searchKey = text;

                               }}
                    />
                    <Button
                        title={"获取"}
                        onPress={() => {
                            this.loadData();
                        }}
                    />

                    <Text>
                        {this.state.showText}
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    input: {
        height: 30,
        flex: 1,
        borderColor: 'black',
        borderWidth: 1,
        marginRight: 10
    },input_container: {
        flexDirection:'row',
        alignItems: 'center'
    }
});
