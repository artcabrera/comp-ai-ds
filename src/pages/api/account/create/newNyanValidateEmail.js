import Nyan from "../../../../database/models/Nyan";
import dbconnect from "../../../../database/dbconnect";

const handler = async (req, res) => {
  const { email } = req.body;
  await dbconnect();

  const user = await Nyan.findByEmail(email);
  if (user) {
    return res.status(200).json({ valid: false });
  }
  return res.status(200).json({ valid: true });
};

export default handler;
