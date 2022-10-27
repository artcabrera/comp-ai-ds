import Classroom from "../../../../database/models/Classroom";
import dbconnect from "../../../../database/dbconnect";

export default async function handler(req, res) {
  const { classId } = req.body;

  await dbconnect();

  const classroom = await Classroom.findById(classId);
  res.json({ classroom });
}
