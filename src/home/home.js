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
import Share from 'react-native-share'
const moment = require('moment')

import {
	StackNavigator,
	TabNavigator
} from 'react-navigation'

import {
	ScrollView,
	ToastAndroid,
	View,
	Alert,
	Clipboard,
	Linking,
	AsyncStorage,
	TouchableOpacity
} from 'react-native'

import NewDoc from './newfile'
import About from './about'
import Setting from './setting'

class HeaderApp extends Component {
	render() {
		return (
			<Header androidStatusBarColor="#007B70" style={{backgroundColor : '#007B70'}}>
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
			<Button success style={{zIndex : 9, width : 70, height : 70, borderRadius : 70, justifyContent : 'center', position : 'absolute', bottom : 10, right : 10, alignItems : 'center'}} onPress={() => this.props.navigation.navigate('NewDoc')} accessibilityLabel="TAMBAH DOCUMENT BARU">
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

	isExistNotes() {
		return new Promise((resolve, reject) => {
			RNFS.exists(RNFS.ExternalDirectoryPath + '/notes').then((result) => {
				return resolve(result)
			}).catch((e) => {
				return reject(e)
			})
		})
	}

	generateFolder() {
		this.isExistNotes().then((isExist) => {
			RNFS.mkdir(RNFS.ExternalDirectoryPath + '/notes').then((result) => {

			})
		})
	}
	componentDidMount() {
		this.getListDocument()
		this.generateFolder()
	}
	
	exportTxt(file, title) {
		// RNFS.readFile(RNFS.DocumentDirectoryPath + '/notes/' + file).then((content) => {
		// 	RNFS.writeFile(RNFS.ExternalDirectoryPath + '/notes/' + file + '.html', content, 'utf8').then((x) => {
				let url = 'file://' + RNFS.ExternalDirectoryPath + '/notes/' + file
				// Clipboard.setString(url)
		ToastAndroid.show('File Berhasil Di Export ' + url, ToastAndroid.SHORT)
				// Linking.openURL('googlechrome://navigate?url=' + url).catch(err => alert(JSON.stringify(err)))
		// 	})
		// })
	}

	async share(file, title) {
		let fileToShare = RNFS.ExternalDirectoryPath + '/notes/' + file

		let content = {
			title : title,
			message : 'File dishare dari menemu baling',
			type : 'text/html',
			url : 'file://' + fileToShare
		}

		Share.open(content)
	}

	confirmDelete(id, file) {
		Alert.alert('Warning', 'Apakah anda yakin ingin menghapusnya ?', [{
			text : 'TIDAK'
		}, {
			text : 'YA',
			onPress : () => {
				const {data} = this.state
				let dataRemoved = data.filter((v) => v.id !== id)
				AsyncStorage.setItem('notes', JSON.stringify(dataRemoved), (err) => {
					this.getListDocument()
					RNFS.unlink(RNFS.ExternalDirectoryPath + '/notes/' + file)
					ToastAndroid.show('Data Berhasil Di Hapus', ToastAndroid.SHORT)
				})
				// alert(JSON.stringify(dataRemoved))
			}
		}])
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
											<Text note>{moment(d.created_at).format('YYYY-MM-DD HH:mm:ss')}</Text>
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
										<Button success small style={{marginRight : 10}} textStyle={{color : '#87838B'}} onPress={() => this.share(d.file, d.title)} accessibilityLabel="SHARE DOCUMENT">
											<Icon name="share"/>
										</Button>
										<Button success small style={{marginRight : 10}} textStyle={{color : '#87838B'}} onPress={() => this.exportTxt(d.file, d.title)} accessibilityLabel="EXPORT DOCUMENT">
											<Icon name="page-export" type="Foundation"/>
										</Button>
										<Button success small style={{marginRight : 10}} textStyle={{color : '#87838B'}} onPress={() => this.confirmDelete(d.id, d.file)} accessibilityLabel="HAPUS DOCUMENT">
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
								<Button rounded success onPress={() => this.props.navigation.navigate('NewDoc')}>
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

const HomeTab = TabNavigator({
	ListDoc : {
		screen : Home,
		navigationOptions : {
			tabBarLabel : 'Home'
		}
	},
	// Setting : {
	// 	screen : Setting,
	// 	navigationOptions : {
	// 		tabBarLabel : 'Pengaturan'
	// 	}
	// },
	About : {
		screen : About,
		navigationOptions : {
			tabBarLabel : 'Tentang'
		}
	},
}, {
	tabBarPosition : 'bottom',
	tabBarOptions : {
		style : {
			backgroundColor : '#007B70'
		},
		activeBackgroundColor : '#0EAC51',
		activeTintColor : '#FFF',
		inactiveTintColor : '#DDD',
		indicatorStyle : {
			backgroundColor : '#FFF'
		},
		labelStyle : {
			fontSize : 12
		}
	}
})

const Nav = StackNavigator({
	Home : {
		screen : HomeTab
	},
	NewDoc : {
		screen : NewDoc
	}
}, {
	initialRouteName : 'Home',
	headerMode : 'none'
})

export default Nav