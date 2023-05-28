const Relation = require('../models/relation_model');

//TODO:前端記下原本current element content，按下Ｅnter 後把最新的 element content 和原本的一起送到後端。

const updateRelation = async(req, res) => {
    const {oldContent, newContent, pageName} = req.body
    //heck any tag in this element
    let oldTags = scanTag(oldContent)
    let newTags = scanTag(newContent)
    for(let i=0; i<oldTags.length; i++){
        let exist = 0
        for(let j=0; j<newTags; j++){
            if(oldTags[i] == newTags[j]){
        //update the content contain the tags
                exist = 1
                let result = Relation.updateContent(pageName, oldTags[i], newContent, oldContent)
                if(result.error){
                    res.status(500).send({message:"internal server error"})
                }
            }
        }
        // delete link not exist more
        if(exist == 0){
            let result = Relation.deleteRelation(pageName, oldTags[i], oldContent)
            if(result.error){
                res.status(500).send({message:"internal server error"})
            }
        }
    }
    // 新增 relation
    for(let i=0; i<newTags.length; i++){
        let add = 1
        for(let j=0; j<oldTags; j++){
            if(oldTags[i] == newTags[j]){
                add = 0
            }
        }
        // delete link not exist more
        if(add == 1){
            let result = Relation.createRelation(pageName, newTags[i], newContent)
            if(result.error){
                res.status(500).send({message:"internal server error"})
            }
        }
    }

    //update relation contnet
    //add new relation
//     1. 檢查 element 原本有的 relation
//     2. 和現有的 relation 做比對
//      + 刪掉不存在的relation
//      + 更新已有的 relation 的 content
//      + 新增 relation
            // A create a link to page B
                // 1. B not exist => create paage B
                // 2. insert a row in relation(?) => for 共現圖
                // 3. update A element 
                // 4. add the element of A into page B


    res.status(200).send({
        message: "success create page"
    })
}

//知道 page name，他有什麼content 和哪個 page link 
function scanTag(str){
    let tag = false
    let result = []
    let start = 0, end = 0, count = 0
    for(let i=0; i<str.length; i++){
        //if something after @
        if( (str[i]=='@') && !(str[i+1]== ' '|| str[i+1] == undefined || str[i+1]=='\n')){
            start = i+1
            tag = true
        }
        else if(tag===true){ 
          if(str[i+1]===' ' || str[i+1]==='\n' || str[i+1]==undefined){
            //End of the tag, add the relation into array
            console.log('end tag')
            end = i
            tag = false
            result[count] = str.substring(start, end+1)
            count++
          }
        }    
    }
    //TODO: return array of link
    return result
}


module.exports = {
    updateRelation
};





