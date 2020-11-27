import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    Image
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import BaseItem from "./BaseItem";

export default class TrendingItem extends BaseItem {
    render() {
        // const {projectModel} = this.props;
        console.log('fffpzf',"props:"+this.props.toString())
        const {projectModel} = this.props;
        const {item}=projectModel;
        if (!item) return null;

        let length= item.fullName.indexOf(' ');

        return (
            <TouchableOpacity onPress={()=>this.onItemClick()}>
                <View style={styles.cell_container}>
                    <Text style={styles.title}>
                        {
                            item.fullName.substr(0,length)
                        }
                    </Text>
                    <Text style={styles.description}>
                        {item.description}
                    </Text>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Text>Author:</Text>
                            {item.contributors.map((result,i,arr)=>{
                              return  <Image
                                  key={i}
                                  style={{height: 22, width: 22,margin:2}}
                                       source={{uri: arr[i]}}/>
                            })}

                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text>Start:</Text>
                            <Text>{item.starCount}</Text>
                        </View>
                        {/*{this._favoriteIcon()}*/}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    cell_container: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121',
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575',
    }
})
