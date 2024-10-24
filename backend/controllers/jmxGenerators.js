import fs from "fs";
import csv from "csv-parser";

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

// async function generateJMXFromCSV(filePath) {
//   const csvRows = await readCsvFile(filePath);

//   const apisGroups = {}; // Group APIs by unique thread name

//   csvRows.forEach((row) => {
//     const threadName = row["Thread Group"];
//     if (!apisGroups[threadName]) {
//       apisGroups[threadName] = row;
//     }
//   });

//   let jmxContent = `<?xml version="1.0" encoding="UTF-8"?>
//     <jmeterTestPlan version="1.2" properties="5.0" jmeter="5.6.3">
//       <hashTree>
//         <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="Test Plan">
//             <elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" testname="User Defined Variables">
//             <collectionProp name="Arguments.arguments"/>
//             </elementProp>
//         </TestPlan>
//         <hashTree>
//           `;
//   for (const ind in apisGroups) {
//     const row = apisGroups[ind];
//     const threadGroup = row["Thread Group"];
//     const threads = row["Threads"];
//     const duration = row["Duration"];
//     const ramp = row["RampUp"];
//     const loop = row["Loop"];

//     let groupContent = `<ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="${threadGroup}" enabled="true">
//       <intProp name="ThreadGroup.num_threads">${threads}</intProp>
//       <intProp name="ThreadGroup.ramp_time">${ramp}</intProp>
//       <stringProp name="ThreadGroup.duration">${duration}</stringProp>
//       <boolProp name="ThreadGroup.same_user_on_next_iteration">true</boolProp>
//       <boolProp name="ThreadGroup.scheduler">true</boolProp>
//       <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>
//       <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController">
//           <stringProp name="LoopController.loops">${loop}</stringProp>
//           <boolProp name="LoopController.continue_forever">false</boolProp>
//       </elementProp>
//       </ThreadGroup>
//       <hashTree>
//       `;

//     const groupRows = csvRows.filter(
//       (row) => row["Thread Group"] === threadGroup
//     );
//     // Create a map to store dependencies
//     const dependencyMap = new Map();
//     //eachAPIdetails
//     groupRows.forEach((row, index) => {
//       const currentSerialNumber = row["Serial Number"];
//       const url = row["Base URL"];
//       const method = row["Method"];
//       const path = row["Path"];
//       const APIName = row["API_Name"];
//       const payload_data = row["Data"];
//       const header = row["Header"];
//       const correlationSerialNumber = row["Correlation Serial number"];
//       const threadGroup = row["Thread Group"];
//       const methodData = row["MethodData"];

//       var cSNumberArray;
//       if (correlationSerialNumber) {
//         cSNumberArray = correlationSerialNumber
//           .split(",")
//           .map((csv) => csv.trim());
//       }
//       // console.log("cSNumberArray", cSNumberArray);
//       var methodDataArray;
//       if (methodData) {
//         methodDataArray = methodData.split("::").map((csv) => csv.trim());
//       }
//       var headerArray;
//       if (header) {
//         const headerTrimmedValue = header.replace(/^\{|\}$/g, ""); // Remove brackets
//         headerArray = headerTrimmedValue.split(",").map((csv) => csv.trim());
//       }
//       // console.log("method array", methodDataArray);
//       // console.log("headerArray", headerArray);

//       groupContent += `<HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="${APIName}">
//       <stringProp name="HTTPSampler.domain">${url}</stringProp>
//       <stringProp name="HTTPSampler.path">${path}</stringProp>
//       <stringProp name="HTTPSampler.method">${method}</stringProp>
//       <stringProp name="HTTPSampler.port">8080</stringProp>
//       <stringProp name="HTTPSampler.protocol">http</stringProp>
//       <boolProp name="HTTPSampler.follow_redirects">true</boolProp>
//       <boolProp name="HTTPSampler.use_keepalive">true</boolProp>
//       <boolProp name="HTTPSampler.postBodyRaw">true</boolProp>
//       <elementProp name="HTTPsampler.Arguments" elementType="Arguments">
//           <collectionProp name="Arguments.arguments">
//               <elementProp name="data" elementType="HTTPArgument">
//                   <boolProp name="HTTPArgument.always_encode">false</boolProp>
//                   <stringProp name="Argument.name">data</stringProp>
//                   <stringProp name="Argument.value">${payload_data}</stringProp>
//                   <stringProp name="Argument.metadata">=</stringProp>
//               </elementProp>
//           </collectionProp>
//       </elementProp>
//   </HTTPSamplerProxy>
//       `;

