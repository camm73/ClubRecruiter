const { getAuth, signInWithCustomToken, connectAuthEmulator } = require('firebase/auth')
const chai = require('chai');
const chaiHttp = require('chai-http');
var expect = require("chai").expect;
const { DEV_API_ENDPOINT } = require('./constant');

require('dotenv').config();

chai.use(chaiHttp);

function candidates_test(firebaseApp, admin, callback){
describe('Candidates', () => {
    let existing_event_id = null;
    let existing_member_code = null;
    let existing_candidate_code = null;
    let new_candidate_id = null;
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
            const auth = getAuth(firebaseApp)
            connectAuthEmulator(auth, "http://localhost:9099")
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

            chai.request(DEV_API_ENDPOINT)
                .post('/event/create')
                .set('Authorization', 'Bearer ' + idToken1)
                .set('content-type', 'application/json')
                .send(body)
                .end((err, res) => {
                    if (err) {
                    } else {
                        existing_event_id = res.body.event_id
                        existing_member_code = res.body.member_code
                        existing_candidate_code = res.body.candidate_code
                        console.log(existing_candidate_code)
                        console.log(existing_event_id)

                    }
                });
        } catch (error) {
            console.log("failed!")
            console.log(error);
        }
        
    })
    /*
    * Test the /candidate/validate route
    */
    describe('GET/candidate/validate',() =>{
        it('should return valid:true given a valid candidate code',(done) => {
            chai.request(DEV_API_ENDPOINT)
                .get('/candidate/validate?candidate_code=' + existing_candidate_code)
                .set('Authorization', 'Bearer ' + idToken1)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    console.log(res.body)
                    expect(res.body.valid).to.equal(true);
                    if (err) {
                        done(err)
                    } else {
                        done()
                    }
                })
        })
        it('should return valid:false given an invalid candidate code',(done) => {
            chai.request(DEV_API_ENDPOINT)
                .get('/candidate/validate?candidate_code=abcdacaca')
                .set('Authorization', 'Bearer ' + idToken1)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.valid).to.equal(false);
                    if (err) {
                        done(err)
                    } else {
                        done()
                    }
                })
        })
    })

    describe('POST /candidate/apply', () =>{
        let body = {
            candidate_code: existing_candidate_code,
            email: "billie@gmail.com",
            name: "billie",
            phone_number: "123123",
            biography: "i'm not michael's lover :(",
            resume_id: "123",
            profile_pic_id: "234"
        }
        it('should receive candidate_id 200 OK given valid candidate_code',(done)=>{
            chai.request(DEV_API_ENDPOINT)
            .post('/candidate/apply')
            .set('Authorization', 'Bearer ' + idToken1)
            .set('content-type', 'application/json')
            .send(body)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                /*TODO, res body not returning candidate_id despite status code being 200, 
                either request is invalid or API does not work as specified.
                Tested on postman still no returned res body*/
                expect(res.body).to.have.property('candidate_id');
                new_candidate_id = res.body.candidate_id
            })
        })
    })

    describe('GET /candidate/:candidate_id', () =>{
        it('should receive candidate data 200 OK given valid candidate_id',(done)=>{
            chai.request(DEV_API_ENDPOINT)
            .get('/candidate/' + new_candidate_id)
            .set('Authorization', 'Bearer ' + idToken1)
            .end((err,res) => {
                expect(res.statusCode).to.equal(200);
                //TODO uncertain what the response body looks like
                expect(res.body).to.have.property('something');
            })

        })
    })

    describe('POST /candidate/status', () =>{
        it('should receive 200 OK given valid candidate_id',(done)=>{
            chai.request(DEV_API_ENDPOINT)
            .get('/candidate/status?status=accepted&candidate_id=' + new_candidate_id)
            .set('Authorization', 'Bearer ' + idToken1)
            .end((err,res) => {
                expect(res.statusCode).to.equal(200);
            })
        })
    })

    describe('GET /by_event/:event_id', () =>{
        it('should receive 200 OK and the newly added candidate given valid event_id',(done)=>{
            chai.request(DEV_API_ENDPOINT)
            .get('/b_event/' + existing_event_id)
            .set('Authorization', 'Bearer ' + idToken1)
            .end((err,res) => {
                expect(res.statusCode).to.equal(200);
                //TODO check if new_candidate_id is amongst the body
            })
        })
    })
});}

module.exports = { candidates_test };
