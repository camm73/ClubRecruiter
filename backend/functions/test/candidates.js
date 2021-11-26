const { getAuth, signInWithCustomToken, connectAuthEmulator } = require('firebase/auth')
const chai = require('chai');
const chaiHttp = require('chai-http');
var expect = require("chai").expect;
const { DEV_API_ENDPOINT } = require('./constant');

require('dotenv').config();

chai.use(chaiHttp);

function candidates_test(auth, admin){
describe('Candidates', () => {
    let existing_event_id = null;
    let existing_member_code = null;
    let existing_candidate_code = null;
    let existing_candidate_id = null;
    const uid1 = 'test-uid-1';
    const uid2 = 'test-uid-2';
    const member_id_3 = 'IAmAMember'
    let customToken1 = null;
    let customToken2 = null;
    let idToken1 = null;
    let idToken2 = null;
    before(async () => {
        try {
            customToken1 = await admin.auth().createCustomToken(uid1);
            customToken2 = await admin.auth().createCustomToken(uid2);
            console.log("connected")
            const response1  = await signInWithCustomToken(auth, customToken1)
            console.log("signed in")
            idToken1 = response1.user.accessToken
            const response2  = await signInWithCustomToken(auth, customToken2)
            idToken2 = response2.user.accessToken
            let body = {
                event_name: "The event",
                event_description: "Event desc",
                event_cover_pic_id: "Coverpic id"
            }
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
    })

    describe('/POST candidate', () => {
        it('it should add candidate to event', (done) => {
            let body = {
                candidate_code: existing_candidate_code,
                email: 'candy@date.com',
                name: 'Candy Date',
                phone_number: 12345,
                biography: 'I am a candy date',
                resume_id: 999,
                profile_pic_id: 811,
            }

            chai.request(DEV_API_ENDPOINT)
                .post('/candidate/apply')
                .set('Authorization', 'Bearer ' + idToken1)
                .set('content-type', 'application/json')
                .send(body)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    existing_candidate_id = res.body.candidate_id;
                    console.log("candidate id")
                    console.log(existing_candidate_code)
                    if (err) {
                        done(err)
                    } else {
                        done()
                    }
                });
        });

        it('it should update candidate status to rejected', (done) => {
            let body = {
                status: 'rejected',
                candidate_id: existing_candidate_id,
            }

            chai.request(DEV_API_ENDPOINT)
                .post('/candidate/status')
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
 
        it('it should update candidate status to pending', (done) => {
            let body = {
                status: 'pending',
                candidate_id: existing_candidate_id,
            }

            chai.request(DEV_API_ENDPOINT)
                .post('/candidate/status')
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
 
        it('it should update candidate status to accepted', (done) => {
            let body = {
                status: 'accepted',
                candidate_id: existing_candidate_id,
            }

            chai.request(DEV_API_ENDPOINT)
                .post('/candidate/status')
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

         it('it should fail to update candidate status', (done) => {
            let body = {
                status: 'an invalid status',
                candidate_id: existing_candidate_id,
            }

            chai.request(DEV_API_ENDPOINT)
                .post('/candidate/status')
                .set('Authorization', 'Bearer ' + idToken1)
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
    });

    describe('/GET candidate', () => {
        it('it should successfully validate candidate code', (done) => {
            chai.request(DEV_API_ENDPOINT)
                .get(`/candidate/validate?candidate_code=${existing_candidate_code}`)
                .set('Authorization', 'Bearer ' + idToken1)
                .set('content-type', 'application/json')
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.valid).to.equal(true);
                    if (err) {
                        done(err)
                    } else {
                        done()
                    }
                });
        });

        it('it should fail to validate candidate code', (done) => {
            chai.request(DEV_API_ENDPOINT)
                .get(`/candidate/validate?candidate_code=bad-candidate-code`)
                .set('Authorization', 'Bearer ' + idToken1)
                .set('content-type', 'application/json')
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.valid).to.equal(false);
                    if (err) {
                        done(err)
                    } else {
                        done()
                    }
                });
        });

        it('it should get candidate info', (done) => {
            chai.request(DEV_API_ENDPOINT)
                .get(`/candidate/${existing_candidate_id}`)
                .set('Authorization', 'Bearer ' + idToken1)
                .set('content-type', 'application/json')
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.name).to.equal('Candy Date');
                    if (err) {
                        done(err)
                    } else {
                        done()
                    }
                });
        });

        it('it should fail to get candidate info', (done) => {
            chai.request(DEV_API_ENDPOINT)
                .get(`/candidate/nosuchcandidate`)
                .set('Authorization', 'Bearer ' + idToken1)
                .set('content-type', 'application/json')
                .end((err, res) => {
                    expect(res.statusCode).to.equal(404);
                    if (err) {
                        done(err)
                    } else {
                        done()
                    }
                });
        });
 
        it('it should get event candidates', (done) => {
            chai.request(DEV_API_ENDPOINT)
                .get(`/candidate/by_event/${existing_event_id}`)
                .set('Authorization', 'Bearer ' + idToken1)
                .set('content-type', 'application/json')
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.candidate_ids.length).to.equal(1);
                    if (err) {
                        done(err)
                    } else {
                        done()
                    }
                });
        });

        it('it should fail to get event candidates', (done) => {
            chai.request(DEV_API_ENDPOINT)
                .get(`/candidate/by_event/nosuchevent`)
                .set('Authorization', 'Bearer ' + idToken1)
                .set('content-type', 'application/json')
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

    describe('/DELETE candidate', () => {
        it('it should delete candidate', (done) => {

            let body = {
                candidate_id: existing_candidate_id,
            }

            chai.request(DEV_API_ENDPOINT)
                .delete('/candidate/delete')
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

});}

module.exports = { candidates_test };
