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
  BsCardList,
  BsFilePdf,
  BsJournal,
  BsPersonLinesFill,
} from "react-icons/bs";
import path from "path";
import { Disclosure } from "@headlessui/react";

const StudentClassroom = () => {
  const { query, pathname, asPath } = useRouter();
  const { classId } = query;

  const [classroom, setClassroom] = useState({});

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

  const Attachment = ({ name }) => {
    const base = path.basename(name);
    return <>{base}</>;
  };

  const refs = useMemo(() => {
    if (classroom && classroom.lessons)
      return (
        classroom.lessons.map(() => {
          return createRef();
        }) ?? []
      );
  }, [classroom]);

  const handleClosingOthers = (id) => {
    const otherRefs = refs.filter((ref) => {
      return ref.current?.getAttribute("data-id") !== id;
    });

    otherRefs.forEach((ref) => {
      const isOpen = ref.current?.getAttribute("data-open") === "true";

      if (isOpen) {
        ref.current?.click();
      }
    });
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
                <h4 className="text-lg font-bold">{classroom.subject}</h4>
                <h5 className="rounded border px-1 text-sm">
                  Section {classroom.section}
                </h5>
              </div>
            </div>
            <div className="sticky top-16 left-0 flex h-12 w-full items-end justify-start border-b bg-white">
              <Link href={`${classId}`}>
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
              <Link href={`${classId}/people`}>
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
              <Link href={`${classId}/quizzes`}>
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
                  Lesson No.
                </div>
                <div className="h-fit w-5/6 bg-gray-100 p-4">Title</div>
              </div>
              {classroom.lessons &&
                classroom.lessons.length > 0 &&
                classroom.lessons.map((item, index) => (
                  <Disclosure
                    as="div"
                    key={item._id}
                    className={`h-fit w-full border-t py-2 px-4 hover:bg-gray-100`}
                  >
                    {({ open, close }) => (
                      <>
                        <Disclosure.Button
                          as="button"
                          ref={refs[index]}
                          onClick={() => handleClosingOthers(item.id)}
                          data-id={item._id}
                          data-open={open}
                          className="flex w-full"
                        >
                          <div className="flex h-fit w-1/6">{item.number}</div>
                          <div className="flex h-fit w-3/6">{item.title}</div>
                          <div className="flex h-fit w-2/6 justify-end text-sm">
                            <Link href={item.attachments}>
                              <a className="flex items-center text-blue-500 hover:underline">
                                <BsFilePdf className="mr-2 h-4 w-4" />
                                <Attachment name={item.attachments} />
                              </a>
                            </Link>
                          </div>
                        </Disclosure.Button>
                        <Disclosure.Panel
                          as="div"
                          className="py-2 text-sm text-gray-500"
                        >
                          Notes: {item.notes}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentClassroom;
