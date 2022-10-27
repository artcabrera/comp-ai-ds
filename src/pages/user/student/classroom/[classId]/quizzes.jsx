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
} from "react-icons/bs";
import path from "path";
import { Disclosure } from "@headlessui/react";

const StudentQuizzes = () => {
  const { query, pathname, asPath } = useRouter();
  const { classId } = query;

  const [classroom, setClassroom] = useState({});

  const [showCode, setShowCode] = useState(false);

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
            <div className="sticky top-16 left-0 flex h-12 w-full items-end justify-start border-b bg-white">
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
              <Link href={`../${classId}/people`}>
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
            <div className="mt-2 h-fit w-full rounded border">
              <div className="flex">
                <div className="h-fit w-1/6 whitespace-nowrap bg-gray-100 p-4">
                  Date
                </div>
                <div className="h-fit w-5/6 bg-gray-100 p-4">Quiz Name</div>
              </div>
              {classroom.quizzes &&
                classroom.quizzes.length > 0 &&
                classroom.quizzes
                  .slice(0)
                  .reverse()
                  .map((item, index) => (
                    <div
                      key={item._id}
                      className={`h-fit w-full border-t py-2 px-4 hover:bg-gray-100`}
                    >
                      <div className="flex w-full items-center">
                        <div className="flex h-fit w-1/6 items-center text-sm">
                          {new Date().toDateString()}
                        </div>
                        <div className="flex h-fit w-3/6">{item.quizTitle}</div>
                        <div className="flex h-fit w-2/6 justify-end text-sm">
                          <Link
                            href={`../${classId}/quizzes/take-quiz?quizId=${item._id}`}
                          >
                            <a className="flex items-center text-blue-500 hover:underline">
                              Take Quiz
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentQuizzes;
