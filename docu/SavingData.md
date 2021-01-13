### create Database
 You can create a Firesotre database as described in:
 * https://www.jovo.tech/tutorials/deploy-to-google-cloud
 * Make sure that you save the authentification data.  
   As you can see in my code i saved the json in the `src/secrets/` folder
   *  **PLEASE DO NOT PUPLISH THIS FILE IN A PUBLIC REPOSITORY !!**
      * [keep empty folder in git](https://gist.github.com/x3rAx/cf34c0c2648e9139a674)
   * there are other options, you could also read the content frpm an environment variable (which is a good way to have different settings in local dev and on production)
 


### Jovo Firestore-Integration
 * Unfortunaly the database integration from jovo does not fully work together with `Telegram`.  
   Jovo is not able to extract the `userId` from the request. There is (atm) no integration for Telegram [jovo-platform-dialogflow/src/integrations/](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-dialogflow/src/integrations) .

 * Setting the  `userId` manually has no effect ([jovo-webhook-set-userID](https://community.jovo.tech/t/modify-userid-before-persisting-to-user-data-store/950/2?u=londane))
 
 * you can still access the data from `Telegram` have a look at `src/telegramHelper.js`
 
  ```js
   // in your app.js
   this.$jovo.$request.originalDetectIntentRequest.payload.data.from
  ```
  works with dialogflow-requests from Telegram 
  ```js
{
          responseId: "abc",
          queryResult: {
            queryText: "hello",
            parameters: {
            },
            allRequiredParamsPresent: true,
            outputContexts: [...],
            intent: {
              name: "projects/jovo-assistent-demo/agent/intents/abc",
              displayName: "HelloWorldIntent",
            },
            intentDetectionConfidence: 1,
            languageCode: "en",
          },
          originalDetectIntentRequest: {
            source: "telegram",
            payload: {
              data: {
                from: {
                  first_name: "Matthias",
                  language_code: "en",
                  id: 1238,
                },
                message_id: 42,
                chat: {
                  id: "12348",
                  type: "private",
                },
                date: 23,
                text: "hello",
              },
            },
          },
          session: "projects/jovo-assistent-demo/agent/sessions/abc",
        }
  ```


### Access and save data in Firebase directly
 * we can still access the firestore database directly.  
   * https://firebase.google.com/docs/admin/setup#initialize-sdk
   * https://firebase.google.com/docs/firestore/quickstart#add_data
   * https://firebase.google.com/docs/firestore/quickstart#read_data
 * make sure that you `await` the call to the database. (the function has to be `async` as well )
    ```js
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
    ```


### Debug your code locally 
 * https://www.jovo.tech/tutorials/visual-studio-code-debugging
   * did not work for me
 * you can use my debug configuration from `.vscode`  pls mind that you my also copy the `launch` and `debug` scripts to your `package.json`

   ```
   "scripts": {
    "tsc": "node -v",
    "test": "jest",
    "bundle": "gulp --gulpfile node_modules/jovo-framework/gulpfile.js --cwd ./",
    "start": "cd src && node index.js --webhook",
    "launch": "npm start -- --launch",
    "debug": "jovo run --inspect 9229"
   },
   ```
    * you can now use break points to inspect your code and look directly at the variables and other usefull information.
    Waiting at a breakpoint will verry likely make your sever send no response though.
    The local server will not wait for ever of your code processing the current request. Mostly this should not be a big problem for you as you are likely interessted in the processing of the current request (which you can debug normally)
  