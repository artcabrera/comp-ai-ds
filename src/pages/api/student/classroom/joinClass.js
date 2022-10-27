import Classroom from "../../../../database/models/Classroom";
import dbconnect from "../../../../database/dbconnect";

export default async function handler(req, res) {
  const { classCode, studentId, studentName } = req.body;
  await dbconnect();

  await Classroom.findOneAndUpdate(
    { code: classCode },
    {
      $push: {
        students: { $each: [{ student: studentId, studentName }] },
      },
    }
  );
  res.json({ message: "OK" });
}
