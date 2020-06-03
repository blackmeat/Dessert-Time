var chai = require('chai')
var should = chai.should()
var sinon = require('sinon')
var request = require('supertest')
var helpers = require('../../helpers')
var app = require('../../app')
const db = require('../../models')

describe('# Product Request', () => {
  context('# GET /products', () => {
    before(async () => {
      await db.Product.create({ english_name: 'Party Box' })
    })

    it('show products page', (done) => {
      request(app)
        .get('/products')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          res.text.should.include('Party Box')
          res.text.should.include('如何開始訂閱？')
          res.text.should.include('選擇適合的方案')
          done()
        })
    })

    after(async () => {
      await db.Product.destroy({ where: {}, truncate: true })
    })
  })

  context('# GET /products/explain', () => {
    it('show products explian page', (done) => {
      request(app)
        .get('/products/explain')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          res.text.should.include('什麼是零食訂閱？')
          res.text.should.include('超值箱')
          res.text.should.include('饗樂箱')
          res.text.should.include('派對箱')
          done()
        })
    })
  })

  context('# GET /products/subscribe', () => {
    before(async () => {
      await db.Product.create({ english_name: 'Party Box' })
    })

    it('show proudcts subscribe page', (done) => {
      request(app)
        .get('/products/subscribe')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          res.text.should.include('選擇方案')
          res.text.should.include('登入帳號')
          res.text.should.include('收件資訊')
          res.text.should.include('前往結帳')
          res.text.should.include('選擇適合您的方案')
          res.text.should.include('Party Box')
          done()
        })
    })

    after(async () => {
      await db.Product.destroy({ where: {}, truncate: true })
    })
  })
})