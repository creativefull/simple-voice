import React, { Component } from 'react';
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
import FilePickerManager from 'react-native-file-picker';
import RNFS from 'react-native-fs'

import {  View, ScrollView, StyleSheet, ToastAndroid} from 'react-native';
import Modal from './modal-view'

class HeaderApp extends Component {
	render() {
		return (
			<Header androidStatusBarColor="#007B70" style={{backgroundColor : '#007B70'}}>
				<Left>
					<Button transparent accessibilityLabel="Kembali Ke Halaman Utama" onPress={() => this.props.navigation.goBack()}>
						<Icon name='ios-arrow-back' type="Ionicons" />
					</Button>
				</Left>
				<Body>
					<Title>Import Document</Title>
				</Body>
			</Header>
		)
	}
}

export default class componentName extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 file : '',
		 contents : '',
		 filename : '',
		 modalView : false
	  };
	};
	
	selectFile(type) {
		const options = {
			title: 'File Picker',
			chooseFileButtonTitle: 'Choose File...'
		};

		FilePickerManager.showFilePicker(options, (results) => {
			if (results.didCancel) {
				ToastAndroid.show('User membatalkan open file', ToastAndroid.SHORT)
			} else if (results.error) {
				ToastAndroid.show('FilePicker error: ' + results.error, ToastAndroid.SHORT)
			} else {
				if (results.type == type) {
					// alert(JSON.stringify(results))
					RNFS.readFile(results.path).then((fileContent) => {
						this.setState({
							file : results.path,
							fileName : results.fileName,
							contents : fileContent,
							modalView : true
						})
					}).catch((e) => {
						ToastAndroid.show('File Tidak dapat di buka di aplikasi menembu baling', ToastAndroid.SHORT)						
					})
				} else {
					ToastAndroid.show('File Tidak dapat di buka di aplikasi menembu baling', ToastAndroid.SHORT)
				}
			}
		})
	}
  render() {
	return (
		<StyleProvider style={getTheme(material)}>
			<ScrollView>
				<Modal
					titleDoc={this.state.fileName}
					modalVisible={this.state.modalView}
					content={this.state.contents}
					closeModal={() => this.setState({ modalView : false})}
				/>

				<HeaderApp {...this.props}/>
				<Card>
					<CardItem cardBody>
						<View style={styles.container}>
							<Button
								full
								success
								style={styles.btnImport}
								onPress={() => this.selectFile('text/plain')}>
								<Text>IMPORT DARI TXT</Text>
							</Button>
							<Button
								full
								success
								style={styles.btnImport}
								onPress={() => this.selectFile('text/html')}>
								<Text>IMPORT DARI HTML</Text>
							</Button>
							{/* <Button
								full
								success
								style={styles.btnImport}>
								<Text>IMPORT DARI DOC</Text>
							</Button>
							<Button
								full
								success
								style={styles.btnImport}>
								<Text>IMPORT DARI PDF</Text>
							</Button>
							<Button
								full
								success
								style={styles.btnImport}>
								<Text>IMPORT DARI WEBSITE</Text>
							</Button> */}
						</View>
					</CardItem>
				</Card>
			</ScrollView>
		</StyleProvider>
	);
  }
}

const styles = StyleSheet.create({
	container : {
		padding : 10,
		flex: 1,
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
	},
	btnImport : {
		marginBottom: 10,
	}
})