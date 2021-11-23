const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app')
const { getAuth, signInWithCustomToken, connectAuthEmulator } = require('firebase/auth')
const chai = require('chai');
const chaiHttp = require('chai-http');
var expect = require("chai").expect;
var request = require("request");
const rp = require('request-promise');
const serviceAccount = require('../config/serviceAccountKey.json');
const { DEV_API_ENDPOINT } = require('./constant');

require('dotenv').config();

// var url ="https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha"

const uid = 'test-uid-1';
const uid2 = 'test-uid-2';
let customToken = null;
let idToken = null;


chai.use(chaiHttp);

// console.log(firebaseConfig)
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
};
  
  
const firebaseApp = initializeApp(firebaseConfig);
  
// No more base API, so will remove this test
// describe("Base API", function () {
//     it("returns status 200", function (done) {
//         request(DEV_API_ENDPOINT, function (error, response, body) {
//             expect(response.statusCode).to.equal(200);
//             done();
//         });
//     });
// });

describe('Events', () => {
    let existing_event_id = null;
    let existing_member_code = null;
    let existing_candidate_code = null;
    before(async () => {
        try {
            customToken = await admin.auth().createCustomToken(uid);
            const auth = getAuth(firebaseApp)
            connectAuthEmulator(auth, "http://localhost:9099")
            const response  = await signInWithCustomToken(auth, customToken)
            idToken = response.user.accessToken
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

            chai.request(DEV_API_ENDPOINT)
                .post('/event/create')
                .set('Authorization', 'Bearer ' + idToken)
                .set('content-type', 'application/json')
                .send(body)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    if (err) {
                        done(err)
                    } else {
                        existing_event_id = res.body.event_id
                        existing_member_code = res.body.member_code
                        existing_candidate_code = res.body.candidate_code
                        done()
                    }
                });
        });

        it('it should add member to event', (done) => {

            let body = {
                event_id: existing_event_id,
                target_id: uid2,
            }

            chai.request(DEV_API_ENDPOINT)
                .post('/event/member_add')
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



        // TODO

        // it('it should add a member', (done) => {

        //     let body = {
        //         member_code: existing_member_code,
        //     }

        //     chai.request(DEV_API_ENDPOINT)
        //         .post('/event/member_join')
        //         .set('Authorization', 'Bearer ' + idToken)
        //         .set('content-type', 'application/json')
        //         .send(body)
        //         .end((err, res) => {
        //             expect(res.statusCode).to.equal(200);
        //             if (err) {
        //                 done(err)
        //             } else {
        //                 done()
        //             }
        //         });
        // });
    });

    /*
    * Test the /GET route
    */
    describe('/GET event', () => {
        it('it should fail to get an event', (done) => {

            chai.request(DEV_API_ENDPOINT)
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
            chai.request(DEV_API_ENDPOINT)
                .get(`/event/${existing_event_id}`)
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

        it('it should successfully get all member events', (done) => {
            chai.request(DEV_API_ENDPOINT)
                .get(`/event/by_member`)
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

    describe('/DELETE event', () => {
        it('it should fail to add an existing member to event', (done) => {

            let body = {
                member_code: existing_member_code,
            }

            chai.request(DEV_API_ENDPOINT)
                .post('/event/member_join')
                .set('Authorization', 'Bearer ' + idToken)
                .set('content-type', 'application/json')
                .send(body)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(404);
                    if (err) {
                        done(err)
                    } else {
                        done()
                    }
                });
        });
        
        it('it should delete member from event', (done) => {
            let body = {
                target_id: uid2,
                event_id: existing_event_id,
            }

            chai.request(DEV_API_ENDPOINT)
                .delete('/event/delete_member')
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

        it('it should delete event', (done) => {
            let body = {
                event_id: existing_event_id,
            }

            chai.request(DEV_API_ENDPOINT)
                .delete('/event/delete')
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
    });

});