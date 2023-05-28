const { response } = require('../app');
const Page = require('../models/page_model');

const createPage = async(req, res) => {
    const {pageName} = req.body
    const result = Page.createPage(pageName) 
    if(result.error){
        res.status(500).send({message:"internal server error"})
    }
    res.status(200).send({
        message: "success create page"
    })
}

const getPage = async(req, res) => {
    const {pageName} = req.params
    const results = Page.getInfo(pageName)
    //get my content 
    if(result.error){
        res.status(500).send({message:"internal server error"})
    }
    let elements = []
    for(let i=0; i<results.length; i++){
        elements[i] = results[i].content
    }
    res.status(200).send({
        elements: elements
    })
}

const savePage = async(req, res) => {
    const {pageName, elements} = req.body
    let result = Page.savePage(pageName, elements)
    if(result.error){
        res.status(500).send({message:result.error})
    }
    res.status(200).send({message:'update success'})

}

const deletePage = async(req, res) => { 
    const {pageName} = req.params
    let result = Page.deletPage(pageName)
    if(result.error){
        res.status(500).send({message:result.error})
    }
    res.status(200).send({message:'delete success'})
}

module.exports = {
    createPage,
    getPage,
    savePage,
    deletePage
};





