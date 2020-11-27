import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View,TextInput,ScrollView,AsyncStorage} from 'react-native';

const ASYNC_SAVE_KEY = 'async_save_key'
export default class AsyncStorageDemoPage extends Component<Props> {

    constructor(props) {
        super(props)
        this.state = {
            showText: ''
        }
    }

    doSave() {
        AsyncStorage.setItem(ASYNC_SAVE_KEY,this.searchKey,error => {
            error && console.log(error.toString())
        })
    }

    doDelete() {
        AsyncStorage.removeItem(ASYNC_SAVE_KEY)
    }

    doGet() {
        AsyncStorage.getItem(ASYNC_SAVE_KEY,(error,value) => {
            this.setState({
                showText: value
            })
            error && console.log()
        }).catch(error => {
            console.log(error.toString())
        })
    }

    render() {
        return (
            <View>
                <View style={{flexDirection:'row'}}>
                    <TextInput
                        style={{height:40,borderWidth:1,borderColor:'black',borderRadius:5,flex:1}}
                        onChangeText={text => {
                            this.searchKey = text;
                        }}
                    />
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text onPress={() => {
                        this.doSave()
                    }}>存储</Text>
                    <Text onPress={() => {
                        this.doDelete()
                    }}>删除</Text>
                    <Text onPress={() => {
                        this.doGet()
                    }}>获取</Text>
                </View>

                <Text>
                    {this.state.showText}
                </Text>
            </View>
        );
    }
}

