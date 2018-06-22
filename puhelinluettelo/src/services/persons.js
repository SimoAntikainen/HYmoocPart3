import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'

const getAllPersons = () => {
    return axios.get(baseUrl)
  }
  
const createPerson = (newObject) => {
    return axios.post(baseUrl, newObject)
}

const removePerson = (id, newObject) => {
    return axios.delete(`${baseUrl}/${id}`, newObject)
}

const changePersonNumber = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
}


export default { getAllPersons, createPerson, removePerson, changePersonNumber}
  