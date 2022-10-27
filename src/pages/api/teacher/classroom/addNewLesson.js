import Classroom from "../../../../database/models/Classroom";
import dbconnect from "../../../../database/dbconnect";

export default async function handler(req, res) {
  const { number, title, notes, attachments, classId } = req.body;
  await dbconnect();

  await Classroom.findByIdAndUpdate(classId, {
    $push: {
      lessons: {
        $each: [{ number, title, notes, attachments }],
      },
    },
  });

  res.json({ message: "OK" });
}