//       if (header && correlationSerialNumber) {
//         groupContent += `<hashTree>
//           <HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Manager">
//               <collectionProp name="HeaderManager.headers">
//               `;
//         headerArray.forEach((headerMapValue) => {
//           if (headerMapValue != "") {
//             // Split the string into key and value
//             const [key, value] = headerMapValue
//               .split(":")
//               .map((part) => part.trim());
//             // console.log(key, value);

//             groupContent += `<elementProp name="${key}" elementType="Header">
//                   <stringProp name="Header.name">${key}</stringProp>
//                   <stringProp name="Header.value">${value}</stringProp>
//               </elementProp>\n`;
//           }
//         });
//         const element = `${currentSerialNumber}`;
//         const new_array = Array.from(dependencyMap.keys());

//         if (new_array.includes(element)) {
//           var dependencyData = dependencyMap.get(element);

//           dependencyData.forEach((data, index) => {
//             const mapkey = data.keys().next().value;
//             const mapValue = data.get(mapkey);
//             groupContent += `<elementProp name="${mapkey}" elementType="Header">
//                   <stringProp name="Header.name">${mapkey}</stringProp>
//                   <stringProp name="Header.value">${mapValue}</stringProp>
//               </elementProp>\n`;
//           });
//         }

//         groupContent += `
//               </collectionProp>
//           </HeaderManager>
//           <hashTree/>`;

//         cSNumberArray.forEach((csN, index) => {
//           const mData = methodDataArray[index]
//             .split(";")
//             .map((csv) => csv.trim());
//           //mD is Map of data of one correlation serial number
//           const mArray = [];
//           for (var mD of mData) {
//             const dataKey = mD.split(":").map((csv) => csv.trim());
//             const dataKeyDataType = dataKey[0]; // header or body
//             const dataKeyValue = dataKey[1]; // values
//             const dataKeyValueArray = dataKeyValue
//               .split(",")
//               .map((csv) => csv.trim());
//             const dataKeyValueArrayKey = dataKeyValueArray[0];
//             const dataKeyValueArrayValue = dataKeyValueArray[1];
//             if (dataKeyDataType.toLowerCase() == "header") {
//               const myMap = new Map();
//               myMap.set(dataKeyValueArrayKey, dataKeyValueArrayValue);
//               mArray.push(myMap);
//             }
//             groupContent += `<JSONPostProcessor guiclass="JSONPostProcessorGui" testclass="JSONPostProcessor" testname="JSON PostProcessor - ${dataKeyValueArrayKey}" enabled="true">
//                         <stringProp name="JSONPostProcessor.referenceNames">${dataKeyValueArrayKey}</stringProp>
//                         <stringProp name="JSONPostProcessor.values">${dataKeyValueArrayValue}</stringProp>
//                         <stringProp name="JSONPostProcessor.match_numbers">1</stringProp>
//                     </JSONPostProcessor>
//                     <hashTree/>
//                     `;
//           }
//           if (mArray.length != 0) {
//             dependencyMap.set(csN, mArray);
//             // console.log("dependencyMap", dependencyMap);
//           }
//         });
//         groupContent += `</hashTree> `;
//       } else if (correlationSerialNumber) {
//         cSNumberArray.forEach((csN, index) => {
//           const mData = methodDataArray[index]
//             .split(";")
//             .map((csv) => csv.trim());
//           //mD is Map of data of one correlation serial number
//           const mArray = [];
//           for (var mD of mData) {
//             const dataKey = mD.split(":").map((csv) => csv.trim());
//             const dataKeyDataType = dataKey[0]; // header or body
//             const dataKeyValue = dataKey[1]; // values
//             const dataKeyValueArray = dataKeyValue
//               .split(",")
//               .map((csv) => csv.trim());
//             const dataKeyValueArrayKey = dataKeyValueArray[0];
//             const dataKeyValueArrayValue = dataKeyValueArray[1];
//             if (dataKeyDataType.toLowerCase() == "header") {
//               const myMap = new Map();
//               myMap.set(dataKeyValueArrayKey, dataKeyValueArrayValue);
//               mArray.push(myMap);
//             }
//             groupContent += `<JSONPostProcessor guiclass="JSONPostProcessorGui" testclass="JSONPostProcessor" testname="JSON PostProcessor - ${dataKeyValueArrayKey}" enabled="true">
//           <stringProp name="JSONPostProcessor.referenceNames">${dataKeyValueArrayKey}</stringProp>
//           <stringProp name="JSONPostProcessor.values">${dataKeyValueArrayValue}</stringProp>
//           <stringProp name="JSONPostProcessor.match_numbers">1</stringProp>
//       </JSONPostProcessor>
//       <hashTree/>
//       `;
//           }
//           if (mArray.length != 0) {
//             dependencyMap.set(csN, mArray);
//             // console.log("dependencyMap", dependencyMap);
//           }
//         });
//         groupContent += `</hashTree> `;
//       } else if (header) {
//         groupContent += `<hashTree>
// <HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Manager">
// <collectionProp name="HeaderManager.headers">
// `;
//         headerArray.forEach((headerMapValue) => {
//           if (headerMapValue != "") {
//             // Split the string into key and value
//             const [key, value] = headerMapValue
//               .split(":")
//               .map((part) => part.trim());
//             // console.log(key, value);

