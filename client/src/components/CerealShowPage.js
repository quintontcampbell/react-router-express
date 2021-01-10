import React, { useState, useEffect } from "react"

import CerealInformation from "./CerealInformation"

const CerealShowContainer = (props) => {
  const [cereal, setCereal] = useState({})
  
  const getCereal = async () => {
    try {
      let cerealId = props.match.params.id
      const response = await fetch(`/api/v1/cereals/${cerealId}`)
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage);
        throw(error);
      }
      const fetchedCereal = await response.json()
      setCereal(fetchedCereal)
    } catch(err) {
      console.error(`Error in fetch: ${err.message}`)
    }
  }

  useEffect(() => {
    getCereal()
  }, [])

  return (<CerealInformation cereal={cereal} />)
}

export default CerealShowContainer
