const admin = require('firebase-admin');
const chai = require('chai');
const chaiHttp = require('chai-http');
var expect  = require("chai").expect;
var request = require("request");
const rp = require('request-promise');
var events = require("../routers/events");
const serviceAccount = require('../config/serviceAccountKey.json')

require('dotenv').config();

const base_api_endpoint = "http://localhost:5001/recruitme-4b479/us-central1/app"
// var url ="https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha"

const uid = 'test-uid';
let customToken = null;
let idToken = null;

chai.use(chaiHttp);

// console.log(firebaseConfig)
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
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
            customToken = await admin.auth().createCustomToken(uid);

            const res = await rp({
                url: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${process.env.REACT_APP_API_KEY}`,
                method: 'POST',
                body: {
                    token: customToken,
                    returnSecureToken: true,
                },
                json: true,
            });

            idToken = res.idToken;
        } catch (error) {
            console.log("failed!")
            console.log(error);
        }

    }) 
/*
  * Test the /POST route
  */
  describe('/POST event', () => {
      it('it should create an event', (done) => {

        let body = {
            event_name: "The event",
            event_description: "Event desc", 
            event_cover_pic_id: "Coverpic id"
        }

        chai.request('http://localhost:5001/recruitme-4b479/us-central1/app/')
            .post('/event/create')
            .set('Authorization', 'Bearer ' + idToken)
            .set('content-type', 'application/json')
            .send(body)
            .end((err, res) => {
                if (err) {
                    res.should.have.status(200);
                    done(err)
                } else {
                    done()
                }
            });
      });

    it('it should add a member', (done) => {

        let body = {
            member_code: "12345",
        }

        chai.request('http://localhost:5001/recruitme-4b479/us-central1/app/')
            .post('/event/member_join')
            .set('Authorization', 'Bearer ' + idToken)
            .set('content-type', 'application/json')
            .send(body)
            .end((err, res) => {
                if (err) {
                    res.should.have.status(200);
                    done(err)
                } else {
                    done()
                }
            });
      });
  });

});