//             groupContent += `<elementProp name="${key}" elementType="Header">
// <stringProp name="Header.name">${key}</stringProp>
// <stringProp name="Header.value">${value}</stringProp>
// </elementProp>\n`;
//           }
//         });

//         const element = `${currentSerialNumber}`;
//         const new_array = Array.from(dependencyMap.keys());

//         if (new_array.includes(element)) {
//           var dependencyData = dependencyMap.get(element);
//           dependencyData.forEach((data, index) => {
//             const mapkey = data.keys().next().value;
//             const mapValue = data.get(mapkey);
//             groupContent += `<elementProp name="${mapkey}" elementType="Header">
//           <stringProp name="Header.name">${mapkey}</stringProp>
//           <stringProp name="Header.value">${mapValue}</stringProp>
//       </elementProp>\n`;
//           });
//         }

//         groupContent += `
//   </collectionProp>
// </HeaderManager>
// <hashTree/>`;
//         groupContent += `</hashTree> `;
//       } else {
//         const element = `${currentSerialNumber}`;
//         const new_array = Array.from(dependencyMap.keys());

//         if (new_array.includes(element)) {
//           var dependencyData = dependencyMap.get(element);

//           groupContent += `<hashTree>
// <HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Manager">
//   <collectionProp name="HeaderManager.headers">
//   `;

//           dependencyData.forEach((data, index) => {
//             const mapkey = data.keys().next().value;
//             const mapValue = data.get(mapkey);
//             groupContent += `<elementProp name="${mapkey}" elementType="Header">
//           <stringProp name="Header.name">${mapkey}</stringProp>
//           <stringProp name="Header.value">${mapValue}</stringProp>
//       </elementProp>\n`;
//           });
//           groupContent += `
//   </collectionProp>
// </HeaderManager>
// <hashTree/>`;
//           groupContent += `</hashTree> `;
//         } else {
//           groupContent += `<hashTree/>
//                   `;
//         }
//       }
//     });
//     groupContent += `<ResultCollector guiclass="ViewResultsFullVisualizer" testclass="ResultCollector" testname="View Results Tree">
//     <boolProp name="ResultCollector.error_logging">false</boolProp>
//     <objProp>
//       <name>saveConfig</name>
//       <value class="SampleSaveConfiguration">
//         <time>true</time>
//         <latency>true</latency>
//         <timestamp>true</timestamp>
//         <success>true</success>
//         <label>true</label>
//         <code>true</code>
//         <message>true</message>
//         <threadName>true</threadName>
//         <dataType>true</dataType>
//         <encoding>false</encoding>
//         <assertions>true</assertions>
//         <subresults>true</subresults>
//         <responseData>false</responseData>
//         <samplerData>false</samplerData>
//         <xml>false</xml>
//         <fieldNames>true</fieldNames>
//         <responseHeaders>false</responseHeaders>
//         <requestHeaders>false</requestHeaders>
//         <responseDataOnError>false</responseDataOnError>
//         <saveAssertionResultsFailureMessage>true</saveAssertionResultsFailureMessage>
//         <assertionsResultsToSave>0</assertionsResultsToSave>
//         <bytes>true</bytes>
//         <sentBytes>true</sentBytes>
//         <url>true</url>
//         <threadCounts>true</threadCounts>
//         <idleTime>true</idleTime>
//         <connectTime>true</connectTime>
//       </value>
//       </objProp>
//       <stringProp name="filename">FilePath</stringProp>
//     </ResultCollector>
//     <hashTree/>
//   `;
//     groupContent += `</hashTree>
//   `;
//     jmxContent += groupContent;
//   }

