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

  context('# orders', () => {
    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true)
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1 })
      await db.User.create({})
      await db.Order.create({ sn: '12345678', UserId: 1 })
    })

    it("show users orders page", (done) => {
      request(app)
        .get('/users/orders')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          console.log(res.text)
          res.text.should.include('12345678')
          done()
        })
    })

    after(async () => {
      this.ensureAuthenticated.restore()
      this.getUser.restore()
      await db.User.destroy({ where: {}, truncate: true })
      await db.Order.destroy({ where: {}, truncate: true })
    })
  })

  context('# subscribing', () => {
    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true)
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1 })
      await db.User.create({})
      await db.Product.create({ name: '超值箱' })
      await db.Order.create({ payment_status: '首期授權成功', UserId: 1, ProductId: 1 })
    })

    it('show users subscribing page', (done) => {
      request(app)
        .get('/users/subscribing')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          console.log(res.text)
          if (err) return done(err)
          res.text.should.include('取消訂閱')
          done()
        })
    })

    after(async () => {
      this.ensureAuthenticated.restore()
      this.getUser.restore()
      await db.User.destroy({ where: {}, truncate: true })
      await db.Product.destroy({ where: {}, truncate: true })
      await db.Order.destroy({ where: {}, truncate: true })
    })
  })

  context('# cancel', () => {
    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true)
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1 })
      await db.User.create({})
      await db.Order.create({ UserId: 1 })
    })

    it('show subscribing order cancel page', (done) => {
      request(app)
        .get('/users/1/cancel')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          res.text.should.include('確認訂閱取消')
          done()
        })
    })

    after(async () => {
      this.ensureAuthenticated.restore()
      this.getUser.restore()
      await db.User.destroy({ where: {}, truncate: true })
      await db.Order.destroy({ where: {}, truncate: true })
    })
  })
})
