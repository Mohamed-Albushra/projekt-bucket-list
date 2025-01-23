let activities = [];
let doneList = [];

if (localStorage.getItem('activities')) {
    storedData()
}
//get the activity input 
const newAct = document.getElementById('activityName');

//get the chosen category 
const actCat = document.getElementById('activityCategory');

const registerForm = document.getElementById('bucketForm');
registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Find the category object or create a new one
    let activity = activities.find((item) => item.category === actCat.value);

    if (activity) {
        activity.activityList.push(newAct.value);
    } else {
        activity = {
            category: actCat.value,
            activityList: [newAct.value],
        };
        activities.push(activity);
    }
    
    
    const bucketLists = document.getElementById("bucketLists");
    let activityDiv = document.getElementById(`${activity.category}Div`);

    // Create the category div if it doesn't exist
    if (!activityDiv) {
        activityDiv = document.createElement("div");
        activityDiv.id = `${activity.category}Div`;
        activityDiv.innerHTML = `<h3 id="${activity.category}">${activity.category}</h3>`;
        const listOfAct = document.createElement("ul");
        listOfAct.id = `${activity.category}list`;
        activityDiv.appendChild(listOfAct);
        bucketLists.appendChild(activityDiv);
    }

    // Update the category list
    const listOfAct = document.getElementById(`${activity.category}list`);

    // Add the new activity to the list if it doesn't already exist
    activity.activityList.forEach((actName) => {
        if (!document.getElementById(actName)) {
    
            const listItem = document.createElement("li");
            listItem.textContent = capitalizeFirstLetter(actName);
            if (listItem.textContent){
                console.log("Activity is already added");
            };
            listItem.id = actName;
            // Add delete button
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "X";
            deleteButton.style.backgroundColor = "red";
            deleteButton.addEventListener("click", () => {
                const list = document.getElementById(`${activity.category}list`);
                // Check if it's the only item in the list
                if (list.children.length === 1) { 
                    document.getElementById(`${activity.category}Div`).remove();
                } else {
                    let x = activity.activityList.indexOf(actName)
                    activity.activityList.splice(x,1)
                    listItem.remove();
                }
            });
            
            // Add done button
            const doneButton = document.createElement("button");
            doneButton.textContent = "Done";
            doneButton.style.backgroundColor = "green";
            doneButton.addEventListener("click", () => {
                // Use the existing `activity` object and the text of the list item
                const doneActivity = {
                    category: activity.category, 
                    activityList: listItem.firstChild.textContent, 
                };
                doneList.push(doneActivity);
                console.log(`Marked as done: ${doneActivity.activityList} in ${doneActivity.category}`);
                const list = document.getElementById(`${activity.category}list`);
                // Check if it's the only item in the list
                if (list.children.length === 1) { 
                    document.getElementById(`${activity.category}Div`).remove();
                    localStorage.setItem("doneList", JSON.stringify(doneList));
                } else {
                    
                    let x = activity.activityList.indexOf(actName);
                    activity.activityList.splice(x,1);
                    localStorage.setItem("doneList", JSON.stringify(doneList));
                    listItem.remove();
                }
            });

            // Add Edit button
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.style.backgroundColor = "DarkSalmon";

            editButton.addEventListener("click", () => {
                
                // check if edit form opened 
                if(listItem.querySelector("form")){
                    console.log("Edit form already exists!");
                }
                //create the edit form
                const editForm = document.createElement("form");
                editForm.innerHTML = `
                <input type="text" value="${actName}" placeholder="Edit activity" required>
                <button type="submit">Save</button>`;
                listItem.appendChild(editForm);

                // Handle the form submission
                editForm.addEventListener("submit", (event) => {
                    // Prevent page refresh
                    event.preventDefault(); 

                    const editInput = editForm.querySelector("input");
                    // Get the updated activity name
                    const editedActName = editInput.value.trim(); 

                    if (editedActName) {
                        // Update the activity name in the list item
                        listItem.firstChild.textContent = capitalizeFirstLetter(editedActName);

                        // Update the `activities` array
                        activity = activities.find((item) => item.category === activity.category);
                        const actIndex = activity.activityList.indexOf(actName);
                        if (actIndex !== -1) {
                            activity.activityList[actIndex] = editedActName;
                        }

                        console.log(`Activity updated: ${actName} -> ${editedActName}`);
                         // Update the variable
                        actName = editedActName;
                    } else {
                        console.error("Edited activity name is empty!");
                    }

                    // Remove the edit form after saving
                    editForm.remove();
                });
            });
                       
            listItem.appendChild(doneButton);
            listItem.appendChild(deleteButton);
            listItem.appendChild(editButton);
            listOfAct.appendChild(listItem);
            // Save activities array to localStorage
            localStorage.setItem("activities", JSON.stringify(activities));
        }
    });
    
    // Sort the list alphabetically
    const listItems = Array.from(listOfAct.getElementsByTagName("li"));
    listItems.sort((a, b) => a.textContent.localeCompare(b.textContent));
    // Clear the list and re-add sorted items
    listOfAct.innerHTML = ""; 
    listItems.forEach((item) => listOfAct.appendChild(item));

    // Reset form inputs
    newAct.value = "";
    actCat.value = "Resor";
    
});
function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function storedData() {
    storedActivities = JSON.parse(localStorage.getItem('activities'));
    storedActivities.forEach(activity => {
    const bucketLists = document.getElementById("bucketLists");

    // Create the category div
    const activityDiv = document.createElement("div");
    activityDiv.id = `${activity.category}Div`;;
    activityDiv.innerHTML = `<h3 id="${activity.category}">${activity.category}</h3>`;
    //Create the category list
    const listOfAct = document.createElement("ul");
    listOfAct.id = `${activity.category}list`;
    activity.activityList.forEach((actName) => {
        //Create the category listItem
        const listItem = document.createElement("li");
        listItem.textContent = capitalizeFirstLetter(actName);
        listItem.id = actName;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.style.backgroundColor = "red";
        deleteButton.addEventListener("click", () => {
            deleteBtn();
        });
        const doneButton = document.createElement("button");
        doneButton.textContent = "Done";
        doneButton.style.backgroundColor = "green";
        doneButton.addEventListener("click", () => {
            doneButton()      
        });
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.style.backgroundColor = "DarkSalmon";
        editButton.addEventListener("click", () => {

        });
    listItem.appendChild(doneButton);
    listItem.appendChild(deleteButton);
    listItem.appendChild(editButton);
    listOfAct.appendChild(listItem);
    activityDiv.appendChild(listOfAct);
    bucketLists.appendChild(activityDiv);
    });
});
}


