const { pool } = require('./db_connection');

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
        await conn.query("INSERT INTO relation (page, mention, content) VALUES (?,?,?)",[pageName, mention, newContent])
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
    createRelation
}