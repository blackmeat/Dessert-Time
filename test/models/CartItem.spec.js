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
const CartItemModel = require('../../models/cartitem')

describe('# CartItem Model', () => {
  before((done) => {
    done()
  })

  const CartItem = CartItemModel(sequelize, dataTypes)
  const cartitem = new CartItem()
  checkModelName(CartItem)('CartItem')

  context('properties', () => {
    [
      'quantity', 'CartId', 'ProductId'
    ].forEach(checkPropertyExists(cartitem))
  })

  context('associations', () => {
    const Cart = 'Cart'
    const Product = 'Product'

    before(() => {
      CartItem.associate({ Cart })
      CartItem.associate({ Product })
    })

    it('it should belongs to Cart', (done) => {
      expect(CartItem.belongsTo).to.have.been.calledWith(Cart)
      done()
    })
    it('it should belongs to Product', (done) => {
      expect(CartItem.belongsTo).to.have.been.calledWith(Product)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', (done) => {
      db.CartItem.create({}).then((cartitem) => {
        data = cartitem
        done()
      })
    })

    it('read', (done) => {
      db.CartItem.findByPk(data.id).then((cartitem) => {
        expect(cartitem.id).to.be.equal(data.id)
        done()
      })
    })

    it('update', (done) => {
      db.CartItem.update({}, { where: { id: data.id } }).then(() => {
        db.CartItem.findByPk(data.id).then((cartitem) => {
          expect(cartitem.updatedAt).to.be.not.equal(data.updatedAt)
          done()
        })
      })
    })

    it('delete', (done) => {
      db.CartItem.destroy({ where: { id: data.id } }).then(() => {
        db.CartItem.findByPk(data.id).then((cartitem) => {
          expect(cartitem).to.be.equal(null)
          done()
        })
      })
    })
  })
})