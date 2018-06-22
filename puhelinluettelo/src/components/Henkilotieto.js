import React from 'react'

const Henkilotieto = ({name, number, remove}) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{number}</td>
      <td>
        <button onClick={remove}>poista</button>
      </td>
    </tr> 
  )
}

export default Henkilotieto