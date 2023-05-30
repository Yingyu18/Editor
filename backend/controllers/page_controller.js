const Page = require('../models/page_model');

const createPage = async(req, res) => {
    const {pageName} = req.body
    const result = await Page.createPage(pageName) 
    if(result.error){
        return res.status(500).send({error:result.error})
    }
    res.status(200).send({
        message: "success create page"
    })
}

const listPage = async(req, res) => {
    const result = await Page.listPage() 
    if(result.error){
        return res.status(500).send({error:result.error})
    }
    res.status(200).send({
        pages:result 
    })
}

const getPage = async(req, res) => {
    const {pageName} = req.params
    const results = await Page.getInfo(pageName)
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
    let result = await Page.savePage(pageName, elements)
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
    deletePage,
    listPage
};





