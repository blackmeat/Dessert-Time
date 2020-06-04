var chai = require('chai')
var expect = chai.expect
var should = chai.should()
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')
var helpers = require('../../helpers')
const db = require('../../models')

describe('# Cart Request', () => {

  context('# GET /cart', () => {
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
      await db.Cart.create({})
      await db.Product.create({})
      await db.CartItem.create({ CartId: 1, ProductId: 1 })
    })

    it('show cart page', (done) => {
      request(app)
        .get('/cart')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })

    after(async () => {
      this.ensureAuthenticated.restore()
      this.getUser.restore()
      this.cartId.restore()
      await db.User.destroy({ where: {}, truncate: true })
      await db.Cart.destroy({ where: {}, truncate: true })
      await db.Product.destroy({ where: {}, truncate: true })
      await db.CartItem.destroy({ where: {}, truncate: true })
    })
  })

  context('# POST /cart', () => {
    before(async () => {
      await db.Cart.create({})
      await db.Product.create({})
      await db.CartItem.create({ CartId: 1, ProductId: 1 })
    })
    it('# create Cart & CartItem', (done) => {
      request(app)
        .post('/cart')
        .set('Accept', 'application/json')
        .expect(302)
        .end((err, res) => {
          if (err) done(err)
          db.Cart.findByPk(1).then((cart) => {
            db.CartItem.findOne({ where: { CartId: 1 } }).then((cartitem) => {
              expect(cart).to.not.be.null
              expect(cartitem).to.not.be.null
              return done()
            })
          })
        })
    })
    after(async () => {
      await db.Cart.destroy({ where: {}, truncate: true })
      await db.Product.destroy({ where: {}, truncate: true })
      await db.CartItem.destroy({ where: {}, truncate: true })
    })
  })
})