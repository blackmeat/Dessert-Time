process.env.NODE_ENV = 'test'

var chai = require('chai')
const { expect } = chai
var sinon = require('sinon')
chai.use(require("sinon-chai"))


const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists
} = require("sequelize-test-helpers")

const db = require('../../models')
const PaymentModel = require('../../models/payment')

describe('# Payment Model', () => {
  before((done) => {
    done()
  })

  const Payment = PaymentModel(sequelize, dataTypes)
  const payment = new Payment()
  checkModelName(Payment)('Payment')

  context('properties', () => {
    [
      'sn', 'amount', 'payment_method', 'OrderId'
    ].forEach(checkPropertyExists(payment))
  })

  context('associations', () => {
    const Order = 'Order'
    before(() => {
      Payment.associate({ Order })
    })

    it('it should belongs to Order', (done) => {
      expect(Payment.belongsTo).to.have.been.calledWith(Order)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('action', (done) => {
      db.Payment.create({}).then((payment) => {
        data = payment
        done()
      })
    })

    it('read', (done) => {
      db.Payment.findByPk(data.id).then((payment) => {
        expect(payment.id).to.be.equal(data.id)
        done()
      })
    })

    it('update', (done) => {
      db.Payment.update({}, { where: { id: data.id } }).then(() => {
        db.Payment.findByPk(data.id).then((payment) => {
          expect(payment.updatedAt).to.be.not.equal(data.updatedAt)
          done()
        })
      })
    })

    it('delete', (done) => {
      db.Payment.destroy({ where: { id: data.id } }).then(() => {
        db.Payment.findByPk(data.id).then((payment) => {
          expect(payment).to.be.equal(null)
          done()
        })
      })
    })
  })
})