const chai = require('chai');
const chaiHttp = require('chai-http');
var expect = require("chai").expect;
const { DEV_API_ENDPOINT } = require('./constant');
const { init } = require('./common');


require('dotenv').config();

chai.use(chaiHttp);

function candidates_test(auth, admin){
describe('Candidates', () => {
    let existing_event_id = null;
    let existing_candidate_code = null;
    let existing_candidate_id = null;
    let idToken1 = null;
    let existing_comment_id = null;
    before(async () => {
        ({idToken1} = await init(auth, admin))
    })

    describe('Candidates - intialization', () => {
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
                    expect(res.body).to.have.property('candidate_id');
                    existing_candidate_id = res.body.candidate_id;
                    if (err) {
                        done(err)
                    } else {
                        done()
                    }
                });
        });

        context('organizer tries to update candidate status', () => {
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
        })
    });

    describe('/GET candidate', () => {
        context('existing candidate code', () => {
            it('it should successfully validate candidate code', (done) => {
                chai.request(DEV_API_ENDPOINT)
                    .get(`/candidate/validate?candidate_code=${existing_candidate_code}`)
                    .set('Authorization', 'Bearer ' + idToken1)
                    .set('content-type', 'application/json')
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body).to.have.property('valid', true)
                        if (err) {
                            done(err)
                        } else {
                            done()
                        }
                    });
            });
        })

        context('non-existing candidate code', () => {
            it('it should fail to validate candidate code', (done) => {
                chai.request(DEV_API_ENDPOINT)
                    .get(`/candidate/validate?candidate_code=bad-candidate-code`)
                    .set('Authorization', 'Bearer ' + idToken1)
                    .set('content-type', 'application/json')
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body).to.have.property('valid', false);
                        if (err) {
                            done(err)
                        } else {
                            done()
                        }
                    });
            });
        })

        context('existing candidate', () => {
            it('it should get candidate info', (done) => {
                chai.request(DEV_API_ENDPOINT)
                    .get(`/candidate/${existing_candidate_id}`)
                    .set('Authorization', 'Bearer ' + idToken1)
                    .set('content-type', 'application/json')
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body).to.have.property('name', 'Candy Date');
                        expect(res.body).to.have.property('biography', 'I am a candy date');
                        expect(res.body).to.have.property('event_id', existing_event_id);
                        expect(res.body).to.have.property('profile_pic_id', 811);
                        expect(res.body).to.have.property('candidate_code', existing_candidate_code);
                        expect(res.body).to.have.property('email', 'candy@date.com');
                        expect(res.body).to.have.property('resume_id', 999);
                        expect(res.body).to.have.property('comments');
                        expect(res.body).to.have.property('application_status');
                        if (err) {
                            done(err)
                        } else {
                            done()
                        }
                    });
            });
        })

        context('non-existing candidate', () => {
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
        })
 
        context('get candidates for existing event', () => {
            it('it should get event candidates', (done) => {
                chai.request(DEV_API_ENDPOINT)
                    .get(`/candidate/by_event/${existing_event_id}`)
                    .set('Authorization', 'Bearer ' + idToken1)
                    .set('content-type', 'application/json')
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body).to.have.property('candidate_ids');
                        expect(res.body.candidate_ids.length).to.equal(1);
                        if (err) {
                            done(err)
                        } else {
                            done()
                        }
                    });
            });
        })

        context('get candidates for non-existing event', () => {
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
        })


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
