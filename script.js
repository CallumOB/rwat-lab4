let table;
let tableHeadings;
let tableRows;

// The same headings will be used for the 3 parts
tableHeadings = `<tr>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>ID</th>
                </tr>`;

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

const useSynchronousRequest = () => {
  let data1Location = JSON.parse(makeSynchronousRequest("./reference.json"));
  // data1 is retrieved using the data location in reference.json
  let data1 = JSON.parse(
    makeSynchronousRequest("./" + data1Location.data_location)
  );
  let data2 = JSON.parse(makeSynchronousRequest(data1.data_location));
  // The filename of data3 is known to us
  let data3 = JSON.parse(makeSynchronousRequest("./data3.json"));

  let mergedData = mergeData(data1, data2, data3);
  console.log("Merged Data using synchronous XMLHttpRequest\n", mergedData);

  table = document.createElement("table");
  tableRows = mergedData
    .map((student) => {
      return `<tr>
              <td>${student.name}</td>
              <td>${student.surname}</td>
              <td>${student.id}</td>
            </tr>`;
    })
    .join("");

  table.innerHTML = tableHeadings + tableRows;
  let div = document.getElementById("xml-synchronous");
  div.appendChild(table);
};

// Part 2: XMLHttpRequest used Asynchronously with Callbacks
const makeAsynchronousRequest = (path, callback) => {
  const request = new XMLHttpRequest();
  // The callback is called once this function completes.
  request.callback = callback;
  request.onload = () => {
    request.callback.apply(request, request.arguments);
  };
  request.onerror = () => {
    console.error(request.statusText);
  };
  // The "./" indicates it's a local file being retrieved.
  request.open("GET", "./" + path, true);
  request.send(null);
};

function getResponse() {
  return this.responseText;
}

// In this function, the calls to makeAsynchronourRequest() are nested so they complete in the correct order.
const useAsynchronousRequest = () => {
  let data1Location, data1, data2, data3, mergedData;
  makeAsynchronousRequest("./reference.json", function () {
    data1Location = JSON.parse(getResponse.call(this));
    makeAsynchronousRequest(data1Location.data_location, function () {
      data1 = JSON.parse(getResponse.call(this));
      makeAsynchronousRequest(data1.data_location, function () {
        data2 = JSON.parse(getResponse.call(this));
        makeAsynchronousRequest("./data3.json", function () {
          data3 = JSON.parse(getResponse.call(this));
          mergedData = mergeData(data1, data2, data3);
          console.log("Merged Data using Async XMLHttpRequest\n", mergedData);

          table = document.createElement("table");
          tableRows = mergedData
            .map((student) => {
              return `<tr>
              <td>${student.name}</td>
              <td>${student.surname}</td>
              <td>${student.id}</td>
            </tr>`;
            })
            .join("");

          table.innerHTML = tableHeadings + tableRows;
          let div = document.getElementById("xml-asynchronous");
          div.appendChild(table);
        });
      });
    });
  });
};

// Part 3: Using fetch() and promises
const fetchData = async (path) => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error("File could not be retrieved");
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("File could not be retrieved: ", error);
  }
};

// Similarly to part 2, the calls to useFetch() are nested so they complete in the correct order
const useFetch = () => {
  let data1Location, data1, data2, data3, mergedData;
  fetchData("./reference.json").then((jsonData) => {
    data1Location = jsonData;
    fetchData(data1Location.data_location).then((jsonData) => {
      data1 = jsonData;
      fetchData(data1.data_location).then((jsonData) => {
        data2 = jsonData;
        fetchData("./data3.json").then((jsonData) => {
          data3 = jsonData;
          mergedData = mergeData(data1, data2, data3);
          console.log("Merged Data using fetch() and Promises\n", mergedData);

          table = document.createElement("table");
          tableRows = mergedData
            .map((student) => {
              return `<tr>
              <td>${student.name}</td>
              <td>${student.surname}</td>
              <td>${student.id}</td>
            </tr>`;
            })
            .join("");

          table.innerHTML = tableHeadings + tableRows;
          let div = document.getElementById("promises");
          div.appendChild(table);
        });
      });
    });
  });
};
