const admin = require('firebase-admin');
const chai = require('chai');
const chaiHttp = require('chai-http');
var expect = require("chai").expect;
var request = require("request");
const rp = require('request-promise');
const serviceAccount = require('../config/serviceAccountKey.json');
const { LOCAL_API_ENDPOINT } = require('./constant');

require('dotenv').config();

const LOCAL_API_ENDPOINT = "http://localhost:5001/recruitme-4b479/us-central1/"
// var url ="https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha"

const uid = 'test-uid';
let customToken = null;
let idToken = null;

chai.use(chaiHttp);

// console.log(firebaseConfig)
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

describe("Base API", function () {
    it("returns status 200", function (done) {
        // process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        request(LOCAL_API_ENDPOINT, function (error, response, body) {
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

            chai.request(LOCAL_API_ENDPOINT)
                .post('/event/create')
                .set('Authorization', 'Bearer ' + idToken)
                .set('content-type', 'application/json')
                .send(body)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    if (err) {
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

            chai.request(LOCAL_API_ENDPOINT)
                .post('/event/member_join')
                .set('Authorization', 'Bearer ' + idToken)
                .set('content-type', 'application/json')
                .send(body)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    if (err) {
                        done(err)
                    } else {
                        done()
                    }
                });
        });
    }),

        /*
        * Test the /GET route
        */
        describe('/GET event', () => {
            it('it should fail to get an event', (done) => {

                chai.request(LOCAL_API_ENDPOINT)
                    .get('/event/asdf')
                    .set('Authorization', 'Bearer ' + idToken)
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(404);
                        if (err) {
                            done(err)
                        } else {
                            done()
                        }
                    });
            });


            it('it should successfully get an event', (done) => {
                chai.request(LOCAL_API_ENDPOINT)
                    .get('/event/existing_event')
                    .set('Authorization', 'Bearer ' + idToken)
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(200);
                        if (err) {
                            done(err)
                        } else {
                            done()
                        }
                    });
            });

        });
});