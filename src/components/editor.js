import React, { useState, useRef, useEffect, useLayoutEffect  } from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
//import ReactDOM from 'react-dom';
var Remarkable = require('react-remarkable');
// var ReactMarkdown = require("react-markdown");
var rehypeRaw = require("rehype-raw");

var md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
});

// 用 useRef
function Editor({pageName}) {
  const [markdown, setMarkdown] = useState('');
  const [elements, setElements] = useState([]);
  const [currentEditingIndex, setCurrentEditingIndex] = useState(-1);
  const [shiftKeyPressed, setShiftKeyPressed] = useState(false);
  const [enterKeyPressed, setEnterKeyPressed] = useState(false);


  useEffect(() => {
    console.log("pageName:", pageName);
  }, []);

  useLayoutEffect(() => {
    const newElement = "";
    setElements([...elements, newElement]);
    setCurrentEditingIndex(0)
  }, []);

  // useEffect(() => {
  //   console.log(currentEditingIndex)
  //   console.log(elements[currentEditingIndex])
  // }, [currentEditingIndex]);
  

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
      if (event.key === 'Shift') {
        setShiftKeyPressed(true);
      }
      if (event.key == 'Enter') {
        if(shiftKeyPressed){
          return 
        }
        handleInsert(index+1)
        setCurrentEditingIndex(currentEditingIndex+1)
        // console.log(currentEditingIndex)
      }
      if (event.key == 'Backspace') {
        if(elements.length>1 && elements[index]==''){
          // console.log("delete from ", elements.length, " elements")
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
  const handleKeyUp = (event) => {
    if (event.key === 'Shift') {
      setShiftKeyPressed(false);
    }
  };
  const handleElementChange = (index, value) => {
    const updatedElements = [...elements];
    updatedElements[index] = value;
    setElements(updatedElements);
  };

function scanTag(str){
    let tag = false
    for(let i=0; i<str.length; i++){
        if(str[i]=='@' && str[i+1]!=' '){
            tag = true
            if(i===0){
              if(str.length > 1){
              str = '[' + str.substring(1,str.length)}
              else break
            }
            else{
              str = str.substring(0,i) + '[' + str.substring(i+1, str.length)}
        }
        else if(tag===true){ 
          if(str[i+1]===' ' || i+1===str.length){
            // console.log('end tag')
            str = str.substring(0,i+1) + ']()' + str.substring(i+1)
            i+=3
            tag = false
          }
        }    
    }
  
    return str
}
  return (
    <div>
    { elements.length === 0 ? (handleInsert(0)
     /* <textarea>type something...</textarea> */
    ) : (
    <div>
      {elements.map((element, index) => (
        //console.log("index: ", index, "currentEdit: ", currentEditingIndex),
        <div key={index}>
          { index === currentEditingIndex ? (
            <textarea 
              autoFocus
              value={element}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onKeyUp={(event) => handleKeyUp(event)}
              style={{ border: 'none', resize: 'none', outline: 'none' }} 
              onChange={(e) => handleElementChange(index, e.target.value)}
              onBlur={() => {if(currentEditingIndex>0) setCurrentEditingIndex(-1)}}
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
              {/* <Remarkable>{element}</Remarkable> */}
              <div dangerouslySetInnerHTML={{__html: md.render(scanTag(element))}} />
              {/* <Remarkable plugins={[remarkGfm]} children={markdownText}></Remarkable> */}
            </div>
          )}    
       </div>
      ))}
    </div>
    )}
    </div>
  )
};
export {
  Editor,
};


