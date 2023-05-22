import React, { useState, useRef, useEffect, useLayoutEffect  } from 'react';
//import ReactDOM from 'react-dom';
var Remarkable = require('react-remarkable');

// 用 useRef
function Editor() {
  const [markdown, setMarkdown] = useState('');
  const [elements, setElements] = useState([]);
  const [currentEditingIndex, setCurrentEditingIndex] = useState(-1);
  // const textareaRefs = useRef([]);
  // const textareaRef = useRef(null);

  useLayoutEffect(() => {
    const newElement = "";
    setElements([...elements, newElement]);
    setCurrentEditingIndex(0)
  }, []);

  useEffect(() => {
    console.log(currentEditingIndex)
  }, [currentEditingIndex]);
  
  //add new line
  const handleInsert = (index) => {
    const newElement = "";
    setElements([
      ...elements.slice(0, index),
      newElement,
      ...elements.slice(index)
    ]);
  };
  const handleDelete = (index) => {
    const updatedElements = [...elements];
    updatedElements.splice(index, 1);
    setElements(updatedElements);
    if(currentEditingIndex>0){
      setCurrentEditingIndex(currentEditingIndex-1)
    }
  };
  const handleKeyDown = (event, index) => {
      if (event.key == 'Enter') {
        handleInsert(index+1)
        setCurrentEditingIndex(currentEditingIndex+1)
        console.log(currentEditingIndex)
      }
      if (event.key == 'Backspace') {
        // TODO : handle delete element
        if(elements.length>1){
          console.log("delete from ", elements.length, " elements")
          handleDelete(index)
        }
        // setCurrentEditingIndex(currentEditingIndex+1)
      }
      if (event.key === 'ArrowUp' && index > 0) {
        event.preventDefault();
        setCurrentEditingIndex(currentEditingIndex-1)
      } else if (event.key === 'ArrowDown' && index < elements.length-1) {
        event.preventDefault();
        setCurrentEditingIndex(currentEditingIndex+1)
      }
  };
  const handleElementChange = (index, value) => {
    const updatedElements = [...elements];
    updatedElements[index] = value;
    setElements(updatedElements);
  };

  // const handleTextareaRef = (element, index) => {
  //   textareaRefs.current[index] = element;
  //   console.log("set Ref ", index)
  //   console.log(textareaRefs)
  // };
  return (
    <div>
    { elements.length === 0 ? (<textarea></textarea>) : (
    <div>
      {elements.map((element, index) => (
        console.log("index: ", index, "currentEdit: ", currentEditingIndex),
        <div key={index}>
          { index === currentEditingIndex ? (
            <textarea 
              autoFocus
              value={element}
              onKeyDown={(event) => handleKeyDown(event, index)}
              style={{ border: 'none', resize: 'none', outline: 'none' }} 
              onChange={(e) => handleElementChange(index, e.target.value)}
              onBlur={() => setCurrentEditingIndex(-1)}
              //ref={(element) => handleTextareaRef(element)} 
              //onclick={setCurrentEditingIndex(index)} 這句會造成瘋狂render 而報錯
              //ref={(element) => handleTextareaRef(element, index)}
            />       
          ) : (
            <div 
              key={index}
              onClick={()=>{
              setCurrentEditingIndex(index);}}
            >
              <Remarkable>{element}</Remarkable>
            </div>
          )}    
       </div>
      ))}
    </div>
    )}
    </div>
  )
};
// popup menu + scrollBar 
const Toggle = () => {
  const contentRef = useRef(null);

  const handleInput = () => {
    const content = contentRef.current;
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const text = range.startContainer.textContent;
      const lastWord = text.substring(0, range.startOffset).split(' ').pop();

      if (lastWord === '/') {
        const rect = range.getBoundingClientRect();
        const blockSelector = document.getElementById('block-selector');

        blockSelector.style.top = `${rect.bottom}px`;
        blockSelector.style.left = `${rect.left}px`;
        blockSelector.style.display = 'block';
      } else {
        document.getElementById('block-selector').style.display = 'none';
      }
    }
  };

  return (
    <div>
      <div
        ref={contentRef}
        contentEditable="true"
        onInput={handleInput}
        style={{ border: '1px solid #ccc', minHeight: '100px', padding: '10px' }}
      ></div>
      <div
        id="block-selector"
        style={{
          display: 'none',
          position: 'absolute',
          border: '1px solid #ccc',
          padding: '10px',
          width: '200px',
          backgroundColor: '#f5f5f5',
          overflow: 'auto',
        }}
      >
          <div style={{ display: 'flex', flexDirection: 'column',justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span>Block Selector</span>
            <button style={{ marginBottom: '5px' }}>Button 1</button>
            <button style={{ marginBottom: '5px' }}>Button 2</button>
            <button style={{ marginBottom: '5px' }}>Button 3</button>
            <button style={{ marginBottom: '5px' }}>Button 4</button>
            <button style={{ marginBottom: '5px' }}>Button 5</button>
            <button style={{ marginBottom: '5px' }}>Button 6</button>
            <button style={{ marginBottom: '5px' }}>Button 7</button>
            <button style={{ marginBottom: '5px' }}>Button 8</button>
            <button style={{ marginBottom: '5px' }}>Button 9</button>
            <button style={{ marginBottom: '5px' }}>Button 10</button>
          </div>
      </div>
  </div>
  );
};

export {
  Editor,
  Toggle

};



//export default NoteEditor;

