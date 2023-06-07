import Alert from "./alert.model";




// get a franchise
const getFranchiseAlert = async (req, res) => {
  try {
    const franchise = await Alert.find({})
    res.status(200).json(franchise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
};

export  { getFranchiseAlert };
