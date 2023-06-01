const  pool  = require('./db_connection');

const deleteRelation = async (pageName, mention, oldContent) => {
    const conn = await pool.getConnection()
    try{
        await conn.query("DELETE FROM relation WHERE page=? AND mention=? AND content=?",[pageName, mention, oldContent])
    } catch (error){
        console.log({error:error})
        return{error}
    } finally {
        await conn.release();
    } 
}
const deletePageRelation = async (pageName) => {
    const conn = await pool.getConnection()
    try{
        await conn.query("DELETE FROM relation WHERE page=? AND new=?",[pageName, 0])
        await conn.query("UPDATE relation SET new=0 WHERE page=?", [pageName])
        return 0
    } catch (error){
        console.log({error:error})
        return{error}
    } finally {
        await conn.release();
    } 
}
const updateContent = async (pageName, mention, newContent, oldContent) => {
    const conn = await pool.getConnection()
    try{
        await conn.query("UPDATE relation SET content=? WHERE page=? AND mention=? AND content=?",[pageName, mention, newContent, oldContent])
    } catch (error){
        console.log({error:error})
        return{error}
    } finally {
        await conn.release();
    } 
}
const createRelation = async (pageName, mention, newContent) => {
    const conn = await pool.getConnection()
    try{
        let results = await conn.query("SELECT * FROM page WHERE name=?", [mention])
        if(results.length<1){
            await conn.query("INSERT INTO page (name) VALUES (?)", [mention])
        }
        results =  await conn.query("INSERT INTO relation (page, mention, content, new) VALUES (?,?,?,?)",[pageName, mention, newContent, 1])
        return results
    } catch (error){
        console.log({error:error})
        return{error}
    } finally {
        await conn.release();
    } 
}

const getCited = async (pageName) => {
    const conn = await pool.getConnection()
    try{
        let results = await conn.query("SELECT * FROM relation WHERE mention=?", [pageName])
        return results
    } catch (error){
        console.log({error:error})
        return{error}
    } finally {
        await conn.release();
    } 
}

module.exports = {
    deleteRelation,
    updateContent,
    createRelation,
    deletePageRelation,
    getCited,
}