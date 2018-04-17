import tts from 'react-native-tts'

exports.lang = async (l = 'id-ID') => {
	tts.setDefaultLanguage(l)
}

tts.setDefaultRate(0.5)
exports.speak = (async (text) => {
	tts.speak(text)
})

exports.tts = tts