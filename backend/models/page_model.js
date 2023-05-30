const  pool  = require('./db_connection');

const createPage = async (pageName) => {
  const conn = await pool.getConnection()
  try{
    const result = await conn.query("INSERT INTO page (name) VALUES (?)", [pageName])
    return result
  } catch(error){
        console.log(error)
        return {error:error}
  } finally {
        await conn.release();
  }
}
const listPage = async () => {
    const conn = await pool.getConnection()
    try{
        const results = await conn.query("SELECT name FROM page")
        console.log(results[0])
        return results[0]
      } catch(error){
            console.log({error:error})
            return {error}
      } finally {
            await conn.release();
      } 
}
const getInfo = async (pageName) => {
    const conn = await pool.getConnection()
    try{
        const results = await conn.query("SELECT FROM elements WHERE page_name = ?", [pageName])
        return results
      } catch(error){
            console.log({error:error})
            return {error}
      } finally {
            await conn.release();
      } 
}
const savePage = async (pageName, elements) => {
    try{
        const conn = await pool.getConnection()   
        //save the current elements of the page into table
        for(let i=0; i<elements.length; i++){
            await conn.query("INSERT INTO elements (page_name, content) VALUES (?, ?)", [pageName, elements[i]])
        }  
        //delete all teh previos element in the page
            await  conn.query("DELETE FROM elements WHERE page_name=? AND new=?", [pageName, 0])
        //set the new elements set new column to false
            await conn.query("UPDATE elements SET new=0 WHERE page_name=?", [pageName])
            return 
      } catch(error){
            console.log({error:error})
            return {error}
      } finally {
            await conn.release();
      } 
}
const deletePage = async (pageName) => {
// 1. relation 表，SELECT page_id 刪掉全部
// 2. element table, 刪掉全部 
// 3. page table, 刪掉全部
    const conn = await pool.getConnection()
    try{
        await conn.query('START TRANSACTION');   
        await  conn.query("DELETE FROM elements WHERE page_name=?", [pageName])
        await  conn.query("DELETE FROM page WHERE page_name=?", [pageName])
        await  conn.query("DELETE FROM relation WHERE page=?", [pageName])
        await  conn.query("DELETE FROM relation WHERE mention=?", [pageName])
        await conn.query('COMMIT')
        return 
      } catch(error){
            console.log({error:error})
            await conn.query('ROLLBACK');
            return {error}
      } finally {
            await conn.release();
      } 
}


module.exports = {
  createPage,
  getInfo,
  savePage,
  deletePage,
  listPage  
};