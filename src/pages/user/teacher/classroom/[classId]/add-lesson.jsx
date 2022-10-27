import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  BsJournal,
  BsCheck,
  BsPersonLinesFill,
  BsPaperclip,
  BsCardList,
} from "react-icons/bs";

const AddLesson = () => {
  const { query, pathname, asPath, push } = useRouter();
  const { classId } = query;

  const [classroom, setClassroom] = useState({});

  const [showCode, setShowCode] = useState(false);

  const [newNumber, setNewNumber] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newFile, setNewFile] = useState("");
  const [newDoc, setNewDoc] = useState("");

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

  const handlePreview = async (event) => {
    const file = event.target.files[0];
    if (!file) return setNewDoc("");
    setNewDoc(file.name);
    setNewFile(file);
  };

  const handleAddNew = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", newFile);

    try {
      const { data } = await axios.post("/api/utils/fileUpload", formData);
      if (data && data.url) {
        const { data: res } = await axios.post(
          "/api/teacher/classroom/addNewLesson",
          {
            number: newNumber,
            title: newTitle,
            notes: newNote,
            classId,
            attachments: data.url,
          }
        );
        push("../" + classId);
      }
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    getClassroomInfo();
  }, [classId]);

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
                <Link href="add-lesson.jsx">
                  <a className="whitespace-nowrap rounded bg-green-600 px-2 py-1 text-sm text-white hover:bg-green-500">
                    New Lesson
                  </a>
                </Link>
              </div> */}
            </div>
            <div className="sticky top-16 left-0 flex h-12 w-full items-end justify-start border-b bg-white">
              <Link href={`../${classId}`}>
                <a
                  className={`${
                    !asPath.includes(`${classId}/students`)
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
                    asPath.includes(`${classId}/quizzes`)
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
          </div>
          <div className="flex h-fit w-full space-x-8">
            <div className="h-fit w-3/4">
              <form onSubmit={handleAddNew} className="relative">
                <div className="flex space-x-2 rounded-t border-r border-t border-l p-2">
                  <input
                    value={newNumber}
                    onChange={(event) => setNewNumber(event.target.value)}
                    placeholder="Lesson No."
                    className="h-8 w-1/6 rounded border bg-gray-100 px-2 placeholder:text-gray-500"
                  ></input>
                  <input
                    value={newTitle}
                    onChange={(event) => setNewTitle(event.target.value)}
                    placeholder="Title"
                    className="h-8 w-5/6 rounded border bg-gray-100 px-2 placeholder:text-gray-500"
                  ></input>
                </div>
                <div className="flex h-10 w-full border-x">
                  <div className="h-full w-2 border-b"></div>
                  <div className="flex h-full w-fit items-center rounded-t border border-b-red-300/10 px-4 text-sm">
                    Write
                  </div>
                  <div className="h-full w-full border-b"></div>
                </div>
                <div className="rounded-b border-b border-l border-r p-2">
                  <textarea
                    value={newNote}
                    rows={6}
                    onChange={(event) => setNewNote(event.target.value)}
                    className="min-h-72 w-full rounded border border-gray-200 bg-gray-100"
                    placeholder="Leave a note"
                  />
                  <div className="flex w-full justify-end">
                    <button
                      disabled={
                        newTitle === "" || newNote === "" || newDoc === ""
                      }
                      className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:bg-green-700 disabled:text-gray-300"
                    >
                      Add Lesson
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="w-1/4 pt-3">
              <div className="relative flex h-fit w-fit cursor-pointer items-center text-blue-500 hover:underline">
                <BsPaperclip className="mr-2 h-5 w-5" />
                {newDoc ? (
                  <>
                    {newDoc}
                    <BsCheck className="ml-1 h-5 w-5 text-green-500" />
                  </>
                ) : (
                  "Attach PDF"
                )}
                <input
                  accept=".pdf"
                  type="file"
                  onChange={handlePreview}
                  className="absolute inset-0 opacity-0"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddLesson;
