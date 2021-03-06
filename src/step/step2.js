/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
	Easing,
	Linking,
	AsyncStorage,
	NativeModules,
  TouchableOpacity
} from 'react-native'
import {
  Container,
  Text,
  Button,
  View,
  Icon
} from 'native-base'
import Voice from 'react-native-voice';
const RNSettings = NativeModules.RNSettings

export default class Step2 extends Component {
  constructor() {
    super()
    this.state = {
      fadeAnim : new Animated.Value(0),
      buttonAnim : new Animated.Value(0),
	  textPartial : '',
	  marginButtonNext : new Animated.Value(10),
	  opacityButtonNext : new Animated.Value(0),
	  voiceButton : new Animated.Value(0),
	  textRecog : '',
	  started : false,
	  selesai : false,
	  opacityScaleBG : 0,
	  scaleBackground : {
		  left : new Animated.Value(0),
		  bottom : new Animated.Value(0),
		  top : new Animated.Value(0),
		  right : new Animated.Value(0)
	  }
    }

    Voice.onSpeechStart = this.onSpeechStart.bind(this)
    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
    Voice.onSpeechStart = this.onSpeechStart.bind(this)
    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
    Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this)

	this.AnimatedVoice = Animated.timing(
		this.state.voiceButton,
		{
			toValue : 20,
			easing: Easing.back(),
			duration : 1000
		}
	)

	this.animateVoice = Animated.loop(
		Animated.sequence([
			this.AnimatedVoice,
			Animated.timing(this.state.voiceButton, {toValue : 0, duration : 1000})
		])
	)
  }

	onSpeechEndHandler(e) {
		this.setState({
			started : false,
			textPartial : ''
		})
		this.successTest()

		this.animateVoice.stop(() => {
			alert('Kembali ke awal')
		})
	}

	onSpeechStart(e) {
		this.setState({
			started : true
		})
	}

	onStartButtonPress(e) {
		this.setState({
			textPartial : ''
		})
		Voice.start('id-ID');
		this.animateVoice.start()
	}

	async _stopRecognizing(e) {
		try {
		await Voice.stop();
		} catch (e) {
		console.error(e);
		}
	}

	onSpeechPartialResults(e) {
		this.setState({
			textPartial : e.value[0]
		})
		this.animateVoice.start()
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
  
  componentDidMount() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue : 1,
        duration : 1000
      }
    ).start(() => {
		this.successTest()
    })
  }

  openGoogleTalkBack() {
		RNSettings.openAccessBility()
	}

  pindahMenu() {
		const {navigate} = this.props.navigation
		navigate('HomeApp')
		// AsyncStorage.setItem('setup', 'true', (err) => {
		// 	if (!err) {
		// 		navigate('HomeApp')
		// 	} else {
		// 		alert('Terjadi Kesalahan')
		// 	}
		// })
  }

  successTest() {
	Animated.sequence([
		Animated.timing(this.state.opacityButtonNext, {
			toValue : 1,
			duration : 500
		}),
		Animated.timing(this.state.marginButtonNext, {
			toValue : 50,
			duration : 1000
		})
	]).start()
  }

  renderButtonTest() {
    return (
      <TouchableOpacity style={{marginTop : 20, marginBottom : 20}} onPress={this.onStartButtonPress.bind(this)}>
		<Animated.View style={{borderRadius : 100, borderWidth : this.state.voiceButton, borderColor : '#FFF', justifyContent : 'center', alignItems : 'center'}}>
			<View style={{width : 100, height : 100, borderRadius : 100, backgroundColor : '#FFF', justifyContent : 'center', alignItems : 'center'}}>
				{/* <Icon name={this.state.started == false ? "keyboard-voice" : "settings-voice"} type="MaterialIcons" style={{color : '#007B70', fontSize : 50}}/> */}
				<Text>Aktifkan Mantra</Text>
			</View>
		</Animated.View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Container style={styles.container}>
        <Animated.View style={{opacity : this.state.fadeAnim, alignItems : 'center', justifyContent : 'center'}}>
          <Text style={{color : '#FFF', fontWeight : 'bold', fontSize : 20, fontFamily : 'Roboto-Medium'}} uppercase>2. REVOLUSI TULIS BACA</Text>
          <Text style={{color : '#FFF', fontSize : 10, fontFamily : 'Roboto-Black', textAlign : 'center'}} uppercase>MANTRA - Memampukan Penyandang Tunanetra</Text>

          {/* {this.renderButtonTest()} */}
				  <Text style={{color : '#FFF', textAlign : 'center'}} uppercase>{this.state.textRecog} {this.state.textPartial}</Text>
				</Animated.View>
				<Animated.View style={{marginTop : this.state.marginButtonNext, opacity : this.state.opacityButtonNext, justifyContent : 'center', alignItems : 'center', flexWrap: 'wrap',}}>
					<View style={{justifyContent : 'center', alignItems : 'center', alignContent : 'center'}}>
						<TouchableOpacity style={{borderColor : '#FFF', marginBottom : 20, padding : 20, paddingLeft : 30, paddingRight : 30, borderWidth : 1, borderRadius : 50}} onPress={this.pindahMenu.bind(this)} accessibilityLabel="MENUJU KE HALAMAN UTAMA MENEMU BALING">
							<Text style={{color : '#FFF', fontSize : 13}}>MENEMU BALING</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{borderColor : '#FFF', marginBottom : 20, paddingLeft : 30, paddingRight : 30, borderWidth : 1, borderRadius : 50, padding : 20}} onPress={this.openGoogleTalkBack.bind(this)} accessibilityLabel="MANTRA - Memampukan Penyandang Tunanetra. Pastikan Android Anda sudah terinstal Google Talkback">
							<Text style={{color : '#FFF', fontSize : 12}}>MANTRA MENEMU BALING</Text>
						</TouchableOpacity>
						<Text style={{color : '#FFF', textAlign : 'center', fontSize : 10, fontStyle : 'italic'}}>Memampukan Tunanetra Menulis dengan Mulut dan Membaca dengan Telinga</Text>
					</View>
				</Animated.View>
      </Container>
    )
  }
}


const styles = StyleSheet.create({
  container : {
    backgroundColor : '#007B70', justifyContent : 'center', alignItems : 'center'    
  }
})
