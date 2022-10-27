import Classroom from "../../../../database/models/Classroom";
import dbconnect from "../../../../database/dbconnect";

export default async function handler(req, res) {
  const { teacher, teacherName, subject, code, section } = req.body;
  await dbconnect();

  const newClassroom = new Classroom({
    teacher,
    subject,
    code,
    section,
    teacherName,
  });

  await newClassroom.save();
  res.json({ message: "OK" });
}
