import fs from 'fs'
import _ from "lodash"

const milksPath = "data/milks.json"

class Milk {
  constructor({ id, name, description }) {
    this.id = id
    this.name = name
    this.description = description
  }

  static findAll() {
    const milkData = JSON.parse(fs.readFileSync(milksPath))
    let milks = []
    milkData.forEach(milk => {
      const newMilk = new Milk(milk)
      milks.push(newMilk)
    })
    return milks
  }
}

export default Milk