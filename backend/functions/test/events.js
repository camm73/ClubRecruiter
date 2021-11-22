let admin = require('firebase-admin');
let chai = require("chai");
let chaiHttp = require('chai-http');
var expect  = require("chai").expect;
var request = require("request");
var events = require("../routers/events");
const { RSA_PKCS1_OAEP_PADDING } = require('constants');

const base_api_endpoint = "http://localhost:5001/recruitme-4b479/us-central1/app"
// var url ="https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha"

const uid = 'test-uid';
let customToken = null;
let idToken = null;

chai.use(chaiHttp);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

firebaseApp = admin.initializeApp(firebaseConfig);
/*
const googleProvider = new GoogleAuthProvider();
const auth = getAuth(firebaseApp);

const db = getFirestore();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    console.log(res);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
admin.initializeApp();
*/

describe("Base API", function() {
    it("returns status 200", function(done) {
        // process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        request(base_api_endpoint, function(error, response, body) {
            // setTimeout(function(){}, 2000);
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
});

describe('Events', () => {
    before(async () => {
        try {
            customToken = await firebaseApp.auth().createCustomToken(uid);
            console.log("Custom token");
            console.log(customToken);

            const res = await rp({
                url: `https://www.googleapis.com/identifytoolkit/v3/relyingparty/verifyCustomToken?key=${
                    "AIzaSyBaKsRZNo3CNJ2m9mq0IRfDjxdCKsCh1EU"
                }`,
                method: 'POST',
                body: {
                    token: customToken,
                    returnSecureToken: true,
                },
                json: true,
            });

            idToken = res.idToken;
        } catch (error) {
            console.log(error);
        }

    }) 
/*
  * Test the /POST route
  */
  describe('/POST event', () => {
      it('it should create an event', (done) => {

        console.log("idtoken");
        console.log(idToken);
        let event = {
            event_name: "The event",
            event_description: "Event desc", 
            event_cover_pic_id: "Coverpic id"
        }

        chai.request(events)
            .post('/create')
            .send(event)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
      });
  });

});