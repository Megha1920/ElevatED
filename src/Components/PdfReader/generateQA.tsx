import { useEffect, useState } from "react";
import styles from "./styles .module.css";
import { supabase } from "../../utils/supabase";
import { useModuleStore } from "../../Sections/Faculties/Pages/Courses/components/IndividualSubjects";
import toast from "react-hot-toast";

type GenerateQAProps = {
  text?: string;
};

type QAPair = {
  question: string;
  answer: string;
};

export const GenerateQA = ({ text }: GenerateQAProps) => {
  const [qaPairs, setQAPairs] = useState<QAPair[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const modules = useModuleStore.getState().modules;
  const courseID = useModuleStore.getState().courseID;
  const setModules = useModuleStore((state) => state.setModules);
  const [refresh, setRefresh] = useState(false);
  const moduleID = useModuleStore.getState().moduleID;
  const [qaNo, setQaNo] = useState("2");

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const fetchData = async () => {
    let { data: courses, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseID)
      .single();
    if (error) {
      throw error.message;
    } else if (courses) {
      setModules(courses.modules);
      return courses;
    }
  };

  const handleAskQuestionClick = async () => {
    setRefresh(!refresh);
    if (!text) {
      console.error("No text available to send");
      return;
    }

    setIsLoading(true); // Start loading
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/quest/longanswergenerate/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ context: text, noq: qaNo }),
        }
      );
      const data = await response.json(); // Handle response data

      if (data && data.set) {
        const pairs = data.set.map((item: QAPair) => ({
          question: item.question,
          answer: item.answer,
        }));
        setQAPairs(pairs);
        savetoDB(pairs);
      } else {
        console.log("No data found");
        setQAPairs([]); // Clear previous data if no new data found
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false); // End loading
  };

  const savetoDB = async (pairs: QAPair[]) => {
    const module = modules.filter((mod) => mod.id === moduleID);
    const updatedModule = { ...module[0], longQA: pairs };
    const filteredModules = modules.filter(
      (mod) => mod.id !== updatedModule.id
    );
    const updatedModules = [...filteredModules, updatedModule];
    const { data: updatedData, error } = await supabase
      .from("courses")
      .update({ modules: updatedModules })
      .eq("id", courseID)
      .select();
    if (error) {
      toast.error(error.message);
    } else if (updatedData) {
      toast.success("Long Questions added to Module");
    }
  };

  return (
    <div className={styles.pdfSec}>
      <button onClick={handleAskQuestionClick} disabled={isLoading}>
        {isLoading ? "Loading..." : "Ask Long Questions and Answers"}
      </button>
      No. of questions:{" "}
      <input type="text" onChange={(e) => setQaNo(e.target.value)} />
      {isLoading && <div>Loading...</div>}
      {qaPairs.length > 0 && (
        <ul>
          {qaPairs.map((pair, index) => (
            <li key={index}>
              <strong>Question:</strong> {pair.question}
              <br />
              <strong>Answer:</strong> {pair.answer}
            </li>
          ))}
        </ul>
      )}
      {qaPairs.length === 0 && !isLoading && (
        <p>No questions and answers to display.</p>
      )}
    </div>
  );
};
