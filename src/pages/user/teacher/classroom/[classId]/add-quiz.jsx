import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useMemo,
  createRef,
} from "react";
import {
  BsFilePdf,
  BsCardList,
  BsJournal,
  BsPersonLinesFill,
  BsPlusSquare,
  BsTrash,
} from "react-icons/bs";

const AddQuizzes = () => {
  const { query, pathname, asPath, push } = useRouter();
  const { classId } = query;

  const [classroom, setClassroom] = useState({});

  const [showCode, setShowCode] = useState(false);
  const [newQuizItems, setNewQuizItems] = useState([]);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [newQuizQuestion, setNewQuizQuestion] = useState("");
  const [newQuizAnswer, setNewQuizAnswer] = useState("");

  const title = classroom && `${classroom.subject} - ${classroom.section}`;

  const getClassroomInfo = async () => {
    const { data } = await axios.post(
      "/api/teacher/classroom/getClassroomInfo",
      { classId }
    );
    if (data) {
      setClassroom(data.classroom);
    }
  };

  useEffect(() => {
    getClassroomInfo();
  }, [classId]);

  const handleCreateQuiz = async (event) => {
    event.preventDefault();
    const { data } = await axios.post(
      "/api/teacher/classroom/quizzes/addNewQuiz",
      {
        classId,
        quizTitle: newQuizTitle,
        quizItems: newQuizItems,
      }
    );
    if (data) {
      push(`../${classId}/quizzes`);
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {classroom && (
        <div className="h-fit w-full">
          <div className="h-fit w-full py-2">
            <div className="flex items-center justify-between">
              <div className="flex h-fit w-full items-center space-x-2">
                <h4
                  className="text-lg font-bold"
                  onClick={() => setShowCode(!showCode)}
                >
                  {showCode ? classroom.code : classroom.subject}
                </h4>
                <h5 className="rounded border px-1 text-sm">
                  Section {classroom.section}
                </h5>
              </div>
              {/* <div className="flex h-fit w-fit items-center space-x-2">
                <Link href={`../${classId}/add-quiz`}>
                  <a className="whitespace-nowrap rounded bg-blue-600 px-2 py-1 text-sm text-white hover:bg-blue-500">
                    New Quiz
                  </a>
                </Link>
              </div> */}
            </div>
            <div className="sticky top-16 left-0 z-40 flex h-12 w-full items-end justify-start border-b bg-white">
              <Link href={`../${classId}`}>
                <a
                  className={`${
                    asPath === `/user/teacher/classroom/${classId}`
                      ? "border-b-black font-medium"
                      : "border-b-transparent"
                  } flex items-center border-b-2 pb-1`}
                >
                  <span className="flex items-center rounded px-2 py-1 text-sm hover:bg-black/10">
                    <BsJournal className="mr-2 h-4 w-4" /> Learning Modules
                  </span>
                </a>
              </Link>
              <Link href={`../${classId}/students`}>
                <a
                  className={`${
                    asPath.includes(`${classId}/students`)
                      ? "border-b-black font-medium"
                      : "border-b-transparent"
                  } flex items-center border-b-2 px-1 pb-1`}
                >
                  <span className="flex items-center rounded px-2 py-1 text-sm hover:bg-black/10">
                    <BsPersonLinesFill className="mr-2 h-4 w-4" /> Students
                  </span>
                </a>
              </Link>
              <Link href={`../${classId}/quizzes`}>
                <a
                  className={`${
                    asPath.includes(`${classId}/add-quiz`)
                      ? "border-b-black font-medium"
                      : "border-b-transparent"
                  } flex items-center border-b-2 px-1 pb-1`}
                >
                  <span className="flex items-center rounded px-2 py-1 text-sm hover:bg-black/10">
                    <BsCardList className="mr-2 h-4 w-4" /> Quizzes
                  </span>
                </a>
              </Link>
            </div>
            <div className="mt-2 flex h-fit w-full space-x-8">
              <div className="h-fit w-5/6 pb-16">
                <form onSubmit={handleCreateQuiz}>
                  <div className="h-fit w-full rounded border p-2">
                    <input
                      value={newQuizTitle}
                      onChange={(event) => setNewQuizTitle(event.target.value)}
                      placeholder="Quiz Title"
                      className="h-8 w-full rounded border bg-gray-100 px-2 placeholder:text-gray-500"
                    ></input>
                  </div>
                  {newQuizItems.length > 0 &&
                    newQuizItems.map((item, index) => (
                      <div className="relative mt-2 h-fit w-full space-y-2 rounded border">
                        <div className="w-full px-4 py-2">{item.question}</div>
                        <div className="w-full py-2 px-4 text-sm">
                          Answer: {item.answer}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setNewQuizItems(
                              newQuizItems.filter((item, i) => i != index)
                            )
                          }
                          className="absolute right-2 top-1"
                        >
                          <BsTrash className="h-5 w-5 text-red-600" />
                        </button>
                      </div>
                    ))}
                  <div className="mt-2 h-fit w-full space-y-2 rounded border px-2 pt-2">
                    <textarea
                      rows={3}
                      value={newQuizQuestion}
                      onChange={(event) =>
                        setNewQuizQuestion(event.target.value)
                      }
                      placeholder="Question"
                      className="w-full rounded border border-gray-200 bg-gray-100"
                    />
                    <textarea
                      rows={1}
                      value={newQuizAnswer}
                      onChange={(event) => setNewQuizAnswer(event.target.value)}
                      placeholder="Answer"
                      className="w-full rounded border border-gray-200 bg-gray-100"
                    />
                  </div>
                  <div className="flex h-fit w-full justify-end pt-2">
                    <button
                      type="submit"
                      className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                    >
                      Create Quiz
                    </button>
                  </div>
                </form>
              </div>
              <div className="sticky top-32 h-fit w-1/6 ">
                <button
                  onClick={() => {
                    setNewQuizItems([
                      ...newQuizItems,
                      {
                        question: newQuizQuestion,
                        answer: newQuizAnswer,
                      },
                    ]);
                    setNewQuizQuestion("");
                    setNewQuizAnswer("");
                  }}
                  className="flex items-center py-2 text-sm text-blue-500 hover:underline"
                >
                  <BsPlusSquare className="mr-2 h-4 w-4" /> Add item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddQuizzes;
