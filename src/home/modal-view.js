import React, {Component} from 'react'
import {
	Modal,
	View,
	TouchableHighlight,
	ToastAndroid,
	StyleSheet,
	ScrollView
} from 'react-native'
import { Text, Container, Header, Left, Button, Icon, Content } from "native-base";

import {speak, lang, tts} from '../services/speak'
import HTMLView from 'react-native-htmlview';
import HtmlView from 'react-native-htmlview';
import Footer from '../../native-base-theme/components/Footer';
import Body from '../../native-base-theme/components/Body';
import firebase from 'react-native-firebase';

// ADMOB
const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest()
request.addKeyword('education')

export default class ModalView extends Component {
	constructor(props) {
		super(props)
		this.state = {
			modalVisible : false,
			content : [],
			speaking : false,
			speakJudul : false,
			counterPart : 0,
			repeat : false
		}

		tts.addEventListener('tts-start', this._ttsStart.bind(this))
		tts.addEventListener('tts-finish', this._ttsFinish.bind(this))
		tts.addEventListener('tts-cancel', this._ttsCancel.bind(this))

		this.contentForRead = []
	}

	componentDidMount() {
		lang()
	}
	// TEXT TO SPEACH EVENT
	_ttsStart(e) {
		this.setState({
			speaking : true
		})
		ToastAndroid.show('Memulai Membaca Document', ToastAndroid.CENTER)
	}
	_ttsFinish(e) {
		if (this.state.speakJudul) {
			this.setState({
				speakJudul : false,
				speaking : false
			}, () => {
				let content = this.props.content.split("<br>")
				if (content[this.state.counterPart] != '' && content[this.state.counterPart] != null) {
					this.speakNow(content[this.state.counterPart])
				} else {
					ToastAndroid.show('Selesai Membaca Document', ToastAndroid.CENTER)
				}
			})
		} else {
			let c = !this.state.repeat ? this.state.counterPart + 1 : this.state.counterPart
			this.setState({
				counterPart : c,
				speaking : false
			}, () => {
				// alert(this.state.content)
				// let content = this.props.content.split("<br>")
				// if (content[this.state.counterPart] != '' && content[this.state.counterPart] != null) {
				if (this.contentForRead[this.state.counterPart] != null) {
					this.speakNow(this.contentForRead[this.state.counterPart])
				} else {
					// alert('SELESAI GAES' + this.state.counterPart + " " + this.contentForRead[this.state.counterPart])
					ToastAndroid.show('Selesai Membaca Document', ToastAndroid.CENTER)
				}
			})
		}
	}
	_ttsCancel(e) {
		this.setState({
			speaking : false
		})
		ToastAndroid.show('Membaca Document Dibatalkan', ToastAndroid.CENTER)		
	}
	
	speakNow(contents) {
		// alert(this.state.speaking)
		if (this.state.speaking) {
			tts.stop()
		} else {
			if (this.state.speakJudul) {
				if (this.props.titleDoc) {
					speak(this.props.titleDoc)
				}
			} else {
				if (contents) {
					if (!contents.match("<img")) {
						let regex = /(<([^>]+)>)/ig
						let content = contents.replace(new RegExp('&nbsp;', 'gi'), ' ')
						let content2 = content.toString().replace(regex, '')
						speak(content2)
					} else {
						speak('Gambar')
						// alert(contents)
					}
				} else {
					this._ttsFinish()
				}
			}
		}
	}

	play(counter = 0, play) {
		// if (this.contentForRead.length == 0) {
			this.contentForRead = this.props.content.split("<br>")
		// }
		
		let contents = this.props.content
		let part = contents.split("<br>")
		const x = () => {
			tts.stop()
			this.setState({
				counterPart : counter,
				content : this.props.content,
				speakJudul : counter == 0
			}, () => {
				// tts.stop()
				this.speakNow(part[this.state.counterPart])
			})	
		}

		if (play != null) {
			// if (this.state.speaking) {
			// 	counter = this.state.counterPart
			// }
			// alert(counter)
			this.setState({
				speaking : play
			}, () => x())
		} else {
			x()
		}
	}

