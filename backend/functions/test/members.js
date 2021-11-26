const { getAuth, signInWithCustomToken, connectAuthEmulator } = require('firebase/auth')
const chai = require('chai');
const chaiHttp = require('chai-http');
var expect = require("chai").expect;
const { DEV_API_ENDPOINT } = require('./constant');

require('dotenv').config();

chai.use(chaiHttp);


function members_test(auth, admin){
    let existing_event_id = null;
    let existing_member_code = null;
    const uid1 = 'test-uid-1';
    const uid2 = 'test-uid-2';
    let customToken1 = null;
    let customToken2 = null;
    let idToken1 = null;
    let idToken2 = null;
    before(async () => {
        try {
            customToken1 = await admin.auth().createCustomToken(uid1);
            customToken2 = await admin.auth().createCustomToken(uid2);
            // const auth = getAuth(firebaseApp)
            // connectAuthEmulator(auth, "http://localhost:9099")
            console.log("connected")
            const response1  = await signInWithCustomToken(auth, customToken1)
            console.log("signed in")
            idToken1 = response1.user.accessToken
            const response2  = await signInWithCustomToken(auth, customToken2)
            idToken2 = response2.user.accessToken
        } catch (error) {
            console.log("failed!")
            console.log(error);
        }
        
    })
    describe('Member - intialization', () => {
        it('it should create an event', (done) => {

            let body = {
                event_name: "The event",
                event_description: "Event desc",
                event_cover_pic_id: "Coverpic id"
            }

            chai.request(DEV_API_ENDPOINT)
                .post('/event/create')
                .set('Authorization', 'Bearer ' + idToken1)
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

        it('it should be able to join the event', (done) => {

            let body = {
                member_code: existing_member_code,
            }

            chai.request(DEV_API_ENDPOINT)
                .post('/event/member_join')
                .set('Authorization', 'Bearer ' + idToken2)
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

   describe('/GET member', () => {
        it('it should get a member', (done) => {

            chai.request(DEV_API_ENDPOINT)
                .get(`/member/${uid1}`)
                .set('Authorization', 'Bearer ' + idToken1)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    if (err) {
                        done(err)
                    } else {
                        done()
                    }
                });
        });

         it('it should fail to get a member', (done) => {
            chai.request(DEV_API_ENDPOINT)
                .get(`/member/non-existent-uid`)
                .set('Authorization', 'Bearer ' + idToken1)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(404);
                    if (err) {
                        done(err)
                    } else {
                        done()
                    }
                });
        });
    });

    describe('/POST member', () => {
        it('it should promote member in event', (done) => {

            let body = {
                target_id: uid2,
                event_id: existing_event_id,
            }

            chai.request(DEV_API_ENDPOINT)
                .post('/member/promote')
                .set('Authorization', 'Bearer ' + idToken1)
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

        it('it should demote member in event', (done) => {

            let body = {
                target_id: uid2,
                event_id: existing_event_id,
            }

            chai.request(DEV_API_ENDPOINT)
                .post('/member/demote')
                .set('Authorization', 'Bearer ' + idToken1)
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

        it('it should delete member from event', (done) => {

            let body = {
                event_id: existing_event_id,
            }

            chai.request(DEV_API_ENDPOINT)
                .post(`/member/delete/${uid2}`)
                .set('Authorization', 'Bearer ' + idToken1)
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

}

module.exports = { members_test };