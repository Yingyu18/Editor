const Relation = require('../models/relation_model');
const Page = require('../models/page_model');

//TODO:前端記下原本current element content，按下Ｅnter 後把最新的 element content 和原本的一起送到後端。

const updateRelation = async(req, res) => {
    const {oldContent, newContent, pageName} = req.body
    //check tags in this element
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
            let result = await Relation.deleteRelation(pageName, oldTags[i], oldContent)
            if(result.error){
                res.status(500).send({message:"internal server error"})
            }
        }
    }
    // 新增 relation
    for(let i=0; i<newTags.length; i++){
        let add = 1
        for(let j=0; j<oldTags; j++){
            if(oldTags[j] == newTags[i]){
                add = 0
            }
        }
        if(add == 1){ 
            // if the page be mentioned not exist yet
            if(Page.getInfo(newTags[i])){
                await Page.createPage(newTags[i])
            }
            let result = await Relation.createRelation(pageName, newTags[i], newContent)
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
                // 2. update A element 


    res.status(200).send({
        message: "success update elements"
    })
}

const updatePage = async(req, res) => {
    const {newElements, pageName} = req.body
    console.log(req.body)
    // 先打新的加進去
    console.log("update new elements relation: ",newElements)
    if(newElements && pageName){
        for(let i=0; i<newElements.length; i++){
            let newTags = scanTag(newElements[i])
            console.log("new tags", newTags)
                // 新增 relation
            for(let j=0; j<newTags.length; j++){
                // if the page be mentioned not exist yet
                let result = await Page.getInfo(newTags[j])
                if( result.length <1){
                    await Page.createPage(newTags[j])
                }
                console.log(`createRelation(${pageName}, ${newTags[j]}, ${newElements[i]}`)
                result = await Relation.createRelation(pageName, newTags[j], newElements[i])
                if(result.error){
                    res.status(500).send({message:"internal server error"})
                }
            }
        }
            // 再刪掉舊的
        let result = await Relation.deletePageRelation(pageName)
        if(result.error){
            res.status(500).send({message:"internal server error"})
        }
    }

}

//知道 page name，他有什麼content 和哪個 page link 
function scanTag(str){
    let tag = false
    let result = []
    let start = 0, end = 0, count = 0
    if(str){
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
    }
    //TODO: return array of link
    return result
}

const getCited = async(req, res) => {
    let {pageName} = req.params
    // want to get all date in relation (page\content)
    let results = await Relation.getCited(pageName)
    console.log(results[0])
    if(results.error){
        res.status(500).send({message:"internal server error"})
    }
    res.status(200).send(results[0])

}


module.exports = {
    updateRelation,
    updatePage,
    getCited
};