function deleteBtn() {
    const list = document.getElementById(`${activity.category}list`);
    // Check if it's the only item in the list
    if (list.children.length === 1) { 
        document.getElementById(`${activity.category}Div`).remove();
    } else {
        let x = activity.activityList.indexOf(actName)
        activity.activityList.splice(x,1)
        listItem.remove();
    }
}

function doneButton() {
    const doneActivity = {
        category: activity.category, 
        activityList: listItem.firstChild.textContent, 
    };
    doneList.push(doneActivity);
    console.log(`Marked as done: ${doneActivity.activityList} in ${doneActivity.category}`);
    const list = document.getElementById(`${activity.category}list`);
    // Check if it's the only item in the list
    if (list.children.length === 1) { 
        document.getElementById(`${activity.category}Div`).remove();
        localStorage.setItem("doneList", JSON.stringify(doneList));
    } else {
        
        let x = activity.activityList.indexOf(actName);
        activity.activityList.splice(x,1);
        localStorage.setItem("doneList", JSON.stringify(doneList));
        listItem.remove();
    }
}

function editBtn() {
    // check if edit form opened 
    if(listItem.querySelector("form")){
        console.log("Edit form already exists!");
    }
    //create the edit form
    const editForm = document.createElement("form");
    editForm.innerHTML = `
    <input type="text" value="${actName}" placeholder="Edit activity" required>
    <button type="submit">Save</button>`;
    listItem.appendChild(editForm);
     // Handle the form submission
     editForm.addEventListener("submit", (event) => {
        // Prevent page refresh
        event.preventDefault(); 

        const editInput = editForm.querySelector("input");
        // Get the updated activity name
        const editedActName = editInput.value.trim(); 

        if (editedActName) {
            // Update the activity name in the list item
            listItem.firstChild.textContent = capitalizeFirstLetter(editedActName);

            // Update the `activities` array
            activity = activities.find((item) => item.category === activity.category);
            const actIndex = activity.activityList.indexOf(actName);
            if (actIndex !== -1) {
                activity.activityList[actIndex] = editedActName;
            }

            console.log(`Activity updated: ${actName} -> ${editedActName}`);
             // Update the variable
            actName = editedActName;
        } else {
            console.error("Edited activity name is empty!");
        }

        // Remove the edit form after saving
        editForm.remove();
    });
}

//To improve the code:
//use functions more to organize code and make it more clear to understand 
//use the LS to load the information whin the page start
//make planning earlier for coding stages 
//use github more effective 
//try to make the result looks like the UI that I have :)
