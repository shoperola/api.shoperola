import {Featured} from './featured_model';

const add_feautred_product = async (req, res) => {
    try {
        console.log(req.file);
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
          
          const product_id = req.params.id;
          const featured_product = await Featured.create({
              userID: req.user._id,
              feautred_product: product_id,
              feautred_image: req.file.location,
              status: req.query.status
            })
            console.log(featured_product);
            res.status(201).json({success: true, data: featured_product});
          
    } catch (e) {
        console.log(e);
        res.status(400).json({message: 'something went wrong!!!'});
        
    }
};

const view_featured_products = async (req, res) => {
    try {
          let { page, size, sort } = req.query;
  
          if (!page) {

              page = 1;
          }
    
          if (!size) {
              size = 10;
          }
    
          const limit = parseInt(size);

          const view_products = await Featured.find({userID: req.user._id}).sort({_id:1}).limit(limit).populate("feautred_product");

          res.status(200).json({success: true, data: view_products, page:page, size: size});
    } catch (e) {
        console.log(e);
        res.status(400).json({message: 'something went wrong!!!'});
        
        
    }
};

const view_featured_product = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
          
          const check = await Featured.findById(id).populate("feautred_product")
          if(!check){
              res.status(404).json({ message: "no featured_product found!!"});
          }
          res.status(200).json({success: true,data:check});
    } catch (e) {
        console.log(e);
        res.status(400).json({message: 'something went wrong!!!'});
        
        
    }
};

const update_featured_product = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
          const id = req.params.id;
          const check = await Featured.findById(id);
          if(!check){
              res.status(404).json({ message: "no featured_product found!!"});
          }
          const update_featured_product = await Featured.findByIdAndUpdate(id,{$set:{feautred_image:req.file.location, status:req.query.status}}, {new: true});
          res.status(200).json({success:true, data: update_featured_product});

    } catch (e) {

        console.log(e);
        res.status(400).json({message: 'something went wrong!!!'});
    }
};

const delete_feature_product = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
          const id = req.params.id;
          const check = await Featured.findById(id);
          if(!check){
              res.status(404).json({ message: "no featured_product found!!"});
          }
          const delete_feature_product = await Featured.findByIdAndDelete(id);
          res.status(200).json({success:true, data: delete_feature_product});

    } catch (e) {
        console.log(e);
        res.status(400).json({message: 'something went wrong!!!'});
        
    }
};

const change_status = async(req,res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
          const id = req.params.id;
          const check = await Featured.findById(id);
          if(!check){
              res.status(404).json({ message: "no featured_product found!!"});
          }
          if(check.status === 'active'){
              check.status = 'inactive'
              await check.save();

          }
         else if(check.status === 'inactive'){
            check.status = 'active'
            await check.save();
         }
         res.status(200).json({success:true, data:check});
        
    } catch (e) {
        console.log(e);
        res.status(400).json({message: 'something went wrong!!!'});
    }
}

export {add_feautred_product,view_featured_products, view_featured_product,update_featured_product,delete_feature_product, change_status}