import React from 'react'

const Filterlomake = ({value, onChange}) => {
    return (
        <div>
          rajaa näytettävä: <input 
            value={value}
            onChange={onChange}
            />
      </div>
    )
  }

export default Filterlomake