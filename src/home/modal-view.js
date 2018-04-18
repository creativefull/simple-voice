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
				speakJudul : false
			}, () => {
				this.setState({
					speaking : false
				}, () => {
					let content = this.props.content.split(".")
					if (content[this.state.counterPart] != '' && content[this.state.counterPart] != null) {
						this.speakNow(content[this.state.counterPart])
					} else {
						ToastAndroid.show('Selesai Membaca Document', ToastAndroid.CENTER)
					}							
				})
			})
		} else {
			let c = !this.state.repeat ? this.state.counterPart + 1 : this.state.counterPart
			this.setState({
				counterPart : c,
				speaking : false
			}, () => {
				// alert(this.state.content)
				let content = this.props.content.split(".")
				if (content[this.state.counterPart] != '' && content[this.state.counterPart] != null) {
					this.speakNow(content[this.state.counterPart])
				} else {
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
		if (this.state.speaking) {
			tts.stop()
		} else {
			lang()
			if (this.state.speakJudul) {
				if (this.props.titleDoc) {
					speak(this.props.titleDoc)
				}
			} else {
				if (contents) {
					let regex = /(<([^>]+)>)/ig
					let content = contents.replace(new RegExp('&nbsp;', 'gi'), ' ')
					let content2 = content.toString().replace(regex, '')
					speak(content2)
				}
			}
		}
	}

	play(counter = 0, play = true) {
		let contents = this.props.content
		let part = contents.split(".")
		this.setState({
			counterPart : counter,
			content : this.props.content,
			speakJudul : counter == 0
		}, () => {
			// tts.stop()
			this.speakNow(part[this.state.counterPart])
		})
	}

	renderListText() {
		let content = this.props.content.split(".")
		if (content.length > 0) {
			return (
				<View>
					{content.map((c, k1) => {
						let x = c.split("<br>")
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
					})}
				</View>
			)
		} else {
			return null
		}
	}
	
	footerRender() {
		return (
			<View style={{height : 70, position : 'absolute', bottom : 0, right : 0, left : 0, justifyContent : 'center'}}>
				<Container>
					<View style={{flex : 1, flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
						<Button ref={ref => this.btnClose = ref} style={styles.btnControl} onPress={() => {
							this.props.closeModal();
							tts.stop()
						}} success>
							<Icon name="ios-close-circle-outline"/>
						</Button>
						<Button style={styles.btnControl} onPress={() => this.play(this.state.counterPart - 1)} success>
							<Icon name="ios-arrow-dropleft-outline" type="Ionicons"/>
						</Button>
						<Button style={styles.btnControl} onPress={() => this.play()} success>
							<Icon name={this.state.speaking ? "ios-pause-outline" : "ios-play-outline"} type="Ionicons"/>
						</Button>
						<Button style={styles.btnControl} onPress={() => this.play(this.state.counterPart + 1)} success>
							<Icon name="ios-arrow-dropright-outline" type="Ionicons"/>
						</Button>
						<Button style={styles.btnControl} onPress={() => {
							ToastAndroid.show('Mengulang Aktif', ToastAndroid.SHORT)
							this.setState({ repeat : !this.state.repeat })
						}} success>
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
							<Text style={{marginBottom : 10}}>{this.props.titleDoc}</Text>
						</TouchableHighlight>
						<View style={{height : 1, marginBottom : 20, backgroundColor : '#CCC', flex : 1}}/>
						{this.renderListText()}
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