//   jmxContent += `    </hashTree>
//     </hashTree>
// </jmeterTestPlan>`;
//   return jmxContent;
// }

async function generateJMXFromCSV(filePath) {
  const csvRows = await readCsvFile(filePath);
  const apisGroups = groupByThreadGroup(csvRows);
  return buildJMXContent(apisGroups, filePath);
}

function groupByThreadGroup(rows) {
  return rows.reduce((acc, row) => {
    const threadGroupName = row["Thread Group"];
    if (!acc[threadGroupName]) acc[threadGroupName] = [];
    acc[threadGroupName].push(row);
    return acc;
  }, {});
}

function buildJMXContent(groups, csvFilePath) {
  let jmxContent = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.6.3">
  <hashTree>
    <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="Test Plan">
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" testname="User Defined Variables">
        <collectionProp name="Arguments.arguments"/>
      </elementProp>
    </TestPlan>
    <hashTree>`;

  Object.entries(groups).forEach(([threadGroupName, rows]) => {
    jmxContent += buildThreadGroup(threadGroupName, rows[0]); // Assuming thread group settings are the same for all rows in the group
    jmxContent += `<hashTree>`;

    rows.forEach((row) => {
      jmxContent += buildHTTPRequestSampler(row, csvFilePath);
    });

    jmxContent += buildResultCollector();
    jmxContent += `</hashTree>`; // Closing hashTree for ThreadGroup
  });

  jmxContent += `    </hashTree>
  </hashTree>
</jmeterTestPlan>`;
  return jmxContent;
}

function buildThreadGroup(name, settings) {
  return `
<ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="${name}" enabled="true">
  <intProp name="ThreadGroup.num_threads">${settings["Threads"]}</intProp>
  <intProp name="ThreadGroup.ramp_time">${settings["RampUp"]}</intProp>
  <stringProp name="ThreadGroup.duration">${settings["Duration"]}</stringProp>
  <boolProp name="ThreadGroup.same_user_on_next_iteration">true</boolProp>
  <boolProp name="ThreadGroup.scheduler">true</boolProp>
  <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>
  <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController">
    <stringProp name="LoopController.loops">${settings["Loop"]}</stringProp>
    <boolProp name="LoopController.continue_forever">false</boolProp>
  </elementProp>
</ThreadGroup>`;
}

// function encodeForJMX(jsonString) {
//   // Encode JSON string for XML
//   let encodedString = jsonString
//     .replace(/"/g, "&quot;") // Replace " with &quot;
//     .replace(/\n/g, "&#xd;") // Replace newline characters with &#xd;
//     .replace(/\r/g, "") // Remove carriage return characters
//     .replace(/\t/g, "&#x9;"); // Replace tab characters with &#x9; for better readability, if needed

//   // Wrap in JMeter XML stringProp tag
//   let jmxStringProp = `<stringProp name="Argument.value">${encodedString}</stringProp>`;

//   return jmxStringProp;
// }

function buildHTTPRequestSampler(row, csvFilePath) {
  // Destructuring relevant fields from the row
  const {
    API_Name: apiName,
    Base_URL: baseUrl,
    Protocol: protocol,
    Path: path,
    Method: method,
    Data: data,
    Header: header,
    Port: port,
    CSV_Path: csvPath,
    Variables: variables,
    "Correlation Serial number": correlationSerialNumber,
    MethodData: methodData,
    Parameterization: parameterization,
  } = row;

  let headers = {};
  if (header) {
    try {
      headers = JSON.parse(header.replace(/'/g, '"')); // Ensure headers in CSV are JSON-formatted and single quotes are replaced with double quotes
    } catch (e) {
      console.error("Error parsing headers: ", e);
    }
  }

  // CSV Data Set Config
  let csvDataSetConfig = ``;
  if (parameterization) {
    // CSV Data Set Config
    csvDataSetConfig += `
  <CSVDataSet guiclass="TestBeanGUI" testclass="CSVDataSet" testname="CSV Data Set Config">
    <stringProp name="delimiter">,</stringProp>
    <stringProp name="fileEncoding">UTF-8</stringProp> <!-- Adjust encoding if necessary -->
    <stringProp name="filename">${csvPath}</stringProp>
    <boolProp name="ignoreFirstLine">true</boolProp> <!-- Set to true if your CSV has a header row -->
    <boolProp name="quotedData">false</boolProp>
    <boolProp name="recycle">true</boolProp>
    <stringProp name="shareMode">shareMode.all</stringProp>
    <boolProp name="stopThread">false</boolProp>
    <stringProp name="variableNames">${variables}</stringProp>
  </CSVDataSet>
  <hashTree/>
  `;
  }

  // HTTP Sampler Proxy
  let httpSampler = `
<HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="${apiName}">
  <stringProp name="HTTPSampler.domain">${baseUrl}</stringProp>
  <stringProp name="HTTPSampler.path">${path}</stringProp>
  <stringProp name="HTTPSampler.method">${method}</stringProp>
  <stringProp name="HTTPSampler.port">${port}</stringProp>
  <stringProp name="HTTPSampler.protocol">${protocol}</stringProp>
  <boolProp name="HTTPSampler.follow_redirects">true</boolProp>
  <boolProp name="HTTPSampler.auto_redirects">false</boolProp>
  <boolProp name="HTTPSampler.use_keepalive">true</boolProp>
  <boolProp name="HTTPSampler.DO_MULTIPART_POST">false</boolProp>
  <stringProp name="HTTPSampler.embedded_url_re"></stringProp>
  <stringProp name="HTTPSampler.connect_timeout"></stringProp>
  <stringProp name="HTTPSampler.response_timeout"></stringProp>
`;

  // Include post body if the method is POST or PUT and data is provided
  if ((method === "POST" || method === "PUT") && data) {
    httpSampler += `
  <boolProp name="HTTPSampler.postBodyRaw">true</boolProp>
  <elementProp name="HTTPsampler.Arguments" elementType="Arguments">
    <collectionProp name="Arguments.arguments">
      <elementProp name="" elementType="HTTPArgument">
        <boolProp name="HTTPArgument.always_encode">false</boolProp>
        <stringProp name="Argument.value">${data}</stringProp>
        <stringProp name="Argument.metadata">=</stringProp>
      </elementProp>
    </collectionProp>
  </elementProp>
`;
  }

  httpSampler += `</HTTPSamplerProxy>\n<hashTree>`;

  // Header Manager
  if (header) {
    httpSampler += headersToJMX(headers);
  }

  // JSON Post Processor for Correlation
  if (correlationSerialNumber && methodData) {
    const csNumbers = correlationSerialNumber
      .split(",")
      .map((item) => item.trim());
    const mdArray = methodData.split("::").map((item) => item.trim());

    csNumbers.forEach((csn, index) => {
      const mData = mdArray[index].split(";").map((item) => item.trim());
      // for (var mD of mData) {
      //   const [dataTypeKey, dataTypeValue] = mD.split(":").map((csv) => csv.trim());
      //   const [dataeArrayKey, dataArrayValue] = dataTypeValue
      //     .split(",")
      //     .map((csv) => csv.trim());
      //   httpSampler += `
      //     <JSONPostProcessor guiclass="JSONPostProcessorGui" testclass="JSONPostProcessor" testname="Extract ${dataKeyValueArrayKey}" enabled="true">
      //               <stringProp name="JSONPostProcessor.referenceNames">${dataeArrayKey}</stringProp>
      //               <stringProp name="JSONPostProcessor.jsonPathExprs">${dataArrayValue}</stringProp>
      //               <stringProp name="JSONPostProcessor.match_numbers">1</stringProp>
      //     </JSONPostProcessor>
      //     <hashTree/>
      //   `;
      // }
      mData.forEach((mD) => {
        const [CVdataType, jsonPath] = mD.split(":").map((item) => item.trim());
        httpSampler += `
      <JSONPostProcessor guiclass="JSONPostProcessorGui" testclass="JSONPostProcessor" testname="Extract ${jsonPath}">
        <stringProp name="JSONPostProcessor.referenceNames">${jsonPath}</stringProp>
        <stringProp name="JSONPostProcessor.jsonPathExprs">$.${jsonPath}</stringProp>
        <stringProp name="JSONPostProcessor.match_numbers"></stringProp>
      </JSONPostProcessor>
      <hashTree/>
      `;
      });
    });
    // adding a simple Response Assertion
    httpSampler += `
    <ResponseAssertion guiclass="AssertionGui" testclass="ResponseAssertion" testname="Assert Response" enabled="true">
    <collectionProp name="Asserion.test_strings">
      <stringProp name="-12345">Expected Response</stringProp>  // Adjust expected response
    </collectionProp>
    <stringProp name="Assertion.custom_message"></stringProp>
    <stringProp name="Assertion.test_field">Assertion.response_data</stringProp>
    <boolProp name="Assertion.assume_success">false</boolProp>
    <intProp name="Assertion.test_type">2</intProp>  // 2 represents Substring
    </ResponseAssertion>
    <hashTree/>
    `;
  }

  httpSampler += `</hashTree>\n`;
  return csvDataSetConfig + httpSampler;
}

