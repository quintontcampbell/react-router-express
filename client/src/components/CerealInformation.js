import React from 'react';

const CerealInformation = props => {
  return(
    <div>
      <h2 className="cereal-name">{props.cereal.name}</h2>
      <p>{props.cereal.description}</p>
      <h3>Sugar Content: {props.cereal.sugarContent}</h3>
      <h3>Deliciousness: {props.cereal.deliciousness}</h3>
    </div>
  )
}

export default CerealInformation;
