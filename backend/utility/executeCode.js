import { exec } from "child_process";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import CodeRunnerJob from "../models/CodeRunnerJob.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);

  return new Promise((resolve, reject) => {
    exec(
      `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};
const executePy = (filepath) => {
  return new Promise((resolve, reject) => {
    exec(`python ${filepath}`, (error, stdout, stderr) => {
      error && reject({ error, stderr });
      stderr && reject(stderr);
      resolve(stdout);
    });
  });
};

const executeJavascript = (filepath) => {
  return new Promise((resolve, reject) => {
    exec(`node ${filepath}`, (error, stdout, stderr) => {
      error && reject({ error, stderr });
      stderr && reject(stderr);
      resolve(stdout);
    });
  });
};

const codeExecute = async (jobId) => {
  const job = await CodeRunnerJob.findById(jobId);
  if (job === undefined) {
    // throw Error(`cannot find Job with id ${jobId}`);
    return true;
  }
  try {
    let output;
    job["startedAt"] = new Date();
    if (job.language === "cpp") {
      output = await executeCpp(job.filepath);
    } else if (job.language === "py") {
      output = await executePy(job.filepath);
    } else if (job.language === "js") {
      output = await executeJavascript(job.filepath);
    }
    job["completedAt"] = new Date();
    job["output"] = output;
    job["status"] = "success";
    await job.save();
    return true;
  } catch (err) {
    job["completedAt"] = new Date();
    job["output"] = err.stderr;
    job["status"] = "error";
    await job.save();
    // throw Error("Syntax Error");
    return true;
  }
};
export { codeExecute };
