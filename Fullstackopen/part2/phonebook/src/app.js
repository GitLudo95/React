import './index.css';

import React, { useState, useEffect } from 'react';
import http from './httplib';

import IconLabelButtons from './iconbuttonlib';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Input from '@material-ui/core/Input';
import Alert from '@material-ui/lab/Alert';

const IconButton = (props) => {
  return(
    <span>
      {IconLabelButtons(props.variant, props.type, props.color, props.text, props.icon, props.handleClick)}
    </span>
  )
}

const StatusBar = (props) => {
  if(props.status) {
    return(
      <Alert variant={props.variant} severity={props.status}>
        {props.text}
      </Alert>
    )
  } else {
    return null;
  }
}

const Form = (props) => {
  const [ nameError, setNameError ] = useState({error : false, message : ''});
  const [ numberError, setNumberError ] = useState({error : false, message : ''});

  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');

  const updateNameInput = (event) => {
    setNameError({error : false, message : ''});
    setNewName(event.target.value);
  }
  const updateNumberInput = (event) => {
    setNumberError({error : false, message : ''});
    setNewNumber(event.target.value);
  }

  function create_UUID(){
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c==='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

  const checkIfNameExists = () => {
    return props.persons.filter((person) => {
      return person.name === newName
    });
  }

  const validateForm = () => {
    let nameIsEmpty = !newName;
    let nameMessage = nameIsEmpty ? 'Field is required' : '';
    let isNameValid = !nameIsEmpty;
    setNameError({error : !isNameValid, message : nameMessage});

    let numberIsEmpty = !newNumber;
    let numberMessage = numberIsEmpty ? 'Field is required' : '';
    let isNumberValid = !(numberIsEmpty);
    setNumberError({error : !isNumberValid, message : numberMessage});
    return (isNameValid && isNumberValid);
  }

  const updateArray = (oldArr, updatedEntry) => {
    let newArr = [...oldArr];
    let i = 0;
    let length = newArr.length;
    for(i; i < length; i++) {
      if(newArr[i].id === updatedEntry.id) {
        newArr[i] = updatedEntry;
        break;
      }
    }
    return newArr;
  }

  const handleSubmit = (event) => {
    const existingPerson = checkIfNameExists();
    event.preventDefault();
    if(validateForm()) {
        if(existingPerson.length > 0 && window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          const updatedPerson = {...existingPerson[0]};
          updatedPerson.number = newNumber;
          http
          .update(updatedPerson.id, updatedPerson)
          .then(returnedPerson => {
            console.log('promise fulfilled', returnedPerson);
            props.setStatus({variant : "filled", status : "success", text : `Succesfully updated ${newName}`});
            setTimeout(() => {         
              props.setStatus({});  
            }, 5000)
            let newPersonList = updateArray(props.persons, returnedPerson);
            props.setPersons(newPersonList);
            props.setSearchResults(props.getSearchResults(newPersonList, props.searchTerm));
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            props.setStatus({variant : "filled", status : "error", text : `Oops something went wrong`});
            setTimeout(() => {         
              props.setStatus({});  
            }, 5000)
          })
        } else if(existingPerson.length === 0) {
          http
          .create({ name : newName, number : newNumber, id : create_UUID() })
          .then(returnedPerson => {
            console.log('promise fulfilled', returnedPerson);
            props.setStatus({variant : "filled", status : "success", text : `Succesfully added ${newName}`});
            setTimeout(() => {         
              props.setStatus({});  
            }, 5000)
            let newPersonList = [...props.persons].concat(returnedPerson);
            props.setPersons(newPersonList);
            props.setSearchResults(props.getSearchResults(newPersonList, props.searchTerm));
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            props.setStatus({variant : "filled", status : "error", text : `Oops something went wrong`});
            setTimeout(() => {         
              props.setStatus({});  
            }, 5000)
          })
      }
    }
  }

  return(
    <form>
      <div>
       <Input error={nameError.error} name='Name' type="text" value={newName} placeholder='name' onChange={updateNameInput}/>
        <div>
          <span className='error'>{nameError.message}</span>
        </div>
      </div>
      <div>
        <Input error={numberError.error} name='Number' type="text" value={newNumber} placeholder='number' onChange={updateNumberInput}/>
        <div>
          <span className='error'>{numberError.message}</span>
        </div>
      </div>
      <div>
      {IconLabelButtons("contained", "submit", "primary", "add", <AddIcon/>, handleSubmit)}
      </div>
    </form>
  )
}

const Search = (props) => {

  const updateSearchInput = (event) => {
    props.setSearchTerm(event.target.value);
    let results = props.getSearchResults(props.persons, event.target.value);
    props.setSearchResults(results);
  }
  
  return(
    <div>
      <Input name='Search' value={props.searchTerm} type="text" placeholder='enter a searchterm' onInput={updateSearchInput}/>
    </div>
  )
}

const Numbers = (props) => {
  
  const removeFromArray = (oldArr, id) => {
    let newArr = [...oldArr];
    let i = 0;
    let length = newArr.length;
    for(i; i < length; i++) {
      if(newArr[i].id === id) {
        newArr.splice(i);
        break;
      }
    }
    return newArr;
  }
  
  const handleDeleteClick = (name, id) => {
    if(window.confirm(`Do you really want to delete ${name}`)) {
      http
      .deleteEntry(id)
      .then(response => {
        console.log('promise fulfilled', response);
        props.setStatus({variant : "filled", status : "success", text : `Succesfully deleted ${name}`});
        setTimeout(() => {         
          props.setStatus({});  
        }, 5000)
        let newPersonList = removeFromArray(props.persons, id);
        props.setPersons(newPersonList);
        props.setSearchResults(props.getSearchResults(newPersonList, props.searchTerm));
      })
      .catch(error => {
        props.setStatus({variant : "filled", status : "error", text : `Oops something went wrong`});
        setTimeout(() => {         
          props.setStatus({});  
        }, 5000)
      })
    }
  }
  
  return(
    <div>
      {props.searchResults.map((person) => {
        return (
          <li 
            key={person.id}>{person.name} {person.number} <IconButton variant="contained" type="button" color="secondary" text="delete" icon={<DeleteIcon/>} handleClick={() => handleDeleteClick(person.name, person.id)} />
          </li>)
      })}
    </div>
  )
}

const App = () => {

  const [ persons, setPersons ] = useState([]);

  const [ status, setStatus ] = useState({});

  useEffect(() => {
    http
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled', initialPersons);
        setStatus({variant : "filled", status : "success", text : "Succesfully retrieved phonebook"});
        setTimeout(() => {         
          setStatus({});  
        }, 5000)
        setPersons(initialPersons);
        setSearchResults(initialPersons);
      })
      .catch(error => {
        setStatus({variant : "filled", status : "error", text : `Oops something went wrong`});
        setTimeout(() => {         
          setStatus({});  
        }, 5000)
      })
  }, [])

  const [ searchResults, setSearchResults ] = useState([...persons]);
  const getSearchResults = (personList, criteria) => personList.filter((person) => person.name.toLowerCase().startsWith(criteria.toLowerCase()));

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <h2>Phonebook</h2>
      <Search persons={persons} setPersons={setPersons} searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchResults={searchResults} setSearchResults={setSearchResults} getSearchResults={getSearchResults} />
      <br></br>
      <Form persons={persons} setPersons={setPersons} searchTerm={searchTerm} searchResults={searchResults} setSearchResults={setSearchResults} getSearchResults={getSearchResults} setStatus={setStatus} />
      <h2>Numbers</h2>
      <Numbers searchResults={searchResults} persons={persons} setPersons={setPersons} searchTerm={searchTerm} setSearchResults={setSearchResults} getSearchResults={getSearchResults} setStatus={setStatus} />
      <StatusBar variant={status.variant} status={status.status} text={status.text} />
    </div>
  )
}

export default App