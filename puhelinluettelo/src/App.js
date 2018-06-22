import React from 'react';
import Henkilotieto from './components/Henkilotieto'
import FilterLomake from './components/FilterLomake'
import SubmitLomake from './components/SubmitLomake'

import personService from './services/persons'
import './index.css'

const Notification = ({ message, status }) => {
  //console.log("Here", status)
  switch(status) {
    case 'success':
      return (
        <div className="success">
          {message}
        </div>
    )
    case 'removal':
      return (
        <div className="removal">
          {message}
        </div>
    )
    case 'change':
      return (
        <div className="change">
          {message}
        </div>
    )
    default: 
      return null
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      newName: '',
      newNumber: '',
      newMatchedName: '',
      operationMessage: null,
      operation: null
    }
  }

  componentDidMount() {
    //console.log('did mount')
    
      personService.getAllPersons().then(response => {
        //console.log('promise fulfilled', response)
        this.setState({ persons: response.data })
      })

  }

  addPerson = (event) => {
    event.preventDefault()

    const isNameUnique = this.state.persons.find(person => person.name === this.state.newName) 
     //Undefined evaluates to false 
    if(!isNameUnique) {

    const newPerson = {
      name: this.state.newName,
      number: this.state.newNumber
    }
    //console.log("newPerson", newPerson)

    personService.createPerson(newPerson).then(response => {
      this.setState({
        persons: this.state.persons.concat(response.data),
        newName: '',
        newNumber: '',
        operationMessage: `Lisättiin ${response.data.name}`,
        operation: 'success'
      })
      setTimeout(() => {
        this.setState({operationMessage: null, operation: null})
      }, 4000)
    })

    } else {
      this.changeNumber(event)
    }

    //console.log("persoonat", this.state.persons)
  }


  removePerson = (id) => {
    return () => {
      if(window.confirm(`Haluatko poistaa ${this.state.persons.find(n => n.id === id).name}`)) {
      //console.log('remove '+id+'')
      const person = this.state.persons.find(n => n.id === id)
      const changedPerson = { ...person}
      //console.log('changed note ',changedPerson)
      
      personService.removePerson(id, changedPerson)
        .then(response => {
          this.setState({
          persons: this.state.persons.filter(person => person.id != id),
          operationMessage: `poistettiin ${changedPerson.name}`,
          operation: 'removal'
          })
          setTimeout(() => {
            this.setState({operationMessage: null, operation: null})
          }, 4000)
        })
      }
    }  
  }

  changeNumber = (event) => {
    const person = this.state.persons.find(person => person.name === this.state.newName)
    if(window.confirm(` ${person.name} jo luettelossa, korvataanko numero uudella?`)) {
    
    const changedPerson = { ...person, number: this.state.newNumber}
    const idOfChangedPerson = person.id

    personService.changePersonNumber(idOfChangedPerson, changedPerson)
      .then(response => {
        //console.log("response", response)
        this.setState({
          persons: this.state.persons.map(person => person.id !== idOfChangedPerson ? person : response.data),
          newName: '',
          newNumber: '',
          operationMessage: `muutettiin ${response.data.name} numero`,
          operation: 'change'
        })
        setTimeout(() => {
          this.setState({operationMessage: null, operation: null})
        }, 4000)
      })
      .catch(error => {
        this.addRemoved()       
      })
    }  
  }
  /**
   * The error case in 2.19 is handled by adding the crediantants
   * back to the database and by retrieving all the entiries
   * from the database.
   */

  addRemoved = () => {
    //console.log("laaaaaaaaa")
    const newPerson = {
      name: this.state.newName,
      number: this.state.newNumber
    }
    //console.log("newPerson", newPerson)

    personService.createPerson(newPerson).then(response => {
      this.setState({
        newName: '',
        newNumber: '',
        operationMessage: `Lisättiin ${response.data.name}`,
        operation: 'success'
      })
      setTimeout(() => {
        this.setState({operationMessage: null, operation: null})
      }, 4000)
    }).then(response => {this.componentDidMount()} )
    //console.log("laaaaaaaaa")
  }



  handleNameChange = (event) => {
    //console.log(event.target.value)
    this.setState({ newName: event.target.value })
  }

  handleNumberChange = (event) => {
    //console.log(event.target.value)
    this.setState({ newNumber: event.target.value })
  }

  handleNameMatch = (event) => {
    //console.log(event.target.value)
    this.setState({ newMatchedName: event.target.value})
  }

  render() {
    
    const showPhoneNumbers = this.state.persons.filter(
      person => person.name.toLowerCase().includes(this.state.newMatchedName.toLowerCase()))

    return (
      <div>
        <h2>Puhelinluettelo</h2>
        <Notification message={this.state.operationMessage} status={this.state.operation}/>
          <div>
            <FilterLomake value={this.state.newMatchedName}
                    onChange={this.handleNameMatch}/>
            <h3>Lisää uusi</h3>
          </div>
          <SubmitLomake onSubmit={this.addPerson} 
            value1={this.state.newName} onChange1={this.handleNameChange} 
            value2={this.state.newNumber} onChange2={this.handleNumberChange}/>
        <h3>Numerot</h3>
        <div>
          <table>
            <tbody>
              {showPhoneNumbers.map(person => <Henkilotieto key={person.id} 
                name={person.name} number={person.number} remove={this.removePerson(person.id)}/>)}
            </tbody>
          </table> 
        </div> 
      </div>
    )
  }
}

export default App
