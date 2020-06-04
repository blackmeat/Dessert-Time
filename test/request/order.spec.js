var chai = require('chai')
var expect = chai.expect
var should = chai.should()
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')
var helpers = require('../../helpers')
const db = require('../../models')

describe('# Order Request', () => {

  context('# GET /order/:id/checkout', () => {
    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true)
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1 })
      await db.User.create({})
      await db.Product.create({ name: '派對箱' })
      await db.Order.create({
        id: 1, subscriber_email: 'ABC@gmail.com', amount: 100, UserId: 1, ProductId: 1
      })
      await db.Order.create({ id: 2, UserId: 2, ProductId: 1 })
    })

    it('show checkout page', (done) => {
      request(app)
        .get('/order/1/checkout')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          res.text.should.include('ABC@gmail.com')
          return done()
        })
    })

    it('redirect users orders page', (done) => {
      request(app)
        .get('/order/2/checkout')
        .set('Accept', 'application/json')
        .expect(302)
        .end((err, res) => {
          if (err) return done(err)
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

  context('# POST /order', () => {
    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true)
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1 })
      this.cartId = sinon.stub(
        helpers, 'cartId'
      ).returns(1)
      await db.User.create({})
    })

    it('create a order', (done) => {
      request(app)
        .post('/order')
        .send('subscriber_email=ABC@gmail.com&payment_status=尚未付款')
        .set('Accept', 'application/json')
        .expect(302)
        .end((err, res) => {
          if (err) return done(err)
          db.Order.findOne({ where: { UserId: 1 } }).then((order) => {
            order.payment_status.should.be.equal('尚未付款')
            order.subscriber_email.should.be.equal('ABC@gmail.com')
            return done()
          })
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