import fs from "fs";
import csv from "csv-parser";
// import builder from "xmlbuilder"

function readCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        rows.push(row);
      })
      .on("end", () => {
        resolve(rows);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function generateParentScalaFromCSV(filePath) {
  // console.log("Error in generateParentScalaFromCSV");
  const csvRows = await readCsvFile(filePath);

  const apisByScenario = {}; // Group APIs by scenario name

  csvRows.forEach((row) => {
    const scenarioName = row["Scenario Name"];
    if (!apisByScenario[scenarioName]) {
      apisByScenario[scenarioName] = row;
    }
  });

  // Create the Scala script content
  let scalaContent = `import scala.concurrent.duration._
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._
import java.io._
`;

  for (const vart in apisByScenario) {
    const row = apisByScenario[vart];
    // Assuming `row` is an array containing API objects
    const scName = row["Scenario Name"]; // Assuming the first API object contains the scenario name

    scalaContent += `import ${scName}._
`;
  }

  scalaContent += `
class TestSimulation extends Simulation {

`;

  let index1 = 1;
  for (const vart in apisByScenario) {
    const row = apisByScenario[vart];
    // Assuming `row` is an array containing API objects
    const baseurl = row["Base URL"];

    scalaContent += `val httpProtocol${index1} = http.baseURL("${baseurl}")
`;
    index1++;
  }

  // console.log(scalaContent);

  scalaContent += `

//***********Forever execution********************//
`;

  let index2 = 1;
  for (const vart in apisByScenario) {
    const row = apisByScenario[vart];
    const scName = row["Scenario Name"];

    scalaContent += `val scn${index2} = scenario("${scName}").forever{exec(${scName}.${scName})}
`;
    index2++;
  }

  scalaContent += `

//*******************Forever Execution********************//
`;

  let index3 = 1;
  for (const vart in apisByScenario) {
    const row = apisByScenario[vart];
    const duration = row["Duration"];
    const ramp = row["RampUp"];
    const time = row["Time"];

    scalaContent += `setUp(scn${index3}.inject(rampUsers(${ramp}) over(${time} seconds)).protocols(httpProtocol${index3})).maxDuration(${duration} minutes)
`;
    index3;
  }

  // Close the class definition
  scalaContent += `
}
`;

  return scalaContent;
}

async function generateScalaFromCSV(filePath) {
  // console.log("Error in generateScalaFromCSV");
  const csvRows = await readCsvFile(filePath);

  const groupScalaContents = [];

  const ScenarioGroup = [
    ...new Set(csvRows.map((row) => row["Scenario Name"])),
  ];

  ScenarioGroup.forEach((scenarioGroup) => {
    // Create the Scala script content
    let scalaContent = `import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._
import scala.concurrent.duration._
import scala.io.Source
import scala.util.Random
import java.util.Date
import java.time._
import java.text.SimpleDateFormat
import java.util.UUID
import java.io._\n\n`;

    const groupRows = csvRows.filter(
      (row) => row["Scenario Name"] === scenarioGroup
    );

    scalaContent += `object ${scenarioGroup} {\n\n\n`;

    //Add feeder details here
    groupRows.forEach((row) => {
      const feeder = row["Feeder"];
      const feederArray = feeder.split(",").map((csv) => csv.trim()); // Split and trim spaces

      if (feederArray && feederArray.length > 0) {
        feederArray.forEach((feederCsv, index) => {
          // Create a variable name based on the feeder name
          if (feederCsv != "") {
            scalaContent += `val feeder_${
              index + 1
            } = csv("${feederCsv}.csv").circular\n`;
          }
        });
      }
    });

    scalaContent += `\n\nval ${scenarioGroup} = exitBlockOnFail{\n\n`;

    var dependencyMap = new Map();
    //eachAPIdetails
    groupRows.forEach((row, index) => {
      const currentSerialNumber = row["Serial Number"];
      const url = row["Base URL"];
      const method = row["Method"];
      const path = row["Path"];
      const payload_data = row["Data"];
      const header = row["Header"];
      const correlationSerialNumber = row["Correlation Serial number"];
      const scN = row["Scenario Name"];
      const methodData = row["Checks"];
      const ownData = row["OwnData"];
      const feeder = row["Feeder"];
      const changeURL = row["ChangeUrl"];

      var cSNumberArray;
      if (correlationSerialNumber) {
        cSNumberArray = correlationSerialNumber
          .split(",")
          .map((csv) => csv.trim());
      }
      // console.log("cSNumberArray", cSNumberArray);
      var methodDataArray;
      if (methodData) {
        methodDataArray = methodData.split("::").map((csv) => csv.trim());
      }

      // Generate HTTP request
      scalaContent += `.exec(http("${index + 1}_API")
          .${method.toLowerCase()}`;

      let pathVariable;
      if (changeURL) {
        pathVariable = changeURL;
      } else {
        pathVariable = path;
      }
      scalaContent += `("${pathVariable}")\n\t\t`;

      // console.log("dependencyMapOutsideHeader", dependencyMap);

      // if (header) {
      //   const headerTrimmedValue = header.replace(/^\{|\}$/g, ""); // Remove brackets
      //   const headerArray = headerTrimmedValue
      //     .split(",")
      //     .map((csv) => csv.trim());

      //   scalaContent += `.header(Map("`;

      //   if (headerArray && headerArray.length > 0) {
      //     headerArray.forEach((headerMapValue, index) => {
      //       if (headerMapValue != "") {
      //         scalaContent += `${headerMapValue},\n\t\t\t`;
      //       }
      //     });
      //   }
      //   const element = `${currentSerialNumber}`;
      //   // console.log(Array.from(dependencyMap.keys()));
      //   const new_array = Array.from(dependencyMap.keys());
      //   // console.log("new_array", new_array);
      //   // console.log("element", element);
      //   // Check if currentSerialNumber is present in dependencyMap
      //   if (new_array.includes(element)) {
      //     //dependencyData is an array of Map
      //     var dependencyData = dependencyMap.get(element);
      //     // console.log(dependencyData);
      //     dependencyData.forEach((data) => {
      //       // console.log(data);
      //       const mapkey = data.keys().next().value;
      //       // console.log("mapkey", mapkey);
      //       const mapValue = data.get(mapkey);
      //       // console.log("mapValue", mapValue);
      //       scalaContent += `${mapkey} : ${mapValue},\n\t`;
      //     });
      //     // for (data of dependencyData) {
      //     //   const mapkey = data.key();
      //     //   const mapValue = data.value();
      //     //   scalaContent += `${mapkey} : ${mapValue},\n\t`;
      //     // }
      //   }
      //   scalaContent += `)\n\t\t`;
      // }
      if (header) {
        const headerTrimmedValue = header.replace(/^\{|\}$/g, ""); // Remove brackets
        const headerArray = headerTrimmedValue
          .split(",")
          .map((csv) => csv.trim());

        scalaContent += `.header(Map(`;

        if (headerArray && headerArray.length > 0) {
          headerArray.forEach((headerMapValue, index) => {
            if (headerMapValue != "") {
              // Split the string into key and value
              const [key, value] = headerMapValue
                .split(":")
                .map((part) => part.trim());
              scalaContent += `\n\t\t"${key}" -> "${value}"`;

              // console.log(key, value);

              // // Check if it's not the last pair before adding a comma
              // if (index < headerArray.length - 1) {
              //   scalaContent += `,`;
              // }

              // scalaContent += `\n\t\t\t`;
            }
          });
        }

        const element = `${currentSerialNumber}`;
        const new_array = Array.from(dependencyMap.keys());

        if (new_array.includes(element)) {
          var dependencyData = dependencyMap.get(element);

          dependencyData.forEach((data, index) => {
            const mapkey = data.keys().next().value;
            const mapValue = data.get(mapkey);
            scalaContent += `,\n\t\t"${mapkey}" -> "${mapValue}"`;

            // // Check if it's not the last pair before adding a comma
            // if (index < dependencyData.length - 1) {
            //   scalaContent += `,`;
            // }

            // scalaContent += `\n\t`;
          });
        }
        scalaContent += `)\n\t\t)\n\t\t`;
      }

      if (payload_data) {
        scalaContent += `.body(StringBody("""{"${payload_data}"}.asJSON"""))\n\t\t`;
      }
      if (ownData) {
        const ownDataTrimmedValue = ownData.replace(/^\{|\}$/g, ""); // Remove brackets
        const ownDataArray = ownDataTrimmedValue
          .split(",")
          .map((csv) => csv.trim()); // Split and trim spaces
        // const ownDataArray = JSON.parse(ownData);
        // console.log(ownDataArray);
        for (const pairArray of ownDataArray) {
          // console.log(pairArray);
          if (pairArray != "") {
            const pair_p = pairArray.split("::").map((csv) => csv.trim()); // Split and trim spaces
            // console.log(pair_p);
            scalaContent += `.check(jsonPath("${pair_p[0]}").is("${pair_p[1]}"))\n\t\t`;
          }
        }
        // if (methodData) {
        //   const mData = methodDataArray[index]
        //     .split(";")
        //     .map((csv) => csv.trim());
        // }
      }
      // console.log("methodDataArray", methodDataArray);
      if (cSNumberArray) {
        cSNumberArray.forEach((csN, index) => {
          const mData = methodDataArray[index]
            .split(";")
            .map((csv) => csv.trim());
          //mD is Map of data of one correlation serial number
          const mArray = [];
          for (var mD of mData) {
            const dataKey = mD.split(":").map((csv) => csv.trim());
            const dataKeyDataType = dataKey[0]; // header or body
            const dataKeyValue = dataKey[1]; // values
            const dataKeyValueArray = dataKeyValue
              .split(",")
              .map((csv) => csv.trim());
            const dataKeyValueArrayKey = dataKeyValueArray[0];
            const dataKeyValueArrayValue = dataKeyValueArray[1];
            scalaContent += `.check(jsonPath("$.${dataKeyValueArrayKey}").saveAs("${dataKeyValueArrayValue}"))\n\t\t`;
            if (dataKeyDataType.toLowerCase() == "header") {
              const myMap = new Map();
              myMap.set(dataKeyValueArrayKey, dataKeyValueArrayValue);
              mArray.push(myMap);
            }
          }
          if (mArray.length != 0) {
            dependencyMap.set(csN, mArray);
            // console.log("dependencyMap", dependencyMap);
          }
        });
      }

      scalaContent += `)\n\n`;
    });
    scalaContent += `\t\t}
}
  `;
    groupScalaContents.push(scalaContent);
  });

  return groupScalaContents;
}

export { generateParentScalaFromCSV, generateScalaFromCSV };
