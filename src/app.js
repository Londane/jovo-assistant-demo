'use strict';

const { App } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Dialogflow } = require('jovo-platform-dialogflow');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { Firestore } = require('jovo-db-firestore');

// Helper functions for Telegram
const {isTelegramRequest, getTelegramUserObject} = require('./telegramHelper')


const admin = require('firebase-admin');
const serviceAccount = require('./secrets/jovo-assistent-demo-firebase-admin.json');
admin.initializeApp(
  {credential: admin.credential.cert(serviceAccount)}
);

const db = admin.firestore();


// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

// prettier-ignore
app.use(
  new GoogleAssistant(),
  new Dialogflow(),
  new JovoDebugger(),
  new Firestore(),   // we need credentials for that
);


// ------------------------------------------------------------------
 async function loadCurrentQuote(){
  const quoteRef = db.collection('AppData').doc('CurrentQuote');
  const quoteOfDoc = (await quoteRef.get());

  if(!quoteOfDoc.exists){
    console.log('No Quot document found!');
    return undefined;
  }else{
    return quoteOfDoc.data().text;
  }
}


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({

  LAUNCH() {
    return this.toIntent('HelloWorldIntent');
  },
  Unhandled() {
    return this.ask("Sorry i did not understand you. Can you please rephrase your question? ", "I don't know what to do. Please rephrase your question");
  },
  async HelloWorldIntent() {
    var name = undefined;
       
    if(isTelegramRequest(this.$jovo.$request)){
      console.log("got telegram request")
        name = getTelegramUserObject(this.$jovo.$request).first_name;
    }else{
      if (this.$user.$data.name && this.$user.$data.name != "") {
        name = this.$user.$data.name;
      } 
    }
    const quoteOfDay = await loadCurrentQuote();

    console.log("user name: " + name);
    console.log("quote: " + quoteOfDay);
    
    if (name) {
      this.ask("Hello, " + name+".  The current quote is '"+quoteOfDay+"'");
    } else {
      this.ask("Hello, What's your name?", 'Please tell me your name.');
    }
  },

  MyNameIsIntent() {
    console.log("user name: " + this.$user.$data.name);

    this.$user.$data.name = this.$inputs.name.value;


    this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
  },
});



module.exports = { app };
