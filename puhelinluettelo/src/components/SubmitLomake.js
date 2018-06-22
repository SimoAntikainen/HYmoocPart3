import React from 'react'

const SubmitLomake = (props) => {
    const {onSubmit, value1, onChange1, value2, onChange2} = props 
    return (
        <form onSubmit={onSubmit}>
          <div>
            nimi: <input 
                    value={value1}
                    onChange={onChange1}
                     />
          </div>
          <div>
            numero: <input 
                    value={value2}
                    onChange={onChange2}
                     />
          </div>
          <div>
            <button type="submit">lisää</button>
          </div>
        </form>
    )
  }

export default SubmitLomake