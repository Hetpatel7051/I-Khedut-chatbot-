from gtts import gTTS
import io
text = "આજે ઊંઝા માર્કેટમાં જીરુંનો ભાવ શું છે? ૪૮૦૦ રૂપિયા"
tts = gTTS(text=text, lang="gu")
fp = io.BytesIO()
tts.write_to_fp(fp)
print(len(fp.getvalue()))
