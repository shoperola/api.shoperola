import {PaymentLog} from "./paymentLog.model";
import {Client} from "../client/client.model";
 const view_amount = async (req, res) => {
    try {
        if(!req.user){
            res.status(400).json({message: "no user found!!"});
        }
        const client = await Client.findOne({ sub: req.user.sub });
        console.log(client);
        const logs = await PaymentLog.find({client: client._id});
        console.log(logs);
    } catch (e) {
        console.log(e);
        res.status(400).json({message: e.message});
    }
};

export {view_amount}