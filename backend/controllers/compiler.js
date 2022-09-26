import CodeRunnerJob from "../models/CodeRunnerJob.js";
import { codeExecute } from "../utility/executeCode.js";
import { generateFile } from "../utility/generateFile.js";

const codeRunner = async (req, res) => {
  const { language = "cpp", code } = req.body;

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }
  // need to generate a c++ file with content from the request
  try {
    const filepath = await generateFile(language, code);
    const job = await new CodeRunnerJob({ language, filepath }).save();
    const jobId = job["_id"];
    codeExecute(jobId);
    res.status(201).json({ jobId });
  } catch (err) {
    console.log("My name:-", err);
  }
};

const checkStatus = async (req, res) => {
  const jobId = req.query.id;

  if (jobId === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "missing id query param" });
  }

  const job = await CodeRunnerJob.findById(jobId);

  if (job === undefined) {
    return res.status(400).json({ success: false, error: "couldn't find job" });
  }

  return res.status(200).json({ success: true, job });
};

export { codeRunner, checkStatus };
