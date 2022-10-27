import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import Head from "next/head";
import { Fragment, useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import Link from "next/link";

const Student = ({ session }) => {
  const [isAdding, setAdding] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [classrooms, setClassrooms] = useState([]);

  const handleAddNew = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const { data } = await axios.post("/api/student/classroom/joinClass", {
      classCode,
      studentId: session.id,
      studentName: session.firstname + " " + session.lastname,
    });
    if (data) {
      getClassrooms();
    }
    setAdding(false);
    setSubmitting(false);
  };

  const getClassrooms = async () => {
    const { data } = await axios.post("/api/student/classroom/getClassrooms", {
      id: session.id,
    });
    if (data) {
      setClassrooms(data.classrooms);
    }
  };

  useEffect(() => {
    getClassrooms();
  }, []);

  return (
    <>
      <Head>
        <title>Student - Home</title>
      </Head>
      <div className="h-fit w-full">
        <div className="h-fit w-full py-2">
          <div className="flex h-fit w-full items-center justify-between">
            <h4 className="text-lg font-bold">Classrooms</h4>
            <button
              onClick={() => setAdding(true)}
              className="rounded bg-black px-2 py-1 text-sm text-white hover:bg-black/75"
            >
              + Join Class
            </button>
          </div>
          <div className="grid h-fit w-full grid-cols-3 gap-4 pt-4">
            {classrooms.length > 0 &&
              classrooms.map((item) => (
                <Link key={item._id} href={`student/classroom/${item._id}`}>
                  <a>
                    <div className="col-span-1 h-40 rounded border p-4 hover:scale-[1.025] hover:shadow-lg">
                      <div className="flex h-full w-full flex-col overflow-y-scroll">
                        <h2 className="text-2xl font-bold">{item.subject}</h2>
                        <h4>{item.teacherName}</h4>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
          </div>
        </div>
        <Transition.Root show={isAdding} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={setAdding}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative w-full max-w-xs transform overflow-hidden rounded bg-white text-left shadow-lg transition-all">
                    <div className="flex h-fit w-full flex-col items-center space-y-4 px-4 py-2">
                      <Dialog.Title>Join Class</Dialog.Title>
                      <div className="h-fit w-full">
                        <form onSubmit={handleAddNew} className="space-y-4">
                          <div className="group relative col-span-1 h-14">
                            <input
                              required
                              type="text"
                              name="newSubject"
                              id="newSubject"
                              value={classCode}
                              onChange={(event) =>
                                setClassCode(event.target.value)
                              }
                              className="peer h-full w-full rounded border border-gray-200 px-4 pt-6 focus:outline-none"
                            />
                            <label
                              htmlFor="newSubject"
                              className="peer pointer-events-none absolute top-4 left-4 transform font-light text-gray-500 transition-all group-focus-within:-translate-y-2 group-focus-within:text-xs peer-valid:-translate-y-2 peer-valid:text-xs"
                            >
                              Class Code
                            </label>
                          </div>

                          <div className="w-full">
                            <button
                              type="submit"
                              className="group relative flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                            >
                              {submitting ? "Joining..." : "Join"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </>
  );
};

export default Student;

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
