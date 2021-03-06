import React, {Component} from 'react'

import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';
import {
	Container,
	Footer,
	FooterTab,
	Button,
	Text,
	Icon,
	View,
	Header,
	StyleProvider,
	Left,
	Body,
	Right,
	Title
} from 'native-base'

import getTheme from '../../native-base-theme/components/'
import material from '../../native-base-theme/variables/commonColor'
import Voice from 'react-native-voice';
const RNFS = require('react-native-fs');
const _ = require('underscore')

import {
	StyleSheet,
	Animated,
	Keyboard,
	AsyncStorage,
	ToastAndroid
} from 'react-native'
const ImagePicker = require('react-native-image-picker');

import Modal from './modal-view'

class HeaderApp extends Component {
	constructor() {
		super()
		this.state = {
			modalView : false,
			content : ''
		}
	}
	async openModal() {
		this.props.getContent().then((content) => {
			this.setState({
				modalView : true,
				content : content
			})
		})
	}
	render() {
		return (
			<Header androidStatusBarColor="#007B70" style={{backgroundColor : '#007B70'}}>
				<Left>
					<Button onPress={() => this.props.navigation.goBack()} accessibilityLabel="Kembali Ke Halaman Utama" transparent>
						<Icon name='ios-arrow-back' type="Ionicons" />
					</Button>
				</Left>
				<Body>
					<Modal
						titleDoc={this.props.theTitle}
						modalVisible={this.state.modalView}
						content={this.state.content}
						closeModal={() => this.setState({ modalView : false})}
					/>
					<Title>{this.props.title || 'Menemu Baling'}</Title>
				</Body>
				<Right>
					<Button transparent onPress={this.openModal.bind(this)} accessibilityLabel="Baling Baca Dengan Telinga">
						<Icon name={this.props.isSpeak ? 'ios-volume-up' : 'ios-volume-off-outline'} type="Ionicons" />
					</Button>
					<Button transparent onPress={this.props.actionSave.bind()} accessibilityLabel="Simpan Document Anda">
						<Icon name='save' type="MaterialIcons" />
					</Button>
				</Right>
			</Header>
		)
	}
}

