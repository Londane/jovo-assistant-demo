import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from random import randrange

# Use a service account
cred = credentials.Certificate('../src/secrets/jovo-assistent-demo-firebase-admin.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

number = randrange(43)
print("will use {} in my greeting".format(number) )

doc_ref = db.collection(u'AppData').document(u'CurrentQuote')
doc_ref.set({
    u'text': u'{} Greetings from python !'.format(number)
})