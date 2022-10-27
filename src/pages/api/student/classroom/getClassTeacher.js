import Nyan from "../../../../database/models/Nyan";
import dbconnect from "../../../../database/dbconnect";

export default async function handler(req, res) {
  const { teacher: id } = req.body;
  await dbconnect();

  const teacher = await Nyan.findById(id, { firstname: 1, lastname: 1 });
  res.json({ teacher });
}