class NewFile extends Component {
	constructor(props) {
		super(props)

		this.state = {
			opacityVoice : new Animated.Value(1),
			heightVoice : new Animated.Value(100),
			startedVoice : false,
			textPartial : '',
			textRecog : '',
			theTitle : '',
			initContent : '',
			modalView : false,
			focusInput : 'content',
			alreadyInput : false,
			speaking : false,
			langDefault : 'id-ID'
		}
		this.lengtPart = 0;

		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

		// VOICE
		Voice.onSpeechStart = this.onSpeechStart.bind(this)
		Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
		Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
		Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this)
		Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this)
		this.timer = null
	}

	async componentWillUnmount () {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
		this.setState({
			initContent : ''
		})
		await Voice.stop()
		Voice.destroy().then(Voice.removeAllListeners)
		clearInterval(this.timer)
		Keyboard.dismiss()

		this.lengtPart = 0
	}

	isExistNotes() {
		return new Promise((resolve, reject) => {
			RNFS.exists(RNFS.ExternalDirectoryPath + '/notes').then((result) => {
				return resolve(result)
			}).catch((e) => {
				return reject(e)
			})
		})
	}	

	readDir() {
		this.isExistNotes().then((isExist) => {
			RNFS.mkdir(RNFS.ExternalDirectoryPath + '/notes').then((result) => {
				RNFS.readDir(RNFS.ExternalDirectoryPath + '/notes').then((result) => {
					// alert(JSON.stringify(result))
					console.log('OK')
				}).catch((e) => {
					console.log(e)
				})
			})
		})
	}

	writeFile(title, content) {
		return new Promise((resolve, reject) => {
			RNFS.writeFile(RNFS.ExternalDirectoryPath + '/notes/' + title, content, 'utf8').then((result) => {
				return resolve(true)
			}).catch((e) => {
				return reject(e)
			})
		})
	}

	autoSave() {
		const {params} = this.props.navigation.state
		let title = params ? params.id != undefined ? params.id : new Date().getTime() : new Date().getTime()

		AsyncStorage.getItem('notes', async (err, notes) => {
			if (err) {
				ToastAndroid.show('Devices Not Supported', ToastAndroid.SHORT)
			}

			notes = JSON.parse(notes)
			let whereID = _.findWhere(notes, {id : title})
			// IF DOCUMENT ALREADY EXISTS
			if (whereID) {
				let content = await this.richtext.getContentHtml()
				this.writeFile(whereID.id + '.html', content).then(async (result) => {
					if (result) {
						let theTitle = await this.richtext.getTitleText()
						notes.map((value) => {
							if (whereID.id == value.id) {
								value.title = theTitle
								value.time_update = new Date().getTime()
							}
						})

						AsyncStorage.setItem('notes', JSON.stringify(notes), (err, res) => {
							if (err) {
								return alert('Tidak dapat menyimpan document')
							}
							
							ToastAndroid.show('Berhasil Menyimpan Document ' + whereID.title, ToastAndroid.LONG)
						})
					} else {
						ToastAndroid.show('Tidak dapat menyimpan document', ToastAndroid.CENTER)
					}
				})
			} else {
				let dataToSave = {
					id : title,
					title : await this.richtext.getTitleText(),
					file : title + '.html',
					created_at : new Date().getTime(),
					time_update : new Date().getTime()
				}
				let content = await this.richtext.getContentHtml()
				this.writeFile(dataToSave.file, content).then((result) => {
					if (result) {
						let data = notes ? notes : []
						data.push(dataToSave)

						AsyncStorage.setItem('notes', JSON.stringify(data), (err, result) => {
							if (err) {
								return ToastAndroid.show('Gagal Menyimpan', ToastAndroid.SHORT)
							}
							
							this.props.navigation.setParams({id : title})							
							ToastAndroid.show('Disimpan', ToastAndroid.SHORT)
						})
					} else {
						ToastAndroid.show('Gagal Menyimpan', ToastAndroid.SHORT)
					}
				})
			}
		})
	}
	
	saveFile() {
		const {params} = this.props.navigation.state
		let title = params ? params.id != undefined ? params.id : new Date().getTime() : new Date().getTime()

		AsyncStorage.getItem('notes', async (err, notes) => {
			if (err) {
				alert('Smartphone anda tidak support penyimpanan local')
			}

			notes = JSON.parse(notes)
			let whereID = _.findWhere(notes, {id : title})
			// IF DOCUMENT ALREADY EXISTS
			if (whereID) {
				let content = await this.richtext.getContentHtml()
				Keyboard.dismiss()
				this.writeFile(whereID.id + '.html', content).then(async (result) => {
					if (result) {
						let theTitle = await this.richtext.getTitleText()
						notes.map((value) => {
							if (whereID.id == value.id) {
								value.title = theTitle
								value.time_update = new Date().getTime()
							}
						})

						AsyncStorage.setItem('notes', JSON.stringify(notes), (err, res) => {
							if (err) {
								return alert('Tidak dapat menyimpan document')
							}
							
							ToastAndroid.show('Berhasil Menyimpan Document ' + whereID.title, ToastAndroid.LONG)
							this.props.navigation.goBack()
						})
					} else {
						ToastAndroid.show('Tidak dapat menyimpan document', ToastAndroid.CENTER)
					}
				})
			} else {
				let dataToSave = {
					id : title,
					title : await this.richtext.getTitleText(),
					file : title + '.html',
					created_at : new Date().getTime(),
					time_update : new Date().getTime()
				}
				let content = await this.richtext.getContentHtml()
				this.writeFile(dataToSave.file, content).then((result) => {
					if (result) {
						let data = notes ? notes : []
						data.push(dataToSave)

						AsyncStorage.setItem('notes', JSON.stringify(data), (err, result) => {
							if (err) {
								return alert('Tidak dapat menyimpan document')
							}
							
							ToastAndroid.show('Berhasil Menyimpan Document ' + dataToSave.title, ToastAndroid.LONG)
							this.props.navigation.navigate('Home')
						})
					} else {
						alert('Gagal untuk menyimpan document')
					}
				})
			}
		})
	}

	getFileContent(file) {
		// alert(RNFS.ExternalDirectoryPath + '/notes/' + file)
		RNFS.exists(RNFS.ExternalDirectoryPath + '/notes/' + file).then((onoFile) => {
			// alert(onoFile)
			if (onoFile) {
				RNFS.readFile(RNFS.ExternalDirectoryPath + '/notes/' + file).then((contentFile) => {
					// alert(contentFile)
					this.setState({
						initContent : contentFile
					})
				}).catch((e) => {
					ToastAndroid.show('Tidak dapat membuka content')
				})
			} else {
				ToastAndroid.show('CONTENT NOT FOUND', ToastAndroid.LONG)
			}
		})
	}

	getLanguageSpeak() {
		AsyncStorage.getItem('setting_voice', (err, result) => {
			if (result) {
				let x = JSON.parse(result)
				let bahasa = x.bahasa || 'id-ID'
				this.setState({
					langDefault : bahasa
				})
			} else {
				this.setState({
					langDefault : 'id-ID'
				})
			}
		})			
	}

	componentDidMount() {
		this.getLanguageSpeak()

		const {params} = this.props.navigation.state
		this.setState({
			theTitle : params ? params.title : ''
		})

		if (params) {
			this.getFileContent(params.file)
		}

		this.readDir()
	}

	componentWillMount() {
		this.timer = setInterval(async () => {
			let theTitle = await this.richtext.getTitleText()
			this.setState({
				theTitle : theTitle
			})
		}, 5000)
	}

	_keyboardDidShow () {
		Animated.sequence([
			Animated.timing(this.state.heightVoice, {
				toValue : 0,
				duration : 200
			}),
			Animated.timing(this.state.opacityVoice, {
				toValue : 0,
				duration : 200
			})
		]).start()
	}

	_keyboardDidHide () {
		Animated.sequence([
			Animated.timing(this.state.heightVoice, {
				toValue : 100,
				duration : 200
			}),
			Animated.timing(this.state.opacityVoice, {
				toValue : 1,
				duration : 200
			})
		]).start()

		this.autoSave()
	}

	async onSpeechStart(e) {
		let content = ''
		let titleContent = ''

		content = await this.richtext.getContentHtml()
		titleContent = await this.richtext.getTitleText()

		this.setState({
			startedVoice : true,
			initContent : content,
			theTitle : titleContent,
			textPartial : ' '
		})

		this.lengtPart = 0
	}
	
	async onSpeechEndHandler(e) {
		this.setState({
			startedVoice : false,
			textPartial : ' ',
			alreadyInput : false
		}, () => {
			this.lengtPart = 0
		})

		// this.richtext.setContentHTML('ok ok ok')

		// SAVE DOCUMENT
		this.autoSave()
	}

	async _stopRecognizing(e) {
		try {
			this.lengtPart = 0
			// this.autoSave()
			await Voice.stop();
		} catch (e) {
		console.error(e);
		}
	}

	async onSpeechPartialResults(e) {
		// var x = this.state.textPartial
		// this.setState({
		// 	textPartial : e.value[0],
		// })
		// let content = await this.richtext.getContentHtml()
		// if (this.state.focusInput == 'content') {
		// 	this.richtext.setContentHTML( this.state.initContent + ' ' + this.state.textPartial)
		// } else {
		// 	this.richtext.setTitleHTML(this.state.theTitle + ' ' + this.state.textPartial)
		// }
		// let lengthSekarang = e.value[0].split(' ').length
		// let lengthSebelum = x.split(' ').length
		// let resultPart = lengthSebelum < lengthSekarang ? lengthSebelum == 1 ? e.value[0] :  e.value[0].split(' ')[lengthSekarang - 1] : ''

		// console.log("SELESAI", new Date().getMilliseconds())
		// console.log(e.value[0].split(" ").pop())

		let x = e.value[0].split(" ").length
		// console.log(this.lengtPart, x, e.value[0])
		let beforeLengthPart = this.lengtPart
		if (this.lengtPart < x) {
			this.lengtPart = x
			let isinya = this.lengtPart == 1 ? e.value[0] : e.value[0].split(" ")[x-1]
			if (beforeLengthPart == this.lengtPart - 1) {
				if (isinya) {
					this.richtext.prepareInsert()
					this.richtext.insertNextText(isinya + " ")
				}
			}
		} else {
			if (!this.state.alreadyInput) {
				let isinya = e.value[0]
				if (isinya) {
					this.richtext.prepareInsert()
					this.richtext.insertNextText(isinya + " ")
					this.setState({
						alreadyInput : true
					})
				}
			}
		}
	}

	setFocusHandlers() {
		// this.richtext.setTitleFocusHandler(() => {
		// 	this.setState({
		// 		focusInput : 'judul'
		// 	})
		// })

		// this.richtext.setContentFocusHandler(() => {
		// 	this.setState({
		// 		focusInput : 'content'
		// 	})
		// })
	}

	async onSpeechRecognized(e) {
		// alert(JSON.stringify(e))
	}

	async onSpeechResultsHandler(e) {
		let before = this.state.textRecog
		let content = await this.richtext.getContentHtml()
		this.setState({
			textRecog : before + ' ' + e.value[0],
			textPartial : ' ',
			initContent : content
		}, () => {
		})
		// alert(JSON.stringify(e))
	}

	initCallBackEditor() {
		this.setFocusHandlers()
	}

	async startVoice() {
		// this.richtext.setContentHTML('ini contoh pas di klik')
		if (!this.state.startedVoice) {
			Voice.start(this.state.langDefault).then(() => {
				this.richtext.setContentFocusHandler(async () => {
					let content = await this.richtext.getContentHtml()
					this.setState({
						initContent : content
					})
				})
			}).catch((e) => {
				ToastAndroid.show('Timeout', ToastAndroid.SHORT)
			});
		} else {
			await Voice.stop()
		}
	}

	async getContent() {
		return new Promise(async (resolve, reject) => {
			let content = await this.richtext.getContentHtml()
			return resolve(content)
		})
	}

	insertImage() {
		this.richtext.getContentHtml().then((content) => {
			let totalImage = content.split("<img").length
			if (parseInt(totalImage/2) < 2) {
				let options = {
					title : 'Pilih Photo',
					storageOptions : {
						skipBackup : true,
						path : 'images'
					},
					noData : false
				}
				ImagePicker.showImagePicker(options, (response) => {
					if (response.didCancel) {
						console.log('User cancelled image picker');
					}
					else if (response.error) {
						console.log('ImagePicker Error: ', response.error);
					} else {
						let source = {src : response.uri}
						this.richtext.insertImage(source)
					}
				})	
			} else {
				alert('Anda Tidak Dapat Menambah Gambar Lagi')
			}
		})
	}

	render() {
		return (
			<StyleProvider style={getTheme(material)}>
				<Container>
					<HeaderApp
						theTitle={this.state.theTitle}
						getContent={this.getContent.bind(this)}
						initContent={this.state.initContent}
						actionSave={this.saveFile.bind(this)}
						isSpeak={this.state.speaking}
						ref={ref => this.headerTitle = ref}
						title={this.state.theTitle} {...this.props}/>

					<RichTextEditor
						ref={(r)=>this.richtext = r}
						style={styles.richText}
						initialTitleHTML={this.state.theTitle}
						titlePlaceholder={'Judul'}
						contentPlaceholder={'Content'}
						initialContentHTML={this.state.initContent}
						editorInitializedCallback={this.initCallBackEditor.bind(this)}
					/>
					<RichTextToolbar
						onPressAddImage={this.insertImage.bind(this)}
						getEditor={() => this.richtext}
					/>

					<Animated.View style={{opacity : this.state.opacityVoice, height : this.state.heightVoice}}>
						<Footer style={{height : 100}}>
							<FooterTab style={{padding : 20, backgroundColor : '#007B70'}}>
								<Button full style={{padding : 40}} transparent onPress={this.startVoice.bind(this)} accessibilityLabel="Menemu, Menulis Dengan Mulut">
									<Icon name={this.state.startedVoice == false ? "keyboard-voice" : "settings-voice"} type="MaterialIcons" style={{fontSize : 50, color : '#FFF', margin : 40}}/>
								</Button>
							</FooterTab>
						</Footer>
					</Animated.View>
				</Container>
			</StyleProvider>
		)
	}
}

const styles = StyleSheet.create({
  richText: {
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
	marginTop : 20
  },
});

export default NewFile