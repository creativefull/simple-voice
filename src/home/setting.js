import React, {Component} from 'react'
import {
	Container,
	Header,
	Left,
	Button,
	Right,
	Body,
	Title,
	Icon,
	StyleProvider,
	Content,
	Card,
	Text,
	Thumbnail,
	Form,
	CardItem,
	Picker,
	Item,
	Toast
} from 'native-base'
import {
	Image,
	View,
	Slider,
	ToastAndroid,
	AsyncStorage
} from 'react-native'
import getTheme from '../../native-base-theme/components/'
import material from '../../native-base-theme/variables/commonColor'

export default class About extends Component {
	constructor() {
		super()
		this.state = {
			bahasa : 'id-ID',
			kecepatan : 0.1
		}
	}
	renderForm() {
		return (
			<View style={{flex : 1, flexDirection : 'column', width : 300}}>
				<View>
					<Text note>Pilih Bahasa</Text>
					<Picker
						selectedValue={this.state.bahasa}
						onValueChange={(bahasa) => this.setState({ bahasa })}>
						<Picker.Item label="Indonesia" value="id-ID"/>
						<Picker.Item label="English (US)" value="en-US"/>
					</Picker>
				</View>

				<View>
					<Text note>Kecepatan Suara</Text>
					<Slider
						step={0.1}
						value={this.state.kecepatan}
						maximumValue={3}
						onValueChange={(kecepatan) => this.setState({ kecepatan })}/>
				</View>
			</View>
		)
	}
	onSave() {
		let data = {
			kecepatan : this.state.kecepatan,
			bahasa : this.state.bahasa
		}
		AsyncStorage.setItem('setting_voice', JSON.stringify(data), (err) => {
			ToastAndroid.show('Pengaturan Bahasa Berhasil Di Simpan', ToastAndroid.LONG)
		})
	}
	getConfig() {
		AsyncStorage.getItem('setting_voice', (err, result) => {
			if (result) {
				result = JSON.parse(result)
				this.setState({
					kecepatan : parseInt(result.kecepatan),
					bahasa : result.bahasa
				})
			}
		})
	}
	componentDidMount() {
		this.getConfig()
	}
	render() {
		return (
			<StyleProvider style={getTheme(material)}>			
				<Container>
					<Content>
						<Card>
							<CardItem>
								<Body>
									<Text>Pengaturan Suara</Text>
								</Body>
							</CardItem>
							<CardItem>
								<Body>
									{this.renderForm()}
								</Body>
							</CardItem>
							<CardItem>
								<Left>
									<Body>
										<Button success onPress={this.onSave.bind(this)}>
											<Text>Simpan</Text>
										</Button>
									</Body>
								</Left>
							</CardItem>
						</Card>
					</Content>
				</Container>
			</StyleProvider>
		)
	}
}