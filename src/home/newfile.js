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

import {
	StyleSheet,
	Animated,
	Keyboard
} from 'react-native'

class HeaderApp extends Component {
	render() {
		return (
			<Header>
				<Left>
					<Button onPress={() => this.props.navigation.goBack()} transparent>
						<Icon name='ios-arrow-back' type="Ionicons" />
					</Button>
				</Left>
				<Body>
					<Title>{this.props.title || 'Menemu Baling'}</Title>
				</Body>
				<Right>
					<Button transparent>
						<Icon name='md-volume-up' type="Ionicons" />
					</Button>
					<Button transparent>
						<Icon name='more-horiz' type="MaterialIcons" />
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
			initContent : ''
		}
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

		// VOICE
		Voice.onSpeechStart = this.onSpeechStart.bind(this)
		Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
		Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
		Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this)
	}

	async componentWillUnmount () {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
		this.setState({
			initContent : ''
		})
		await Voice.stop()
		Voice.destroy()
	}

	_keyboardDidShow () {
		Animated.sequence([
			Animated.timing(this.state.heightVoice, {
				toValue : 0,
				duration : 500
			}),
			Animated.timing(this.state.opacityVoice, {
				toValue : 0,
				duration : 500
			})
		]).start()
	}

	_keyboardDidHide () {
		Animated.sequence([
			Animated.timing(this.state.heightVoice, {
				toValue : 100,
				duration : 500
			}),
			Animated.timing(this.state.opacityVoice, {
				toValue : 1,
				duration : 500
			})
		]).start()
	}

	onSpeechStart(e) {
		this.setState({
			startedVoice : true
		})
	}

	async onSpeechEndHandler(e) {
		this.setState({
			startedVoice : false,
			textPartial : ''
		})

		// this.richtext.setContentHTML('ok ok ok')
	}

	async _stopRecognizing(e) {
		try {
		await Voice.stop();
		} catch (e) {
		console.error(e);
		}
	}

	async onSpeechPartialResults(e) {
		this.setState({
			textPartial : e.value[0]
		})

		// this.richtext.setContentHTML(this.state.initContent + ' ' + this.state.textPartial)
	}

	componentWillMount() {
		setInterval(async () => {
			let title = await this.richtext.getTitleText()
			this.setState({
				theTitle : title
			})
		}, 1000)
	}

	async onSpeechResultsHandler(e) {
		let before = this.state.textRecog
		console.log(e)
		let content = await this.richtext.getContentHtml()
		this.setState({
			textRecog : before + ' ' + e.value[0],
			textPartial : '',
			initContent : content
		}, () => {
			this.setState({
				initContent : content
			})
		})
		// alert(JSON.stringify(e))
	}

	initCallBackEditor() {
		this.richtext.setBackgroundColor('#F80')
	}

	async startVoice() {
		// this.richtext.setContentHTML('ini contoh pas di klik')
		if (!this.state.startedVoice) {
			Voice.start('id-ID');
			this.richtext.setContentFocusHandler(async () => {
				let content = await this.richtext.getContentHtml()
				this.setState({
					initContent : content
				})
			})
		} else {
			await Voice.stop()
		}
	}

	render() {
		return (
			<StyleProvider style={getTheme(material)}>
				<Container>
					<HeaderApp ref={ref => this.headerTitle = ref} title={this.state.theTitle} {...this.props}/>

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
						getEditor={() => this.richtext}
					/>

					<Animated.View style={{opacity : this.state.opacityVoice, height : this.state.heightVoice}}>
						<Footer style={{height : 100}}>
							<FooterTab style={{padding : 20, backgroundColor : '#2980B9'}}>
								<Text>
									{this.state.textPartial}
								</Text>
								<Button full style={{padding : 40}} transparent onPress={this.startVoice.bind(this)}>
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