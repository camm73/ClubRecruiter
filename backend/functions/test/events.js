var expect  = require("chai").expect;
var request = require("request");
var events = require("../routers/events");


var url = "localhost:5001/recruitme-4b479/us-central1/app"
// var url ="https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha"

describe("Base API", function() {
    it("returns status 200", function(done) {
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        request(url, function(error, response, body) {
            // setTimeout(function(){}, 2000);
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
});