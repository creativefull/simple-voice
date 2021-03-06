/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity
} from 'react-native'
import {
  Container,
  Text,
  Button,
  View,
  Icon
} from 'native-base'
import {
  StackNavigator
} from 'react-navigation'

// STEP SCREEN 
import SplashStep1 from './src/step/step1'
import SplashStep2 from './src/step/step2'
import Menu from './src/step/menu'

import HomeApp from './src/home/home'

class App extends Component {
    constructor() {
      super()
      this.state = {
        fadeAnim : new Animated.Value(0),
        buttonAnim : new Animated.Value(0),
        marginTopBtn : new Animated.Value(0)
      }
    }

    checkSetup() {
      const {navigate} = this.props.navigation
      // AsyncStorage.getItem('setup', (err, value) => {
      //   if (value) {
          // navigate('HomeApp')
      //   }
      // })
    }
    
    componentDidMount() {
      this.checkSetup()
      const AnimateButton = Animated.timing(
        this.state.buttonAnim,
        {
          toValue : 1,
          duration : 500
        }
      )

      const AnimateButtonMargin = Animated.timing(
        this.state.marginTopBtn,
        {
          toValue : 20,
          duration : 1000
        }
      )

      Animated.timing(
        this.state.fadeAnim,
        {
          toValue : 1,
          duration : 1000
        }
      ).start(() => {
        AnimateButton.start(() => {
          AnimateButtonMargin.start()          
        })
      })
    }

    render() {
      return (
        <Container style={{backgroundColor : '#007B70', justifyContent : 'center', alignItems : 'center'}}>
          <Animated.View style={{opacity : this.state.fadeAnim, alignItems : 'center'}}>
            <Text style={{color : '#FFF', fontSize : 20, fontFamily : 'Roboto-Medium'}} uppercase>SELAMAT DATANG DI APLIKASI</Text>
            <Text style={{color : '#FFF', fontWeight : 'bold', fontSize : 30, fontFamily : 'Roboto-Black'}} uppercase>MENEMU BALING</Text>

            <Animated.View style={{opacity : this.state.buttonAnim, marginTop : this.state.marginTopBtn}}>
              <Button rounded style={{backgroundColor : '#2C3E50'}} textStyle={{color : '#2980B9'}} onPress={() => this.props.navigation.navigate('SplashStep1')}>
                <Text>LANGKAH SELANJUTNYA</Text>
                <Icon name="arrow-right" type="FontAwesome"/>
              </Button>
            </Animated.View>
          </Animated.View>

        </Container>
      )
    }
}

const styles = StyleSheet.create({
  container : {
    backgroundColor : '#2980B9', justifyContent : 'center', alignItems : 'center'    
  }
})

const Routring = StackNavigator({
  Splash : {
    screen : App
  },
  SplashStep1 : {
    screen : SplashStep1
  },
  SplashStep2 : {
    screen : SplashStep2
  },
  HomeApp : {
    screen : HomeApp
  },
  Menu : {
    screen : Menu
  }
}, {
  initialRouteName : 'HomeApp',
  headerMode : 'none'
})

export default Routring