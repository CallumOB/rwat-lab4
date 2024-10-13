// Part 1: XMLHttpRequest used synchronously
const makeSynchronousRequest = (path) => {
  const request = new XMLHttpRequest();
  request.open("GET", path, false); // A get request is sent for the specified path. False makes the request synchronous
  request.send(null); // We are not sending any additional data

  if (request.status === 200) {
    return request.responseText;
  }

  return null;
};

let data1Location = JSON.parse(makeSynchronousRequest("./reference.json"));
// data1 is retrieved using the data location in reference.json
let data1 = JSON.parse(
  makeSynchronousRequest("./" + data1Location.data_location)
);
let data2 = JSON.parse(makeSynchronousRequest(data1.data_location));
// The filename of data3 is known to us
let data3 = JSON.parse(makeSynchronousRequest("./data3.json"));

const mergeData = (data1, data2, data3) => {
  const combinedData = [...data1.data, ...data2.data, ...data3.data];

  const newData = combinedData.map((student) => {
    const [name, surname] = student.name.split(" ");
    return {
      name: name,
      surname: surname,
      id: student.id,
    };
  });

  return newData;
};

let mergedData = mergeData(data1, data2, data3);
console.log("Merged Data using synchronous XMLHttpRequest\n", mergedData);

// Part 2: XMLHttpRequest used Asynchronously with Callbacks
const makeAsynchronousRequest = (path, callback) => {
  const request = new XMLHttpRequest();
  request.callback = callback;
  request.onload = () => {
    request.callback.apply(request, request.arguments);
  };
  request.onerror = () => {
    console.error(request.statusText);
  };
  request.open("GET", path, true);
  request.send(null);
};

function getResponse() {
  return this.responseText;
}

makeAsynchronousRequest("./reference.json", function () {
  data1Location = getResponse.call(this);
});
makeAsynchronousRequest(data1Location.data_location, function () {
  data1 = getResponse.call(this);
});
makeAsynchronousRequest(data1.data_location, function () {
  data2 = getResponse.call(this);
});
makeAsynchronousRequest("./data3.json", function () {
  data3 = getResponse.call(this);
});

mergedData = mergeData(data1, data2, data3);
console.log("Merged Data using Async XMLHttpRequest\n", mergedData);

// Part 3: Using fetch() and promises
const getDataLocation = async (path) => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error("File could not be retrieved");
    }
    const jsonData = await response.json();
    return jsonData.data_location;
  } catch (error) {
    console.error("File could not be retrieved: ", error);
  }
};

getDataLocation("./reference.json").then((dataLocation) => {
  console.log(dataLocation);
});