function headersToJMX(headers) {
  let jmxHeaders = `
<HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Manager">
  <collectionProp name="HeaderManager.headers">
`;

  for (let [key, value] of Object.entries(headers)) {
    jmxHeaders += `
    <elementProp name="${key}" elementType="Header">
      <stringProp name="Header.name">${key}</stringProp>
      <stringProp name="Header.value">${value}</stringProp>
    </elementProp>
`;
  }

  jmxHeaders += `
  </collectionProp>
</HeaderManager>
<hashTree/>
`;

  return jmxHeaders;
}

function buildResultCollector() {
  return `
<ResultCollector guiclass="ViewResultsFullVisualizer" testclass="ResultCollector" testname="View Results Tree">
  <boolProp name="ResultCollector.error_logging">false</boolProp>
  <objProp>
      <name>saveConfig</name>
      <value class="SampleSaveConfiguration">
        <time>true</time>
        <latency>true</latency>
        <timestamp>true</timestamp>
        <success>true</success>
        <label>true</label>
        <code>true</code>
        <message>true</message>
        <threadName>true</threadName>
        <dataType>true</dataType>
        <encoding>false</encoding>
        <assertions>true</assertions>
        <subresults>true</subresults>
        <responseData>false</responseData>
        <samplerData>false</samplerData>
        <xml>false</xml>
        <fieldNames>true</fieldNames>
        <responseHeaders>false</responseHeaders>
        <requestHeaders>false</requestHeaders>
        <responseDataOnError>false</responseDataOnError>
        <saveAssertionResultsFailureMessage>true</saveAssertionResultsFailureMessage>
        <assertionsResultsToSave>0</assertionsResultsToSave>
        <bytes>true</bytes>
        <sentBytes>true</sentBytes>
        <url>true</url>
        <threadCounts>true</threadCounts>
        <idleTime>true</idleTime>
        <connectTime>true</connectTime>
      </value>
      </objProp>
      <stringProp name="filename">FilePath</stringProp>
</ResultCollector>
<hashTree/>`;
}

export { generateJMXFromCSV };
