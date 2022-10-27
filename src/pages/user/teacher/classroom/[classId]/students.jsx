import axios from "axios";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsCardList, BsJournal, BsPersonLinesFill } from "react-icons/bs";

const ClassroomStudents = ({ session }) => {
  const { query, pathname, asPath } = useRouter();
  const { classId } = query;

  const [classroom, setClassroom] = useState({ students: [] });

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
              <div className="flex h-fit w-fit items-center space-x-2">
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="whitespace-nowrap rounded bg-black px-2 py-1 text-sm text-white hover:bg-black/75"
                >
                  {showCode ? "Hide" : "Show"} class code
                </button>
              </div>
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
            <div className="flex items-center justify-between pt-4">
              <div className="flex h-fit w-full items-center space-x-2">
                <h4 className="font-bold">Students</h4>
              </div>
              <div className="flex h-fit w-full items-center justify-end space-x-2">
                <h4 className="">
                  {classroom.students.length} student
                  {classroom.students.length > 1 && "s"}
                </h4>
              </div>
            </div>
            <div className="h-fit w-full border-t">
              {classroom.students.length > 0 &&
                classroom.students.map((item) => (
                  <div className="flex h-fit w-full items-center space-x-4 border-b border-l border-r py-2 px-4">
                    <div className="relative h-8 w-8">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-sky-500 text-white">
                        <h6>{item.studentName.charAt(0)}</h6>
                      </div>
                    </div>
                    <div>
                      {item.studentName}{" "}
                      {session.firstname + " " + session.lastname ===
                        item.studentName && "(You)"}
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

export default ClassroomStudents;

export const getServerSideProps = async (context) => {
  const { req } = context;
  const session = await getSession({ req });
  if (session && session.role === "Teacher") {
    return {
      props: {
        session,
      },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: "/auth/signin",
    },
  };
};
