import React, { useState, useRef, useEffect, useLayoutEffect  } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
var Remarkable = require('react-remarkable');
var rehypeRaw = require("rehype-raw");
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
});


const BASE_URL = 'http://localhost:8000/api'
const HOME = 'http://localhost:3000'
// 用 useRef
function Editor({pageName}) {
  const [markdown, setMarkdown] = useState('')
  const [elements, setElements] = useState([])
  const [currentEditingIndex, setCurrentEditingIndex] = useState(0)
  const [shiftKeyPressed, setShiftKeyPressed] = useState(false)
  const [tempElement, setTempElement] = useState('');
  const [preIndex, setPreIndex] = useState(0);
  const [refresh, setRefresh] = useState(0)
  const [elementChange, setElementChange] = useState(0) //indicate if the element change
  //const [page, setPage] = useState(pageName)

  const getPage = (pageName) => {
    console.log("get page", pageName)
    return new Promise((resolve, reject) => {
      axios.get(`${BASE_URL}/page/getPage/${pageName}`)
        .then( function (response) {
          console.log("response of getPage: ",response.data.elements)
          resolve (response.data.elements)
        })
        .catch(function (error) {
          // Handle the error
          console.log("error: ", error)
          reject(error)
        });
    })
  }

  // 選擇不同 page 
  useEffect(() => {
    setCurrentEditingIndex(-1)
    //setElements([])
    console.log("pageName test:", pageName);
    getPage(pageName)
      .then((elements)=> {
        console.log("test")
        //console.log(elements)
        setElements(elements)
        console.log("getPage:", elements)
      })
      .catch((error) => {
        // Handle the error
        console.error("get Page error:", error);
      });
  }, [pageName]);

  useLayoutEffect(() => {
    const newElement = "";
    setElements([...elements, newElement]);
    setCurrentEditingIndex(-1)
  }, []);

   useEffect(() => {
  //   if(currentEditingIndex!=-1){
  //     console.log("index change \n update page Element and relation");
       console.log("index: ", currentEditingIndex)
  //     savePage(pageName)
  //     saveRelation(pageName)
  //   }
   }, [currentEditingIndex]);

  const savePage = (pageName) => {
    console.log("save page elements")
    let requestBody = {
      "pageName": pageName,
      "elements": elements
    }
    console.log("Save page body: ", requestBody)
    axios.patch(`${BASE_URL}/page/save`, requestBody)
    .then( function (response) {
      console.log("save paage:", response)
    })
    .catch(function (error) {
      // Handle the error
      console.error(error)
    });
  }
  const saveRelation = (pageName) => {
    let requestBody = {
      "pageName": pageName,
      "newElements": elements
    }
    console.log("save page relation: ", requestBody)
    axios.patch(`${BASE_URL}/relation/updatePage`, requestBody)
    .then( function (response) {
      console.log("sae relation:", response)
    })
    .catch(function (error) {
      // Handle the error
      console.error(error)
    });

  }


  const handleElementUpdate = () => {
    console.log("Update Edited Element")
      //tempElements 保留了修改後的 element
      //TODO: call API updateElement to update relation
      let body = {
        oldContent: elements[preIndex],
        newContent: tempElement,
        pageName:pageName
      }
      console.log("request body of update element", body)
      axios.patch(`${BASE_URL}/relation/update`)
        .then( function (response) {
          console.log(response)
        })
        .catch(function (error) {
          console.error(error)
         // reject(error)
        });      

      //更新完 relation 再更新elements, 然後 save page?
      const updatedElements = [...elements];              
      updatedElements[preIndex] = tempElement;
      console.log("updateElements: ", updatedElements)              
      setElements(updatedElements)
      setElementChange(0) 
      savePage()               
  };

  //add new line
  const handleInsert = (index) => {
    const newElement = " ";
    setElements([
      ...elements.slice(0, index),
      newElement,
      ...elements.slice(index)
    ]);
    setCurrentEditingIndex(currentEditingIndex+1)
    console.log("cur Index:", currentEditingIndex)
    console.log("elements after insert: ", elements)
  };
  const handleDelete = (index) => {
    //TODO: update relation and savePage 
    const updatedElements = [...elements];
    updatedElements.splice(index, 1);
    setElements(updatedElements);
    if(currentEditingIndex>0){
      setCurrentEditingIndex(currentEditingIndex-1)
    }

  };

  //TODO: check each operation
  const handleKeyDown = (event, index) => {
      if (event.key === 'Shift') {
        setShiftKeyPressed(true);
      }
      if (event.key == 'Enter') {
        if(shiftKeyPressed){
          return 
        }
        if(elements[currentEditingIndex]===''){
          return 
        }
        console.log("handleInsert index: ", index)
        handleInsert(index+1)
        savePage(pageName)
        saveRelation(pageName)
        // console.log(currentEditingIndex)
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
        console.log("should present: ", elements[currentEditingIndex])
      } else if (event.key === 'ArrowDown' && index < elements.length-1) {
        event.preventDefault();
        setCurrentEditingIndex(currentEditingIndex+1)
        console.log("should present: ", elements[currentEditingIndex])
        console.log("tempElement: ", tempElement)
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

function scanTag(str, pageName){
    let tag = false
    let temp = ''
    for(let i=0; i<str.length; i++){
        if(str[i]=='@' && str[i+1]!=' '){
            tag = true
            temp = ''
            temp += str[i+1]
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
            //TODO : resolve the link
            str = str.substring(0,i+1) + `](${HOME}/?page=${temp})` + str.substring(i+1)
            console.log(temp)
            i+=3
            tag = false
          }
          temp+=str[i+1]
        }    
    }
    return str
}
  return (
    <div>
    <h1>{pageName}</h1>
    { elements.length === 0 ? 
    (handleInsert(0)
//    ( setElements([''])
     /* <textarea>type something...</textarea> */
    ) : (
    <div>
      {elements.map((element, index) => (
        //console.log("index: ", index, "currentEdit: ", currentEditingIndex),
        <div key={index}>
          { index === currentEditingIndex ? (
            <textarea 
              autoFocus
              //value={tempElement !== '' ? tempElement : element}
              value={element}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onKeyUp={(event) => handleKeyUp(event)}
              style={{ border: 'none', resize: 'none', outline: 'none' }} 
              onChange={(e) => handleElementChange(index, e.target.value)}
              // onChange={(e) => {
              //   setTempElement(e.target.value)
              //   setElementChange(1)
              // }} // 改 temp 的值，讓element 保留原本的值         
              onBlur={() => {
                console.log("onBlur!!")
                if(currentEditingIndex>0){
                  setCurrentEditingIndex(-1)
                }  
              }}
            />       
          ) : (
            <div 
              key={index}
              onClick={()=>{
                setCurrentEditingIndex(index);}}
            >
              {/* <Remarkable>{element}</Remarkable> */}
              <div dangerouslySetInnerHTML={{__html: md.render(scanTag(element, pageName) + '\n')}} />
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


