import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet
} from 'react-native';
import {
  RkText,
  RkButton,
  RkStyleSheet
} from 'react-native-ui-kitten';
import {
	Icon, Container, Content, Text
} from 'native-base'
import {
	StackNavigator
} from 'react-navigation'

let colorDefault = '#22A7F0'
const MainRoutes = [{
	title : '1. Mesin Pencari',
	id : 'HomeApp',
	icon : (
		<Icon name="google" style={{fontSize : 50, color : colorDefault}} type="FontAwesome"/>
	)
},{
	title : '2. Keyboard',
	id : 'Home',
	icon : (
		<Icon name="keyboard" style={{fontSize : 50, color : colorDefault}} type="Entypo"/>
	)
},{
	title : '3. Text to Speech',
	id : 'Home',
	icon : (
		<Icon name="speech" style={{fontSize : 50, color : colorDefault}} type="SimpleLineIcons"/>
	)
},{
	title : '4. Mesin Pembaca',
	id : 'Home',
	icon : (
		<Icon name="sound" style={{fontSize : 50, color : colorDefault}} type="Entypo"/>
	)
},{
	title : '3. Mesin Menulis',
	id : 'Home',
	icon : (
		<Icon name="clipboard" style={{fontSize : 50, color : colorDefault}} type="Foundation"/>
	)
},{
	title : '3. Setting Offline',
	id : 'Home',
	icon : (
		<Icon name="gear" style={{fontSize : 50, color : colorDefault}} type="FontAwesome"/>
	)
}]

class GridV2 extends React.Component {
  static navigationOptions = {
	title: 'MENEMU BALING'.toUpperCase(),
	headerTintColor : colorDefault
  };

  constructor(props) {
    super(props);
    this.state = {dimensions: undefined}
  };

  _onLayout = event => {
    if (this.state.height)
      return;
    let dimensions = event.nativeEvent.layout;
    this.setState({dimensions})
  };

  _getEmptyCount(size) {
    let rowCount = Math.ceil((this.state.dimensions.height - 20) / size);
    return rowCount * 2 - MainRoutes.length;
  };

  render() {
    let navigate = this.props.navigation.navigate;
    let items = <View/>;

    if (this.state.dimensions) {
      let size = this.state.dimensions.width / 2;
      let emptyCount = this._getEmptyCount(size);

      items = MainRoutes.map(function (route, index) {
        return (
          <RkButton rkType='tile'
                    style={{height: size, flexDirection : 'column', width: size - 10, margin: 5, backgroundColor : '#FEFEFE', borderWidth : 1, borderColor : '#22A7F0'}}
                    key={index}
                    onPress={() => {
                      navigate(route.id)
                    }}>
            <RkText style={styles.icon} rkType='primary moon xxlarge'>
              {route.icon}
            </RkText>
            <RkText rkType='small'>{route.title}</RkText>
          </RkButton>
        )
      });

      for (let i = 0; i < emptyCount; i++) {
        items.push(<View key={'empty' + i} style={[{height: size, padding : 10, width: size}, styles.empty]}/>)
      }
    }

    return (
		<ScrollView
			style={styles.root}
			onLayout={this._onLayout}
			contentContainerStyle={styles.rootContainer}>
			{items}
		</ScrollView>
    );
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  rootContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  empty: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#FFF'
  },
  icon: {
    marginBottom: 16
  }
}));

const Navigation = StackNavigator({
	Menu : {
		screen : GridV2
	}
}, {
	initialRouteName : 'Menu',
	headerMode : 'screen'
})

export default Navigation