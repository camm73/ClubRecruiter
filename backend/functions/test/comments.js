const chai = require('chai');
const chaiHttp = require('chai-http');
var expect = require("chai").expect;
const { DEV_API_ENDPOINT } = require('./constant');
const { init } = require('./common');


require('dotenv').config();

chai.use(chaiHttp);

function comments_test(auth, admin){
describe('Comments', () => {
    let existing_event_id = null;
    let existing_candidate_code = null;
    let existing_candidate_id = null;
    let idToken1 = null;
    let existing_comment_id = null;
    before(async () => {
        ({idToken1} = await init(auth, admin))
    })


    describe('Comment initialization', () => {
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
                    if (err) {
                        done(err)
                    } else {
                        done()
                    }
                });
        });
    });

    describe('/POST comment', () => {
        it('it should add comment to candidate in event', (done) => {
            let body = {
                candidate_id: existing_candidate_id,
                event_id: existing_event_id,
                comment: 'Decent person',
            }

            chai.request(DEV_API_ENDPOINT)
                .post('/comment/add')
                .set('Authorization', 'Bearer ' + idToken1)
                .set('content-type', 'application/json')
                .send(body)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.have.property('comment_id');
                    existing_comment_id = res.body.comment_id;
                    if (err) {
                        done(err)
                    } else {
                        done()
                    }
                });
        });
    });

    describe('/GET comment', () => {
        it('it should get comment', (done) => {

            chai.request(DEV_API_ENDPOINT)
                .get(`/comment/${existing_comment_id}`)
                .set('Authorization', 'Bearer ' + idToken1)
                .set('content-type', 'application/json')
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.have.property('comment')
                    if (err) {
                        done(err)
                    } else {
                        done()
                    }
                });
        });

        it('it should get list of comments for candidate', (done) => {

            chai.request(DEV_API_ENDPOINT)
                .get(`/comment/by_candidate/${existing_candidate_id}`)
                .set('Authorization', 'Bearer ' + idToken1)
                .set('content-type', 'application/json')
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.have.property('comment_ids');
                    expect(res.body.comment_ids.length).to.equal(1);
                    if (err) {
                        done(err)
                    } else {
                        done()
                    }
                });
        });

    });

    describe('/POST comment', () => {
        it('it should delete comment', (done) => {

            let body = {
                comment_id: existing_comment_id
            };

            chai.request(DEV_API_ENDPOINT)
                .post(`/comment/delete`)
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
    })
})
}

module.exports = { comments_test }