	renderListText() {
		let content = this.props.content.split("<br>")
		if (content.length > 0) {
			return (
				<View>
					{content.map((c, k1) => {
						if (!c.match("<img")) {
							let x = c.split(".")
							return (
								<View key={k1}>
									{
										x.map((x1, k2) => {
											return (
												<TouchableHighlight key={k2} underlayColor="#FDE3A7" onPress={() => this.play(k1)} style={{backgroundColor : (this.state.counterPart == k1 && this.state.speaking && !this.state.speakJudul) ? '#FDE3A7' : '#FFF'}}>
													<HtmlView value={x1}/>
												</TouchableHighlight>
											)
										})
									}
								</View>
							)
						} else {
							return (
								<TouchableHighlight key={k1} underlayColor="#FDE3A7" onPress={() => this.play(k1)} style={{backgroundColor : (this.state.counterPart == k1 && this.state.speaking && !this.state.speakJudul) ? '#FDE3A7' : '#FFF'}}>
									<HtmlView value={c}/>
								</TouchableHighlight>
							)
						}
					})}
				</View>
			)
		} else {
			return null
		}
	}
	
	renderAds() {
		return (
			<Banner
				unitId="ca-app-pub-8212267677070874/3286142813"
				request={request.build()}
				onAdLoaded={() => {
					console.log("Ad Loaded")
				}}
			/>
		)
	}
	footerRender() {
		return (
			<View style={{height : 70, position : 'absolute', bottom : 0, right : 0, left : 0, justifyContent : 'center'}}>
				<Container>
					<View style={{flex : 1, flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
						<Button ref={ref => this.btnClose = ref} style={styles.btnControl} onPress={() => {
							this.props.closeModal();
							tts.stop()
						}} success accessibilityLabel="Tutup Baling">
							<Icon name="ios-close-circle-outline"/>
						</Button>
						<Button style={styles.btnControl} onPress={() => this.play(this.state.counterPart - 1, false)} success accessibilityLabel="Membaca Kalimat Sebelumnya">
							<Icon name="ios-arrow-dropleft-outline" type="Ionicons"/>
						</Button>
						<Button style={styles.btnControl} onPress={() => this.play()} success accessibilityLabel="Berhenti atau Mulai Membaca Dengan Telinga">
							<Icon name={this.state.speaking ? "ios-pause-outline" : "ios-play-outline"} type="Ionicons"/>
						</Button>
						<Button style={styles.btnControl} onPress={() => this.play(this.state.counterPart + 1, false)} success accessibilityLabel="Membaca Kalimat Selanjutnya">
							<Icon name="ios-arrow-dropright-outline" type="Ionicons"/>
						</Button>
						<Button style={styles.btnControl} onPress={() => {
							ToastAndroid.show('Mengulang Aktif', ToastAndroid.SHORT)
							this.setState({ repeat : !this.state.repeat })
						}} success accessibilityLabel="Mengulang">
							<Icon name={this.state.repeat ? "ios-more" : "repeat"} type="Ionicons"/>
						</Button>

					</View>
				</Container>
			</View>
		)
	}

	render() {
		return (
			<Modal
				animationType="slide"
				ref={"modalView"}
				transparent={false}
				visible={this.props.modalVisible}
				onRequestClose={() => {
					this.btnClose.props.onPress()
					tts.stop()
				}}>
				<View style={{padding : 20, flex : 1}}>
					<ScrollView>
						<TouchableHighlight
							onPress={() => {
								this.play(0)
							}}
							style={{backgroundColor : (this.state.counterPart == 0 && this.state.speaking && this.state.speakJudul) ? '#FDE3A7' : '#FFF'}}>
							<Text style={{marginBottom : 10, color : '#666', fontSize : 20}}>{this.props.titleDoc}</Text>
						</TouchableHighlight>
						<View style={{height : 1, marginBottom : 10, backgroundColor : '#CCC', flex : 1}}/>
						{this.renderAds()}
						{this.renderListText()}
						{this.renderAds()}
					</ScrollView>
					{
						this.footerRender()
					}
				</View>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	btnControl : {
		marginRight : 10
	}
})