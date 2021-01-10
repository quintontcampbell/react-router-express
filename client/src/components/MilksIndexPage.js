import React, { useState, useEffect } from "react"
import { Link } from 'react-router-dom';
import MilkTile from "../components/MilkTile"

const MilksIndexPage = (props) => {
  const [milks, setMilks] = useState([])

   const getMilks = async () => {
    try {
      const response = await fetch("/api/v1/milks")
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage);
        throw(error);
      }
      const fetchedMilks = await response.json()
      setMilks(fetchedMilks)
    } catch(err) {
      console.error(`Error in fetch: ${err.message}`)
    }
  }

  useEffect(() => {
    getMilks()
  }, [])

  const milkTiles = milks.map((milk) => {
    return <MilkTile key={milk.id} milk={milk} />
  })

  return (
    <div className="center-bg">
      <h3 className="so-great">Milks Are Also Great</h3>
      <Link to="/">But so are cereals</Link>
      {milkTiles}
    </div>
  )
}

export default MilksIndexPage
