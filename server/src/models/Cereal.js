import fs from 'fs'
import _ from "lodash"

const cerealsPath = "data/cereals.json"

class Cereal {
  constructor({ id, name, description, sugarContent, deliciousness }) {
    this.id = id
    this.name = name
    this.description = description
    this.sugarContent = sugarContent
    this.deliciousness = deliciousness
  }

  static findAll() {
    const cerealData = JSON.parse(fs.readFileSync(cerealsPath))
    let cereals = []
    cerealData.forEach(cereal => {
      const newCereal = new Cereal(cereal)
      cereals.push(newCereal)
    })
    return cereals
  }

  static findById(id) {
    return this.findAll().find(cereal => cereal.id == id)
  }
}

export default Cereal