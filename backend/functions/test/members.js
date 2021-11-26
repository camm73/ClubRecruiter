const chai = require('chai');
const chaiHttp = require('chai-http');
var expect = require("chai").expect;
const { DEV_API_ENDPOINT } = require('./constant');
const { init } = require('./common');

require('dotenv').config();

chai.use(chaiHttp);


function members_test(auth, admin){
describe('Members', () => {
    let existing_event_id = null;
    let existing_member_code = null;
    const uid1 = 'test-uid-1';
    const uid2 = 'test-uid-2';
    let idToken1 = null;
    let idToken2 = null;
    before(async () => {
        ({idToken1, idToken2} = await init(auth, admin));
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
    });

}

module.exports = { members_test };