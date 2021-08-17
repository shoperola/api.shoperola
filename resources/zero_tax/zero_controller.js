import {ZeroTax} from './zero_tax_model';

const add_tax = async (req, res) => {
    try {
        const add = await ZeroTax.create({...req.body});
        res.send(add);
    } catch (e) {
        console.log(e);
        res.send(e);
    }
}

export {add_tax}