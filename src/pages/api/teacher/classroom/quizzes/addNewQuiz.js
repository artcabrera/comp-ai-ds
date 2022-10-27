import Classroom from "../../../../../database/models/Classroom";
import dbconnect from "../../../../../database/dbconnect";

export default async function handler(req, res) {
  const { quizTitle, quizItems, classId, quizDue } = req.body;
  await dbconnect();

  await Classroom.findByIdAndUpdate(classId, {
    $push: { quizzes: { $each: [{ quizTitle, quizItems, quizDue }] } },
  });
  res.json({ message: "OK" });
}
