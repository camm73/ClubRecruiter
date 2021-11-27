const chai = require('chai');
const chaiHttp = require('chai-http');
var expect = require("chai").expect;
const { DEV_API_ENDPOINT } = require('./constant');
const { init } = require('./common');

require('dotenv').config();

chai.use(chaiHttp);


function events_test(auth, admin){
describe('Events', () => {
    let existing_event_id = null;
    let existing_member_code = null;
    const member_id_3 = 'IAmAMember'
    let idToken1 = null;
    let idToken2 = null;
    before(async () => {
        ({idToken1, idToken2} = await init(auth, admin));
    })
    /*
    * Test the /POST route
    */
    describe('/POST event', () => {
        context('the creator of the event tries to create an event and add members', () => { 
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
    
        })

        context('another user with the member code tries to join the event', () => {
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
        })




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
        
        context('organizer tries to GET a non-existing event id', () => {
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
        })

        context('organizer of the event tries to GET the event', () => {
            it('it should successfully get an event', (done) => {
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
        })

        context('member who joined the event tries to GET the event', () => {
            it('it should successfully get an event', (done) => {
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
        })

        context('user tries to get all their events', () => {
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
    })

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
        
        context ('non-organizer tries to modify event', () => {
            it('it should not delete event', (done) => {
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
        })


        context('organizer tries to modify event', () => {
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
        })

    });

    });


}

module.exports = { events_test };

