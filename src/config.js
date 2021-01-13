// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
  logging: true,

  user: {
    updatedAt: true,
    dataCaching: true
  },
  db: {
    Firestore: {
      credential: require('./secrets/jovo-assistent-demo-firebase-admin.json'),
      databaseURL: 'https://jovo-assistent-demo.firebaseio.com'
    }
  },

  intentMap: {
    'Default Fallback Intent': 'Unhandled',
  }
};
