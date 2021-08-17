import {Tax} from './tax_model';
//import {Ecommerce} from '../Ecommerce/'

const add_tax = async(req,res) => {
    try {
        if(!req.user){
            res.status(400),send("no user found!!");    
        }
        const add_tax = await Tax.create({userID: req.user._id, ...req.body});
        res.status(201).json({success: true, data: add_tax});
    } catch (e) {
        console.log(e);
        res.status(400).json({message: 'something went wrong!!!'});
        
    }
};
const add_tax_zero = async(req,res) => {
    try {
        const add_taxZero = await Tax.create({...req.body});
        res.status(201).json({success: true, data: add_taxZero});
    } catch (e) {
        console.log(e);
        res.status(400).json({message: 'something went wrong!!!'});
    }
}
const view_taxs = async(req,res) => {
    try {
        if(!req.user){
            res.status(400),send("no user found!!");    
        }
        const view_taxs = await Tax.find({userID: req.user._id});
        res.status(200).json({success: true, data: view_taxs});
    } catch (e) {
        console.log(e);
        res.status(400).json({message: 'something went wrong!!!'});
        
    }
};
const view_tax = async(req,res) => {
    try {
        if(!req.user){
            res.status(400),send("no user found!!");    
        }
        const id = req.params.id;
        if(!id){
            res.json({message: 'id is required!!'});
        }
        const view_tax = await Tax.findById(id);
        res.status(200).json({success: true , data: view_tax});
    } catch (e) {
    console.log(e);
        res.status(400).json({message: 'something went wrong!!!'});
    }    
};
const update_tax = async(req,res) => {
    try {
        if(!req.user){
            res.status(400),send("no user found!!");    
        }
        const id = req.params.id;
        if(!id){
            res.json({message: 'id is required!!'});
        }
        const update_tax = await Tax.findByIdAndUpdate(id,{$set: req.body}, {new: true});
        res.status(200).json({success: true, data: update_tax});
    } catch (e) {
        console.log(e);
        res.status(400).json({message: 'something went wrong!!!'});
    }
};
const delete_tax = async(req,res) => {
    try {
        if(!req.user){
            res.status(400),send("no user found!!");    
        }
        const id = req.params.id;
        if(!id){
            res.json({message: 'id is required!!'});
        }
        const delete_tax = await Tax.findByIdAndDelete(id);
        res.status(200).json({success: true, data: delete_tax});
    } catch (e) { 
        console.log(e);
        res.status(400).json({message: 'something went wrong!!!'});
    }
};

export {add_tax, view_tax, update_tax, delete_tax, view_taxs,add_tax_zero};