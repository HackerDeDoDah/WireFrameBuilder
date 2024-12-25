// variables
let lists = document.getElementsByClassName("list");
let rightBox = document.getElementById("right");
let leftBox = document.getElementById("left");

// for loop
for (let list of lists) {
    list.addEventListener("dragstart", function (e) {
        // Clone the element being dragged
        let selected = e.target.cloneNode(true);
        selected.style.cursor = "grab"; // Ensure cursor style matches drag-and-drop
        selected.setAttribute("draggable", true);

        // Temporary transfer data to handle the drop event
        e.dataTransfer.setData("text/plain", "");

        // right box
        rightBox.addEventListener("dragover", function (e) {
            e.preventDefault();
        });

        rightBox.addEventListener("drop", function (e) {
            e.preventDefault();
            // Add the cloned item to the right box
            rightBox.appendChild(selected);

            // Ensure the cloned item remains draggable
            addDragHandlers(selected);
        });

        // left box
        leftBox.addEventListener("dragover", function (e) {
            e.preventDefault();
        });

        leftBox.addEventListener("drop", function (e) {
            e.preventDefault();
            // Add the cloned item to the left box
            leftBox.appendChild(selected);

            // Ensure the cloned item remains draggable
            addDragHandlers(selected);
        });
    });
}

// Function to add drag event handlers to dynamically added elements
function addDragHandlers(element) {
    element.setAttribute("draggable", true);

    // Add event listeners for reordering within rightBox
    element.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text/plain", ""); // Required for drag events
        element.classList.add("dragging");
    });

    element.addEventListener("dragend", function (e) {
        element.classList.remove("dragging");
    });
}

// Reordering logic in rightBox
rightBox.addEventListener("dragover", function (e) {
    e.preventDefault();
    const draggingElement = document.querySelector(".dragging");

    // Find the element being hovered over
    const afterElement = getDragAfterElement(rightBox, e.clientY);
    if (afterElement == null) {
        rightBox.appendChild(draggingElement);
    } else {
        rightBox.insertBefore(draggingElement, afterElement);
    }
});

// Helper function to determine the element to place the dragged item after
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".list:not(.dragging)")];

    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element;
}

// saving to local drive as jpg file
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
    html2canvas(workspace)
        .then((canvas) => {
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
        })
        .catch((error) => {
            console.error("Error capturing workspace:", error);
        });
});


// Refresh the page on "Clear All" button click
document.getElementById("clearAllBtn").addEventListener("click", function () {
    location.reload(); // Reloads the current page
});