// Landing.js
import { useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/LanguageOptions.js";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { defineTheme } from "../constants/defineTheme.js";
import useKeyPress from "../hooks/useKeyPress.js";
// import Footer from "./Footer";
import OutputWindow from "./OutputWindow";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";
import defaultTemplatePy from "../constants/templates/Python.js";
import defaultTemplateCpp from "../constants/templates/CPP.js";
import defaultTemplateJs from "../constants/templates/Javascript";

const Landing = () => {
  const [code, setCode] = useState(defaultTemplatePy);
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (sl) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
    if (sl.id === 1) {
      setCode(defaultTemplatePy);
    } else if (sl.id === 2) {
      setCode(defaultTemplateCpp);
    } else if (sl.id === 3) {
      setCode(defaultTemplateJs);
    }
  };

  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      handleCompile();
    }
  }, [ctrlPress, enterPress]);
  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };
  const handleCompile = async () => {
    // We will come to the implementation later in the code
    setProcessing(true);
    const payload = {
      language: language.value,
      code,
    };
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/run`,
        payload
      );
      // console.log(dataRes);
      checkStatus(data.jobId);
    } catch (err) {
      console.log(err);
    }
  };

  const checkStatus = async (token) => {
    // We will come to the implementation later in the code
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/status`,
        {
          params: { id: token },
        }
      );
      // console.log("First Resp->", data);
      let status = data?.job.status;

      // Processed - we have a result
      if (status === "pending") {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(data.job);
        showSuccessToast(`Compiled Successfully!`);
        console.log("response.data", data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  function handleThemeChange(th) {
    // We will come to the implementation later in the code
    const theme = th;
    console.log("theme...", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }
  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showErrorToast = (msg) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="h-9 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-center text-3xl">
        Online IDE - Arbaz Alam
      </div>
      <div className="flex flex-row">
        <div className="px-4 py-2">
          <LanguagesDropdown onSelectChange={onSelectChange} />
        </div>
        <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
      </div>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-full h-full justify-start items-end">
          <CodeEditor
            code={code}
            onChange={onChange}
            language={language?.value}
            theme={theme.value}
          />
        </div>

        <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
          <OutputWindow outputDetails={outputDetails} />
          <div className="flex flex-col items-end">
            {/* <CustomInput
              customInput={customInput}
              setCustomInput={setCustomInput}
            /> */}
            <p>Press Cntrl+Enter to run code</p>
            <button
              onClick={handleCompile}
              disabled={!code}
              className={classnames(
                "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                !code ? "opacity-50" : ""
              )}
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
          </div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};
export default Landing;
