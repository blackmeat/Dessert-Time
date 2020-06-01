process.env.NODE_ENV = 'test'

var chai = require('chai')
var sinon = require('sinon')
chai.use(require('sinon-chai'))

const { expect } = require('chai')

const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists,
} = require('sequelize-test-helpers')

const db = require('../../models')
const OrderModel = require('../../models/order')

describe('# Order Model', () => {
  before((done) => {
    done()
  })

  const Order = OrderModel(sequelize, dataTypes)
  const order = new Order()
  checkModelName(Order)('Order')

  context('properties', () => {
    [
      'sn', 'UserId', 'ProductId'
    ].forEach(checkPropertyExists(order))
  })

  context('associations', () => {
    const Payment = 'Payment'
    const User = 'User'
    const Product = 'Product'

    before(() => {
      Order.associate({ Payment })
      Order.associate({ User })
      Order.associate({ Product })
    })

    it('it should has many Payment', (done) => {
      expect(Order.hasMany).to.have.been.calledWith(Payment)
      done()
    })
    it('it should belongs to User', (done) => {
      expect(Order.belongsTo).to.have.been.calledWith(User)
      done()
    })
    it('it should belongs to Product', (done) => {
      expect(Order.belongsTo).to.have.been.calledWith(Product)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', (done) => {
      db.Order.create({}).then((order) => {
        data = order
        done()
      })
    })

    it('read', (done) => {
      db.Order.findByPk(data.id).then((order) => {
        expect(order.id).to.be.equal(data.id)
        done()
      })
    })

    it('update', (done) => {
      db.Order.update({}, { where: { id: data.id } }).then(() => {
        db.Order.findByPk(data.id).then((order) => {
          expect(order.updatedAt).to.be.not.equal(data.updatedAt)
          done()
        })
      })
    })

    it('delete', (done) => {
      db.Order.destroy({ where: { id: data.id } }).then(() => {
        db.Order.findByPk(data.id).then((order) => {
          expect(order).to.be.equal(null)
          done()
        })
      })
    })
  })
})