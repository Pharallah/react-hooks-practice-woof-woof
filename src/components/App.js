import React, { useState, useEffect } from "react";

function App() {
  const [dogs, setDogs] = useState([])
  const [showDog, setShowDog] = useState({})

  useEffect(() => {
    fetch("http://localhost:3001/pups")
      .then(res => res.json())
      .then(doggos => setDogs(doggos))
  }, [])

  // On <span> click
  function showInfo(id) {
    const currentDog = dogs.find(dog => dog.id === id)
    setShowDog(currentDog)
  }

  function onClick() {
    const updatedDog = {
      id: showDog.id,
      name: showDog.name,
      isGoodDog: !showDog.isGoodDog,
      image: showDog.image
    }
    fetch(`http://localhost:3001/pups/${showDog.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedDog)
    })
    .then(res => res.json())
    .then(doggo => {
      const newDogsArray = dogs.map(dog => {
        if(dog.id === doggo.id) {
          return doggo
        } else {
          return dog
        }
      })
      setDogs(newDogsArray)
      setShowDog(doggo) //This will cause the JSX conditional rendering to toggle to the new doggo
    })
  }

  const [isFilterOn, setIsFilterOn] = useState(false)

  //On filter button click
  function onFilter() {
    setIsFilterOn(!isFilterOn)
  }

  // DOG BAR DISPLAY
  const displayDoggos = dogs.filter(dog => {
    if(isFilterOn === false) {
      return dog
    } else {
      if(dog.isGoodDog === true) {
        return dog
      }
    }
  })
  .map(dog => {
    return <span
    key={dog.id}
    dog={dog}
    onClick={e => showInfo(dog.id)}
    >{dog.name}</span>
  })
 
  return (
    <div className="App">
      <div id="filter-div">
        <button id="good-dog-filter" onClick={onFilter}>Filter good dogs: {isFilterOn ? "ON" : "OFF"}</button>
      </div>
      <div id="dog-bar">
        {displayDoggos}
      </div>
      <div id="dog-summary-container">
        <h1>DOGGO:</h1>
        <div id="dog-info">
          {Object.keys(showDog).length > 0 ? (<><img src={showDog.image} alt={showDog.name}></img>
          <h2>{showDog.name}</h2>
          <button onClick={onClick}>{showDog.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button></>) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
