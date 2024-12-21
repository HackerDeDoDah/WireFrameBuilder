// variables
let lists = document.getElementsByClassName("list");
let rightBox = document.getElementById("right");
let leftBox = document.getElementById("left");
// for loop
for(list of lists){
	list.addEventListener("dragstart", function(e){
		let selected = e.target;
		// right box
		rightBox.addEventListener("dragover", function(e){
			e.preventDefault();
		});
		rightBox.addEventListener("drop", function(e){
			rightBox.appendChild(selected);
			selected = null;
		});
		// left box
		leftBox.addEventListener("dragover", function(e){
			e.preventDefault();
		});
		leftBox.addEventListener("drop", function(e){
			leftBox.appendChild(selected);
			selected = null;
		});
	})
}

// saving to local drive as jpg file, complicated as fuck...

document.getElementById("saveAsBtn").addEventListener("click", function () {
    const workspace = document.getElementById("right");

    // Add height labels to images in the workspace
    const images = workspace.getElementsByTagName("img");
    for (let img of images) {
        const height = img.clientHeight;
        const parent = img.parentElement;

        // Create a height label
        const heightLabel = document.createElement("div");
        heightLabel.textContent = `Height: ${height}px`;
        heightLabel.style.position = "absolute";
        heightLabel.style.fontSize = "12px";
        heightLabel.style.color = "white";
        heightLabel.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        heightLabel.style.padding = "2px";
        heightLabel.style.marginTop = "-20px";
        heightLabel.style.zIndex = "10";

        // Append the label to the image's container
        parent.style.position = "relative";
        parent.appendChild(heightLabel);
    }

    // Use html2canvas to grab and save the workspace
    html2canvas(workspace).then(canvas => {
        const link = document.createElement("a");
        link.download = "file_name.jpg";
        link.href = canvas.toDataURL("image/jpeg");
        link.click();

        // Clean up the height labels after saving
        for (let img of images) {
            const parent = img.parentElement;
            const heightLabel = parent.querySelector("div");
            if (heightLabel) {
                parent.removeChild(heightLabel);
            }
        }
    }).catch(error => {
        console.error("Error capturing workspace:", error);
    });
});
// why is it the word "high" is spelled like that but "height" has a fucking "E" in it?