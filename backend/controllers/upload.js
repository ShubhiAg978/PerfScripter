import { generateJMXFromCSV } from "./jmxGenerators.js";
import {
  generateParentScalaFromCSV,
  generateScalaFromCSV,
} from "./scalaGenerators.js";
import { generateK6FromCSV } from "./k6Generators.js";

export const fileUpload1 = async (req, res, next) => {
  try {
    const filePath = req.file.path;
    // console.log("filePath", filePath);
    const jmxScript = await generateJMXFromCSV(filePath);

    // Send the JMX script as a response back to the frontend
    res.json({
      success: true,
      jmxScript: jmxScript.toString(), // Ensure jmxScript is converted to a string
    });
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

export const fileUpload2 = async (req, res, next) => {
  try {
    const filePath = req.file.path;
    const parentScalaScript = await generateParentScalaFromCSV(filePath);
    const scalaScript = await generateScalaFromCSV(filePath);

    // Include parentScalaScript as the first element in scalaScript array
    scalaScript.unshift(parentScalaScript);
    // Send the JMX script as a response back to the frontend
    res.json({
      success: true,
      // scalaScript: parentScalaScript.toString(),
      scalaScripts: scalaScript.map((script) => script.toString()),
    });
  } catch (error) {
    next(error);
  }
};

export const fileUpload3 = async (req, res, next) => {
  try {
    const filePath = req.file.path;
    const k6Script = await generateK6FromCSV(filePath);

    res.json({
      success: true,
      k6Script: k6Script.toString(),
    });
  } catch (error) {
    next(error);
  }
};
