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

import {
	StackNavigator
} from 'react-navigation'

import {
	ScrollView,
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
			data : [{
				title : 'Get Started',
				content : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
			},{
				title : 'Hello World',
				content : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
			}]
		}
	}

	floatingButton() {
		return (
			<Button info style={{zIndex : 9, width : 70, height : 70, borderRadius : 70, justifyContent : 'center', position : 'absolute', bottom : 10, right : 10, alignItems : 'center'}} onPress={() => this.props.navigation.navigate('NewDoc')}>
				<Icon style={{fontSize : 30}} name="plus" type="FontAwesome"/>
			</Button>
		)
	}
	renderNotes() {
		return (
			this.state.data.map((d, key) => {
				return (
					<TouchableOpacity
						onPress={() => {
							this.props.navigation.navigate('NewDoc', {title : d.title, id : 1})
						}}
						key={key}>
						<Card key={key}>
							<CardItem>
								<Left>
									<Icon name='docs' type="SimpleLineIcons"/>
									<Body>
										<Text>{d.title}</Text>
										<Text note>April 25, 2018</Text>
									</Body>
								</Left>
							</CardItem>
							<CardItem>
								<Body>
									<Text style={{fontSize : 11}} numberOfLines={4}>{d.content}</Text>
								</Body>
							</CardItem>
							<CardItem>
								<Left>
									<Button transparent textStyle={{color : '#87838B'}}>
										<Icon name="share"/>
									</Button>
									<Button transparent textStyle={{color : '#87838B'}}>
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