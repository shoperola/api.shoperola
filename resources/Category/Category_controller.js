import {Category} from "./Category_model";

const add_category = async (req, res) => {
    try{
        const check = await Category.create({...req.body})
        console.log(check);
        res.send(check);
    }catch(e){
        res.send(e.message);
    }
};

const view_category = async (req, res) => {
    try{
        const id = req.params.id;
        const check = await Category.findById(id)
        if(!check){
            res.send("no category found!!")
        }
        res.send(check);
    }catch(e){
        res.send(e.message);
    }
};

const view = async (req, res) => {
    try{
        const check = await Category.find({});
        res.send(check);
    }catch(e){
        res.send(e.message);
    }
};

const update_category = async (req, res) => {
    try{
        const id = req.params.id;
        const check = await Category.find(id);
        if(!check){
            res.send("no category found!!");
        }
        const update = await Category.findByIdAndUpdate(id, {$set: {...req.body}})
        res.send(update);
    }catch(e){
        res.send(e.message);
    }
};

const delete_category = async (req, res) => {
    try{
        const id = req.params.id;
        const check = await Category.find(id)
        if(!check){
            res.send("no category found!!")
        }
        const deletee = await Category.findByIdAndDelete(id)
        res.send(deletee);
    }catch(e){
        res.send(e.message)
    }
};

export{add_category ,view_category,view, update_category, delete_category};
