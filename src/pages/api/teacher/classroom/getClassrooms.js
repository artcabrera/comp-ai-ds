import Classroom from "../../../../database/models/Classroom";
import dbconnect from "../../../../database/dbconnect";

export default async function handler(req, res) {
  const { id } = req.body;
  await dbconnect();
  const classrooms = await Classroom.find({ teacher: id });
  res.json({ classrooms });
}
