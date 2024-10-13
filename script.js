// // Function to fetch the JSON file and return a promise
// async function fetchJSONFile(filePath) {
//     try {
//         const response = await fetch(filePath);
//         if (!response.ok) {
//             throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
//         }
//         return await response.json();
//     } catch (error) {
//         console.error(error);
//     }
// }

// // Function to fetch data files in sequence and display the student data
// async function loadStudentData() {
//     let nextFile = "data/reference.json";  // Start by fetching from the 'data' folder
//     const studentTableBody = document.querySelector('#studentTable tbody');
    
//     while (nextFile) {
//         const data = await fetchJSONFile(nextFile);
        
//         if (data && data.data) {
//             // Add student data to the table
//             data.data.forEach(student => {
//                 const row = document.createElement('tr');
                
//                 const nameCell = document.createElement('td');
//                 nameCell.textContent = student.name;
//                 row.appendChild(nameCell);
                
//                 const idCell = document.createElement('td');
//                 idCell.textContent = student.id;
//                 row.appendChild(idCell);
                
//                 const addressCell = document.createElement('td');
//                 addressCell.textContent = student.address;
//                 row.appendChild(addressCell);
                
//                 const gradesCell = document.createElement('td');
//                 gradesCell.textContent = student.grades.join(', ');
//                 row.appendChild(gradesCell);
                
//                 studentTableBody.appendChild(row);
//             });
//         }
        
//         // Check if there's a reference to the next file
//         nextFile = data && data.data_location ? `data/${data.data_location}` : null;
//     }
// }

// // Call the function to start fetching and displaying the data
// loadStudentData();

// 

// Helper function to process and display data
function processAndDisplayData(data, tableBody) {
    data.forEach(student => {
        const [name, surname] = student.name.split(' ');
        const id = student.id;

        const row = document.createElement('tr');
        row.innerHTML = `<td>${name}</td><td>${surname}</td><td>${id}</td>`;
        tableBody.appendChild(row);
    });
}

// Function to clear the table
function clearTable() {
    const tableBody = document.querySelector('#studentTable tbody');
    tableBody.innerHTML = '';  // Clear existing data
}

// 1. Synchronous XMLHttpRequest Implementation
function fetchSync() {
    clearTable();
    const tableBody = document.querySelector('#studentTable tbody');

    // Synchronous request to reference.json
    const referenceRequest = new XMLHttpRequest();
    referenceRequest.open('GET', 'data/reference.json', false);  // false for synchronous request
    referenceRequest.send();

    const referenceData = JSON.parse(referenceRequest.responseText);
    const data1File = referenceData.data_location;

    // Fetch data1.json (name unknown in advance)
    const data1Request = new XMLHttpRequest();
    data1Request.open('GET', `data/${data1File}`, false);
    data1Request.send();
    const data1 = JSON.parse(data1Request.responseText).data;
    processAndDisplayData(data1, tableBody);

    // Fetch data2.json (name unknown in advance)
    const data2File = JSON.parse(data1Request.responseText).data_location;
    const data2Request = new XMLHttpRequest();
    data2Request.open('GET', `data/${data2File}`, false);
    data2Request.send();
    const data2 = JSON.parse(data2Request.responseText).data;
    processAndDisplayData(data2, tableBody);

    // Fetch data3.json (name known)
    const data3Request = new XMLHttpRequest();
    data3Request.open('GET', 'data/data3.json', false);
    data3Request.send();
    const data3 = JSON.parse(data3Request.responseText).data;
    processAndDisplayData(data3, tableBody);
}

// 2. Asynchronous XMLHttpRequest with Callbacks
function fetchAsync() {
    clearTable();
    const tableBody = document.querySelector('#studentTable tbody');

    // Step 1: Fetch reference.json
    const referenceRequest = new XMLHttpRequest();
    referenceRequest.open('GET', 'data/reference.json', true);  // true for async
    referenceRequest.onload = function() {
        const referenceData = JSON.parse(referenceRequest.responseText);
        const data1File = referenceData.data_location;

        // Step 2: Fetch data1.json
        const data1Request = new XMLHttpRequest();
        data1Request.open('GET', `data/${data1File}`, true);
        data1Request.onload = function() {
            const data1 = JSON.parse(data1Request.responseText).data;
            processAndDisplayData(data1, tableBody);

            const data2File = JSON.parse(data1Request.responseText).data_location;

            // Step 3: Fetch data2.json
            const data2Request = new XMLHttpRequest();
            data2Request.open('GET', `data/${data2File}`, true);
            data2Request.onload = function() {
                const data2 = JSON.parse(data2Request.responseText).data;
                processAndDisplayData(data2, tableBody);

                // Step 4: Fetch data3.json
                const data3Request = new XMLHttpRequest();
                data3Request.open('GET', 'data/data3.json', true);
                data3Request.onload = function() {
                    const data3 = JSON.parse(data3Request.responseText).data;
                    processAndDisplayData(data3, tableBody);
                };
                data3Request.send();
            };
            data2Request.send();
        };
        data1Request.send();
    };
    referenceRequest.send();
}

// 3. Fetch API with Promises
function fetchWithPromises() {
    clearTable();
    const tableBody = document.querySelector('#studentTable tbody');

    // Step 1: Fetch reference.json using fetch API
    fetch('data/reference.json')
        .then(response => response.json())
        .then(referenceData => {
            const data1File = referenceData.data_location;

            // Step 2: Fetch data1.json
            return fetch(`data/${data1File}`)
                .then(response => response.json())
                .then(data1 => {
                    processAndDisplayData(data1.data, tableBody);
                    const data2File = data1.data_location;

                    // Step 3: Fetch data2.json
                    return fetch(`data/${data2File}`)
                        .then(response => response.json())
                        .then(data2 => {
                            processAndDisplayData(data2.data, tableBody);

                            // Step 4: Fetch data3.json
                            return fetch('data/data3.json')
                                .then(response => response.json())
                                .then(data3 => {
                                    processAndDisplayData(data3.data, tableBody);
                                });
                        });
                });
        })
        .catch(error => console.error('Error:', error));
}
