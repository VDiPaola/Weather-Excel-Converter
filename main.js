function getData() {
    try{
        //return formated text
        const data = document.getElementById("csvInput").value;
        const lines = data.split("\n");
        const headers = ["yyyy", "mm", "tmax degC", "tmin degC", "af days", "rain mm", "sun hours"]
        const finalData = [headers]
        let isDataStart = false;
        for(let lineIndex=0; lineIndex < lines.length;lineIndex++){
            const line = lines[lineIndex].trim();
            console.log(line)
            if(isDataStart){
                const formattedLine = line.split(" ").filter(n => n != "")
                finalData.push(formattedLine);
            }
            
            if(!isDataStart && line.includes("degC") && line.includes("hours") && line.includes("mm")){
                isDataStart = true;
            }
        }
        
        return finalData
    }catch (err){
        console.log(err)
        return ""
    }
}

// Function to convert array of arrays to CSV string
function getCSV() {
    const data = getData();
    if(data){
        return data.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    }
}

const DisplayCSV = () => {
    // Display the CSV content in a textarea
    const csvContent = getCSV();
    const textarea = document.getElementById("csvOutput");
    textarea.style.display = "flex"
    textarea.value = csvContent;
}

const DownloadCSV = () => {
    //UNUSED
    const csvContent = getCSV();
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv" });

    // Create a link element
    const link = document.createElement("a");

    // Create a URL for the Blob and set it as the href
    link.href = URL.createObjectURL(blob);

    // Set the download attribute to specify the file name
    link.download = "data.csv";

    // Append the link to the document body (not necessary but ensures visibility for some cases)
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
}




// Function to convert array to Excel and trigger download
function downloadExcel() {
    const data = getData();
    
    //display
    DisplayCSV()

    // Step 1: Create a workbook
    const workbook = XLSX.utils.book_new();

    // Step 2: Convert the data array to a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Step 3: Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Step 4: Write the workbook to a file and download
    XLSX.writeFile(workbook, "data.xlsx");

    
}

// Add click event to the button
document.getElementById("downloadExcel").addEventListener("click", downloadExcel);