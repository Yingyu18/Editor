import { AutoComplete } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
const BASE_URL = 'http://localhost:8000/api'

const SearchPage = ({pageList, clear, refresh, changePage, handleOk}) => {
    const [value, setValue] = useState('');
    const [options, setOptions] = useState([]);
    const [anotherOptions, setAnotherOptions] = useState([]);
    const [newPage, setNewPage] = useState(0)
    useEffect(() => {
        setValue('')
    }, [clear]);

    const onSelect = (data) => {
      console.log('onSelect', data);
      if(newPage){
        //TODO: create new page
        const requestBody = {
          pageName: data
        };
        axios.post(`${BASE_URL}/page/create`, requestBody)
          .then( function (response) {
            console.log(response)
            refresh()
          })
          .catch(function (error) {
            // Handle the error
            console.error(error)
          });
      }
      changePage(data)
      handleOk()
    };
  
    const onChange = (data) => {
      setValue(data);
    };

    const getPanelValue = (searchText) => {
        let result = []
        const filteredOptions = pageList.filter(option => option.includes(searchText));
        if(filteredOptions.length){
          setNewPage(0)
          return filteredOptions.map(option => ({ value: option }));
        }
        else{
          //new page
          setNewPage(1)
          return [{value:searchText}]
        } 
    };

    return (
      <>
        <AutoComplete
          value={value}
          options={anotherOptions}
          style={{ width: 200 }}
          onSelect={onSelect}
          onSearch={(text) => setAnotherOptions(getPanelValue(text))}
          onChange={onChange}
          placeholder="select or create new page"
        />
      </>
    );
  };
  
export default SearchPage