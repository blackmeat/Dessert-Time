var chai = require('chai')
var expect = chai.expect
var should = chai.should()
var sinon = require('sinon')
var request = require('supertest')
var app = require('../../app')
var helpers = require('../../helpers')
const db = require('../../models')

describe('# user request', () => {

  context('# profile', () => {
    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1 });
      await db.User.create({})
      await db.User.create({})
    })

    it('show users profile page', (done) => {
      request(app)
        .get('/users/1/profile')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          res.text.should.include('個人資料')
          return done();
        });
    })

    it('redirect users own page', (done) => {
      request(app)
        .get('/users/2/profile')
        .set('Accept', 'application/json')
        .expect(302)
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
    })

    after(async () => {
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.User.destroy({ where: {}, truncate: true })
    })
  })


})
