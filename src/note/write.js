/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Input,
  Button
} from 'react-native';
import Voice from 'react-native-voice';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      started : '',
      textRecog : '',
      textPartial : ''
    }

    Voice.onSpeechStart = this.onSpeechStart.bind(this)
    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
    Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this)
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this)
  }

  onSpeechEndHandler(e) {
    this.setState({
      started : '',
      textPartial : ''
    })
  }

  onSpeechStart(e) {
    this.setState({
      started : 'ok'
    })
  }

  onStartButtonPress(e) {
    this.setState({
      textPartial : ''
    })
    Voice.start('id-ID');
  }

  async _stopRecognizing(e) {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  onSpeechResultsHandler(e) {
    let before = this.state.textRecog
    console.log(e)
    this.setState({
      textRecog : before + ' ' + e.value[0],
      textPartial : ''
    })
    // alert(JSON.stringify(e))
  }

  onSpeechRecognized(e) {
    alert(JSON.stringify(e))
  }

  onSpeechPartialResults(e) {
    this.setState({
      textPartial : e.value[0]
    })
  }

  componentDidMount() {
    this.onStartButtonPress()
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text>{this.state.textRecog} {this.state.textPartial}</Text>
        <Text style={styles.instructions}>
          Apakah Sudah Di Mulai : {this.state.started}
        </Text>
        <Button onPress={this.onStartButtonPress.bind(this)} title="Mulai Menulis"/>
        <Button onPress={this._stopRecognizing.bind(this)} title="Mulai Menulis"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
