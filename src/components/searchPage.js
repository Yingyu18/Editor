import { AutoComplete } from 'antd';
import React, { useEffect, useState } from 'react';

const SearchPage = ({pageList, refresh}) => {
    const [value, setValue] = useState('');
    const [options, setOptions] = useState([]);
    const [anotherOptions, setAnotherOptions] = useState([]);
  
    useEffect(() => {
        setValue('')
    }, [refresh]);

    const onSelect = (data) => {
      console.log('onSelect', data);
    };
  
    const onChange = (data) => {
      setValue(data);
    };

    const getPanelValue = (searchText) => {
        let result = []
        const filteredOptions = pageList.filter(option => option.includes(searchText));
        if(filteredOptions.length){
          console.log(typeof filteredOptions)
          return filteredOptions.map(option => ({ value: option }));
        }
        else{
          
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