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
	CardItem
} from 'native-base'
import {
	Image
} from 'react-native'

export default class About extends Component {
	render() {
		return (
			<Container>
				<Content>
					<Card>
						<CardItem>
							<Left>
								<Thumbnail source={require('../assets/img/avatar.png')}/>
								<Body>
									<Text>Menemu Baling</Text>
									<Text note>Mapuono Media</Text>
								</Body>
							</Left>
						</CardItem>
						<CardItem cardBody>
							<Image source={require('../assets/img/avatar.png')} style={{height: 200, width: null, flex: 1}}/>
						</CardItem>
						<CardItem>
							<Body>
								<Text>Metode Menemu Baling memungkinkan penggunanya untuk menulis dengan mulut dan membaca dengan telinga dengan memanfaatkan gadget Android. Metode ini diperkenalkan oleh Mampuono, Sekjen IGI (Ikatan Guru Indonesia)</Text>
							</Body>
						</CardItem>
						<CardItem>
							<Left>
							</Left>
							<Right>
								<Body>
									<Text note>&copy; 2018 Mampuono</Text>
								</Body>
							</Right>
						</CardItem>
					</Card>
				</Content>
			</Container>
		)
	}
}