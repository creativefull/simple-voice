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
	CardItem
} from 'native-base'
import getTheme from '../../native-base-theme/components/'
import material from '../../native-base-theme/variables/commonColor'
import {downloadText} from '../services/saveas'
import RNFS from 'react-native-fs'

import {
	StackNavigator
} from 'react-navigation'

import {
	ScrollView,
	Share,
	ToastAndroid,
	View,
	Linking,
	AsyncStorage,
	TouchableOpacity
} from 'react-native'

import NewDoc from './newfile'

class HeaderApp extends Component {
	render() {
		return (
			<Header>
				<Left>
					<Button transparent>
					<Icon name='menu' />
					</Button>
				</Left>
				<Body>
					<Title>Menemu Baling</Title>
				</Body>
				<Right />
			</Header>
		)
	}
}

class Home extends Component {
	constructor() {
		super()
		this.state = {
			data : []
		}
	}

	floatingButton() {
		return (
			<Button info style={{zIndex : 9, width : 70, height : 70, borderRadius : 70, justifyContent : 'center', position : 'absolute', bottom : 10, right : 10, alignItems : 'center'}} onPress={() => this.props.navigation.navigate('NewDoc')}>
				<Icon style={{fontSize : 30}} name="plus" type="FontAwesome"/>
			</Button>
		)
	}
	
	getListDocument() {
		AsyncStorage.getItem('notes', (err, notes) => {
			if (err) {
				alert('Get Document Error')
			}
			
			let data = notes ? JSON.parse(notes) : []
			this.setState({ data })
		})
	}

	componentDidMount() {
		this.getListDocument()
	}

	exportTxt(file, title) {
		RNFS.readFile(RNFS.DocumentDirectoryPath + '/notes/' + file).then((content) => {
			// var blob = new Blob([byteNumbers], {type: 'text/html'});
			let regex = /(<([^>]+)>)/ig
			htmlString = content.toString().replace(regex, '')
			RNFS.writeFile(RNFS.ExternalStorageDirectoryPath + '/Documents/' + title + '.docx', htmlString, 'utf8').then((x) => {
				ToastAndroid.show('File berhasil di export lokasi file: ' + RNFS.ExternalStorageDirectoryPath + '/Documents/' + title + '.docx', ToastAndroid.LONG)
			})
		})
	}

	async share(file, title) {
		let fileToShare = await RNFS.readFile(RNFS.DocumentDirectoryPath + '/notes/' + file)

		let content = {
			title : title,
			message : fileToShare
		}

		Share.share(content)
	}

	confirmDelete() {
		
	}

	renderNotes() {
		if (this.state.data.length > 0) {
			return (
				this.state.data.map((d, key) => {
					return (
						<TouchableOpacity
							onPress={() => {
								this.props.navigation.navigate('NewDoc', {title : d.title, id : d.id, file : d.file})
							}}
							key={key}>
							<Card key={key}>
								<CardItem>
									<Left>
										<Icon name='docs' type="SimpleLineIcons"/>
										<Body>
											<Text>{d.title.toUpperCase()}</Text>
											<Text note>April 25, 2018</Text>
										</Body>
									</Left>
								</CardItem>
								{/* <CardItem>
									<Body>
										<Text style={{fontSize : 11}} numberOfLines={4}>{d.content}</Text>
									</Body>
								</CardItem> */}
								<CardItem>
									<Left>
										<Button transparent textStyle={{color : '#87838B'}} onPress={() => this.share(d.file, d.title)}>
											<Icon name="share"/>
										</Button>
										<Button transparent textStyle={{color : '#87838B'}} onPress={() => this.exportTxt(d.file, d.title)}>
											<Icon name="page-export" type="Foundation"/>
										</Button>
										<Button transparent textStyle={{color : '#87838B'}}>
											<Icon name="trash"/>
										</Button>
									</Left>
								</CardItem>
							</Card>
						</TouchableOpacity>
					)
				})
			)
		} else {
			return (
				<Container>
					<Card style={{justifyContent : 'center'}}>
						<CardItem style={{justifyContent : 'center', alignItems : 'center', flexDirection : 'column'}}>
							<View>
								<Text style={{fontSize : 30, color : '#888'}}>BELUM ADA DATA</Text>
							</View>
							<View style={{justifyContent : 'center', marginTop : 10}}>
								<Button rounded info onPress={() => this.props.navigation.navigate('NewDoc')}>
									<Text>Mulai Menulis</Text>
								</Button>
							</View>
						</CardItem>
					</Card>
				</Container>
			)
		}
	}
	render() {
		return (
			<StyleProvider style={getTheme(material)}>
				<Container>
					<HeaderApp/>

					<ScrollView>
						{this.renderNotes()}
					</ScrollView>

					{this.floatingButton()}
				</Container>
			</StyleProvider>
		)
	}
}

const Nav = StackNavigator({
	Home : {
		screen : Home
	},
	NewDoc : {
		screen : NewDoc
	}
}, {
	initialRouteName : 'Home',
	headerMode : 'none'
})

export default Nav