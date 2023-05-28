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
function Editor() {
  const [markdown, setMarkdown] = useState('');
  const [elements, setElements] = useState([]);
  const [currentEditingIndex, setCurrentEditingIndex] = useState(-1);
  const [shiftKeyPressed, setShiftKeyPressed] = useState(false);
  const [enterKeyPressed, setEnterKeyPressed] = useState(false);


  useLayoutEffect(() => {
    const newElement = "";
    setElements([...elements, newElement]);
    setCurrentEditingIndex(0)
  }, []);

  useEffect(() => {
    console.log(currentEditingIndex)
    console.log(elements[currentEditingIndex])
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
      if (event.key === 'Shift') {
        setShiftKeyPressed(true);
      }
      if (event.key == 'Enter') {
        if(shiftKeyPressed){
          return 
        }
        handleInsert(index+1)
        setCurrentEditingIndex(currentEditingIndex+1)
        console.log(currentEditingIndex)
      }
      if (event.key == 'Backspace') {
        if(elements.length>1 && elements[index]==''){
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
      console.log(str[i])
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
            console.log('end tag')
            str = str.substring(0,i+1) + ']()' + str.substring(i+1)
            i+=3
            tag = false
          }
        }    
    }
  
    return str
}
  const example = `
  * Lists
  * [ ] todo
    * 1
    * 2   
  * [x] done`
  const markdownText = `

  | Option | Description |
  | ------ | ----------- |
  | data   | path to data files to supply the data that will be passed into templates. |
  | engine | engine to be used for processing templates. Handlebars is the default. |
  | ext    | extension to be used for dest files. |
  `
  //用 

  return (
    <div>
    
    { elements.length === 0 ? (handleInsert(0)
     /* <textarea>type something...</textarea> */
    ) : (
    <div>
      {elements.map((element, index) => (
        console.log("index: ", index, "currentEdit: ", currentEditingIndex),
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

const input = `<div class="note">
Some *emphasis* and <strong>strong</strong>!
</div>`

const MarkdownRenderer = ({ input }) => {
  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw]} children={input} />
  );
};

export default MarkdownRenderer;

export {
  Editor,
  Toggle,
  MarkdownRenderer

};



//export default NoteEditor;

