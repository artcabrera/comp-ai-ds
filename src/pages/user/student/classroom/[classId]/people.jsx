import axios from "axios";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsCardList, BsJournal, BsPersonLinesFill } from "react-icons/bs";

const Classmates = ({ session }) => {
  const { query, pathname, asPath } = useRouter();
  const { classId } = query;

  const [classroom, setClassroom] = useState({ students: [], teacherName: "" });

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
                <h4 className="text-lg font-bold">{classroom.subject}</h4>
                <h5 className="rounded border px-1 text-sm">
                  Section {classroom.section}
                </h5>
              </div>
            </div>
            <div className="sticky top-16 left-0 flex h-12 w-full items-end justify-start border-b bg-white">
              <Link href={`../${classId}`}>
                <a
                  className={`${
                    !asPath.includes(`${classId}/people`)
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
                    asPath.includes(`${classId}/people`)
                      ? "border-b-black font-medium"
                      : "border-b-transparent"
                  } flex items-center border-b-2 px-1 pb-1`}
                >
                  <span className="flex items-center rounded px-2 py-1 text-sm hover:bg-black/10">
                    <BsPersonLinesFill className="mr-2 h-4 w-4" /> People
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
            <div className="mt-2 h-fit w-full">
              <div className="flex items-center justify-between pt-2">
                <div className="flex h-fit w-full items-center space-x-2">
                  <h4 className="font-bold">Teacher</h4>
                </div>
              </div>
              <div className="flex h-fit w-full items-center space-x-4 border py-2 px-4">
                <div className="relative h-8 w-8">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-amber-500 text-white">
                    <h6>{classroom.teacherName.charAt(0)}</h6>
                  </div>
                </div>
                <div>{classroom.teacherName}</div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex h-fit w-full items-center space-x-2">
                  <h4 className="font-bold">Classmates</h4>
                </div>
                <div className="flex h-fit w-full items-center justify-end space-x-2">
                  <h4 className="">
                    {classroom.students.length} student
                    {classroom.students.length > 1 && "s"}
                  </h4>
                </div>
              </div>
              <div className="flex h-fit w-full items-center space-x-4 border-r border-l border-t py-2 px-4">
                <div className="relative h-8 w-8">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-sky-500 text-white">
                    <h6>{session.firstname.charAt(0)}</h6>
                  </div>
                </div>
                <div>
                  {session.firstname + " " + session.lastname + " (You)"}
                </div>
              </div>
              <div className="h-fit w-full border-t">
                {classroom.students.length > 0 &&
                  classroom.students
                    .filter((item) => item.student !== session.id)
                    .map((item) => (
                      <div className="flex h-fit w-full items-center space-x-4 border-b border-l border-r py-2 px-4">
                        <div className="relative h-8 w-8">
                          <div className="flex h-full w-full items-center justify-center rounded-full bg-sky-500 text-white">
                            <h6>{item.studentName.charAt(0)}</h6>
                          </div>
                        </div>
                        <div>{item.studentName}</div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Classmates;

export const getServerSideProps = async (context) => {
  const { req } = context;
  const session = await getSession({ req });
  if (session && session.role === "Student") {
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
