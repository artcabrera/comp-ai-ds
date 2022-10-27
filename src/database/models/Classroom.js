import mongoose from "mongoose";

const ClassroomSchema = new mongoose.Schema({
  subject: String,
  section: String,
  code: String,
  teacher: mongoose.SchemaTypes.ObjectId,
  teacherName: String,
  students: [
    { student: { type: mongoose.SchemaTypes.ObjectId }, studentName: String },
  ],
  lessons: [
    { number: String, title: String, notes: String, attachments: String },
  ],
  quizzes: [
    {
      quizTitle: String,
      quizItems: [{ question: String, answer: String }],
      quizDue: Date,
      quizResponses: [
        {
          student: { type: mongoose.SchemaTypes.ObjectId },
          studentName: String,
          score: Number,
          answers: [{ question: String, answer: String }],
        },
      ],
    },
  ],
});

export default mongoose.models.Classroom ||
  mongoose.model("Classroom", ClassroomSchema);
