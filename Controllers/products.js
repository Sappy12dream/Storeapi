const Product = require('../Models/products');



const getAllProductsStatic = async(req, res)=>{
    const Products = await Product.find({featured:true});
    res.status(200).json({Products,nbHits:Products.length});
}
const getAllProducts = async(req, res)=>{
    const {featured, company, name, sort, fields, numericFilters} = req.query;
    const queryObject = {};
    if(featured){
        queryObject.featured = featured === 'true'? true:false;
    }
    if(company){
        queryObject.company = company;
    }
    if(name){
        queryObject.name = { $regex : name, $options:'i' };
    }
    if(numericFilters){
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',   
        }

    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }
    



    let Result = Product.find(queryObject);
    if(sort){
        const sortList = sort.split(',').join(' ');
        Result = Result.sort(sortList);
    }
    else{
        Result = Result.sort('createdAt')
    }
    if(fields){
        const fieldList = fields.split(',').join(' ');
        Result = Result.select(fieldList);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1)*limit;
    Result = Result.skip(skip).limit(limit);
    const Products = await Result;
    res.status(200).json({Products,nbHits:Products.length});
}

module.exports ={
    getAllProducts,
    getAllProductsStatic
}