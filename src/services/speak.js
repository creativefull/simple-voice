import tts from 'react-native-tts'

exports.lang = async (l = 'id-ID') => {
	tts.setDefaultLanguage(l)
}

tts.setDefaultRate(0.8)
exports.speak = (async (text = 'Tidak ada content') => {
	tts.speak(text)
})

exports.tts = tts