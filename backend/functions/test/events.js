const { getAuth, signInWithCustomToken, connectAuthEmulator } = require('firebase/auth')
const chai = require('chai');
const chaiHttp = require('chai-http');
var expect = require("chai").expect;
const { DEV_API_ENDPOINT } = require('./constant');

require('dotenv').config();

chai.use(chaiHttp);


function events_test(auth, admin){
describe('Events', () => {
    let existing_event_id = null;
    let existing_member_code = null;
    let existing_candidate_code = null;
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
                .set('Authorization', 'Bearer ' + idToken1)
                .set('content-type', 'application/json')
                .send(body)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    if (err) {
                        done(err)
                    } else {
                        expect(res.body).to.have.property('event_id')
                        existing_event_id = res.body.event_id
                        expect(res.body).to.have.property('member_code')
                        existing_member_code = res.body.member_code
                        expect(res.body).to.have.property('candidate_code')
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
                        expect(res.body).to.have.property('event_id', existing_event_id)
                        done()
                    }
                });
        });


        it('it should add member to event', (done) => {

            let body = {
                event_id: existing_event_id,
                target_id: member_id_3,
            }

            chai.request(DEV_API_ENDPOINT)
                .post('/event/member_add')
                .set('Authorization', 'Bearer ' + idToken1)
                .set('content-type', 'application/json')
                .send(body)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    if (err) {
                        done(err)
                    } else {
                        expect(res.body).to.have.property('event_id', existing_event_id)
                        done()
                    }
                });
        });



        // TODO

        // it('it should add a member', (done) => {

        //     let body = {
        //         member_code:  existing_member_code,
        //     }

        //     chai.request(DEV_API_ENDPOINT)
        //         .post('/event/member_join')
        //         .set('Authorization', 'Bearer ' + idToken1)
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
        // TODO: test promotion/demotion

        it('it should fail to get an event', (done) => {

            chai.request(DEV_API_ENDPOINT)
                .get('/event/asdf')
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


        it('it should successfully get an event (creater of event)', (done) => {
            chai.request(DEV_API_ENDPOINT)
                .get(`/event/${existing_event_id}`)
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

        it('it should successfully get an event (member who joined event)', (done) => {
            chai.request(DEV_API_ENDPOINT)
                .get(`/event/${existing_event_id}`)
                .set('Authorization', 'Bearer ' + idToken2)
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
    });

    describe('/DELETE event', () => {
        it('it should fail to add an existing member to event', (done) => {

            let body = {
                member_code:  existing_member_code,
            }

            chai.request(DEV_API_ENDPOINT)
                .post('/event/member_join')
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
        
        it('it should delete member from event', (done) => {
            let body = {
                target_id: member_id_3,
                event_id: existing_event_id,
            }

            chai.request(DEV_API_ENDPOINT)
                .delete('/event/delete_member')
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

        it('it should not delete event (non-organizer)', (done) => {
            let body = {
                event_id: existing_event_id,
            }

            chai.request(DEV_API_ENDPOINT)
                .delete('/event/delete')
                .set('Authorization', 'Bearer ' +  idToken2)
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


        it('it should delete event', (done) => {
            let body = {
                event_id: existing_event_id,
            }

            chai.request(DEV_API_ENDPOINT)
                .delete('/event/delete')
                .set('Authorization', 'Bearer ' +  idToken1)
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

        it('it should be unable to see deleted event', (done) => {

            chai.request(DEV_API_ENDPOINT)
                .get(`/event/${existing_event_id}`)
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

    });


}

module.exports = { events_test };

