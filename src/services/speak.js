import tts from 'react-native-tts'
import {
	AsyncStorage
} from 'react-native'

exports.lang = async (l = 'id-ID') => {
	AsyncStorage.getItem('setting_voice', (err, result) => {
		if (result) {
			let x = JSON.parse(result)
			let bahasa = x.bahasa || 'id-ID'
			tts.setDefaultLanguage(bahasa)
			tts.setDefaultRate(x.kecepatan)
		} else {
			tts.setDefaultLanguage(l)
			tts.setDefaultRate(0.8)
		}
	})
}

exports.speak = (async (text = 'Tidak ada content') => {
	tts.speak(text)
})

exports.tts = tts