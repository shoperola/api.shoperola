import Machine from "./machine_model";

const getMachines=async(req,res) => {
  try{
    const Machines=await Machine.find({});
    res.send(Machines);
  }catch(e){
    res.send(e);
  }

}

export {getMachines,
  // addMachines,
  // getMachineById,
  // updateMachine,
  // deleteMachine,
};