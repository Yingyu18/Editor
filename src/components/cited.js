import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { Card } from 'antd';
import './cited.css';
import { Link, BrowserRouter} from 'react-router-dom'
const BASE_URL = 'http://localhost:8000/api'

let cardData = []
const HOME = "http://localhost:3000"
function Cited( {pageName}) {
    useEffect(() => {
        axios.get(`${BASE_URL}/relation/getCited/${pageName}`)
        .then( function (response) {
          cardData = response.data
          console.log("cardData",cardData)
        })
        .catch(function (error) {
          // Handle the error
          console.log("error: ", error)
        });
    },[pageName])

    const handleClick = (page) => {
        // Update the window.location.href dynamically using the page value
        console.log("handle click")
        window.location.href = `${HOME}/?page=${page}`;
      }; 
    return (
    <div>
      <h1>Cited</h1>
      {cardData.map((data, index) => (
        <Card style={{ width: 500}} border = 'false'>
        {/* <BrowserRouter basename={HOME}> */}
        {/* <Link to="localhost:3000"> */}
            <h1 onClick={() => handleClick(data.page)}>{data.page}</h1>
        {/* </Link> */}
        {/* </BrowserRouter> */}
            <p>{data.content}</p>
        </Card>
      ))}
    </div>
    );
}



export default Cited