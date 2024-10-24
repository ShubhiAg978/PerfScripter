import fs from "fs";
import csv from "csv-parser";
import { parse } from "json2csv";

// Reusing the provided readCsvFile function
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

async function generateK6FromCSV(filePath) {
  const csvRows = await readCsvFile(filePath);

  let k6Script = `import http from 'k6/http';
 import { sleep, check, jsonpath } from 'k6';
    
    export let options = {
      scenarios: {`;

  // Group rows by 'Options'
  const groups = csvRows.reduce((acc, row) => {
    const groupName = row["Options"];
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(row);
    return acc;
  }, {});

  //Generate scenarios
  Object.keys(groups).forEach((groupName, index) => {
    k6Script += `
          '${groupName}': {
            executor: 'shared-iterations',
            vus: ${groups[groupName][0]["VUS"]},
            iterations: ${groups[groupName][0]["Iterations"]},
            maxDuration: '${groups[groupName][0]["maxDuration"] || "1m"}',
          },`;
  });

  k6Script += `
      },
    };
    
    export default function () {`;

  // Generate if blocks for each scenario
  Object.keys(groups).forEach((groupName) => {
    const scenarioVU = groups[groupName][0]["VUS"];
    k6Script += `
      if (__VU === ${scenarioVU}) {`;

    // Create a map to store dependencies
    const dependencyMap = new Map();

    groups[groupName].forEach((row, index) => {
      const method = row["Method_type"];
      const url = row["URL"] + row["Path"];
      const body = row["Payload"] || "";
      const rawHeader = row["rawHeader"];
      const correlationSerialNumber = row["Correlation SN"];
      const correlationVariable = row["correlationVariable"];
      const findsBetween = row["findBetweensCorrelation"];
      const ifinds = row["ifFindsCorrelation"];
      const ifIncludesresponse = row["ifIncludesResponse"];

      // Parse header into an object for k6
      let headers = {};
      if (rawHeader) {
        const headerTrimmedValue = rawHeader.replace(/^\{|\}$/g, ""); // Remove brackets
        headerTrimmedValue.split(",").forEach((header) => {
          const [key, value] = header.split(":").map((part) => part.trim());
          headers[key] = value;
        });
      } else {
        return "";
      }

      k6Script += `
          let response${index} = http.request("${method}", "${url}", \`${body}\`, { headers: ${JSON.stringify(
        headers
      )} });
      
      `;

      // if (correlationSerialNumber) {
      if (correlationVariable) {
        const [varkey, varValue] = correlationVariable
          .split(",")
          .map((part) => part.trim());
        k6Script += `const ${varkey} = res.json().${varValue};
    
        `;
      }

      if (findsBetween) {
        const [findKey, findsValue] = findsBetween
          .split(":")
          .map((part) => part.trim());
        let [leftValue, rightValue] = findsValue
          .split(",")
          .map((part) => part.trim());

        k6Script += `// Use findBetween to extract the first title encountered:
          const ${findKey} = findBetween(res.body, ${leftValue}, ${rightValue});
    
          `;
      }

      if (ifinds) {
        let [leftFindsValue, rightFindsValue] = ifinds
          .split(",")
          .map((part) => part.trim());
        k6Script += `  // Query the HTML for an input field named "redir". We want the value or "redir"
          const ${leftFindsValue} = res.html.${rightFindsValue};
    
          `;
      }

      // console.log("ifIncludesresponse", typeof ifIncludesresponse);

      if (ifIncludesresponse) {
        let [variable_key, ifIncludesresponseValue] = ifIncludesresponse
          .split(",")
          .map((part) => part.trim());
        k6Script += `check(response${index}, { 
          '${variable_key}': (r) => r.body.includes('${ifIncludesresponseValue}'),
          'status was 200': (r) => r.status === 200 });
        
          `;
      }

      k6Script += `
          sleep(1); // Adjust sleep as needed
        `;
    });

    k6Script += `
      } // End of scenario ${groupName}
      `;
  });

  k6Script += `
    } 
    `;

  return k6Script;
}

export { generateK6FromCSV };
