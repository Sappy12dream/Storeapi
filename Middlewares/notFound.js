const notFound = (req,res)=>{
    res.status(404).send("Routes doesn't found");
}
module.exports = notFound;