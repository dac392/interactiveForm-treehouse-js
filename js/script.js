const name_input = document.getElementById("name");                     //name input field
const email_input = document.getElementById("email");                   //email input field
const other_roles_input = document.getElementById("other-job-role");    //other roles input field
const job_roles_select = document.getElementById("title");              //job roles select field
const shirt_colors_select = document.getElementById("color");           //shirt color select field
const design_select = document.getElementById("design");                //design select field
const color_select = document.getElementById("color");                  //color select field
const activity_fieldset = document.getElementById("activities");        //activity fieldset
const activity_box = document.getElementById("activities-box");         //activity box
const payment_fieldset = document.querySelector(".payment-methods");    //payment fieldset 
const payment_select = document.getElementById("payment");              //payment select field
const form = document.querySelector("form");                            //form field

/* 
    The function the will run when the website first loads.
    This function will run when the website first loads.
    It will set up the necessary elements when the website first loads
*/
function onFirstLoad(){
    name_input.focus();
    other_roles_input.style.display = "none";
    shirt_colors_select.disabled = true;

    payment_select.children[1].setAttribute("selected","");
    for(let i = 3; i < payment_fieldset.children.length; i++){
        payment_fieldset.children[i].style.display = "none";
    }
}
/*
    The function that will run when a job role is clicked

*/
function otherJobRoleClick(e){
    if(e.target.value ==="other"){
        other_roles_input.style.display = "";
    }else{
        other_roles_input.style.display = "none";
    }
}
/*
    The function that will run whe a design is chosen
    It will change the site depending on what design is chosen
        The options in the "Color" drop down menu are not available for each t-shirt design. So the user shouldn’t be able to see or choose a color option until they have chosen a design.
*/
function onDesignChosen(e){
    const design = e.target.value;
    shirt_colors_select.disabled = false;
    const colors_options = color_select.children;
    for(let i = 1; i < colors_options.length; i++){
        if(colors_options[i].attributes["data-theme"].textContent === design){
            colors_options[i].style.display = "";
        }else{
            colors_options[i].style.display = "none";
        }
    }
    
}
/*
    functino used to prevent conflicting times.
    If there is a conflict between two events having the same timeslot, this function will prevent you from choosing it.
*/

function conflictPrevention(activity_input){ 
    const inputKey = 0;   
    const timeKey = 2; 
    const activity = activity_input.parentElement;
    const labels = activity_box.children;
    const activityHasATime = !(activity === labels[0]);

    if(activityHasATime){
        for(let i = 1; i < labels.length; i++){
            if(activity !== labels[i]){
                const tempActivity = labels[i].children;
                const activitiesHaveSameTime = activity.children[timeKey].textContent === tempActivity[timeKey].textContent;
                
                if(activitiesHaveSameTime){
                    if(activity_input.checked){
                        labels[i].classList.add("disabled");
                        tempActivity[inputKey].disabled = true;
                    }else{
                        labels[i].classList.remove("disabled")
                        tempActivity[inputKey].disabled = false;
                    }
                }
            }
        }
    }
}

/*
    The "Total: $" element below the "Register for Activities" section should update to reflect the sum of the cost of the user’s selected activities.
*/
function onActivityChosen(e){
    const activity = e.target;
    conflictPrevention(activity);

    const total_element = document.getElementById("activities-cost");
    let total_value = parseInt(total_element.textContent.substring(8));
    const activity_cost = parseInt(activity.attributes["data-cost"].textContent);
    (activity.checked)? (total_value+=activity_cost) : (total_value-= activity_cost);
    
    total_element.textContent= `Total: $${total_value}`;
}
/*
    The credit card payment option should be selected for the user by default. So when the form first loads, "Credit Card" should be displayed in the "I'm going to pay with" <select> element, and the credit card payment section should be the only payment section displayed in the form’s UI. And when the user selects one of the payment options from the "I'm going to pay with" drop down menu, the form should update to display only the chosen payment method section.
*/
function onPaymentChosen(e){
    const payment_chosen = e.target.value;
    for(let i = 2; i < payment_fieldset.children.length; i++){
        payment_fieldset.children[i].style.display = "none";
        if(payment_fieldset.children[i].id === payment_chosen){
            payment_fieldset.children[i].style.display = "";
        }
    }
}

/* submit functions */
function adjustValidTags(element, properInputBool){
    if(!properInputBool && !element.parentElement.classList.contains("not-valid")){
        element.parentElement.classList.add("not-valid");
        element.parentElement.lastElementChild.classList.toggle("hint");
        if(element.parentElement.classList.contains("valid")){
            element.parentElement.classList.remove("valid");
        }
    }else if(properInputBool && element.parentElement.classList.contains("not-valid")){     
        element.parentElement.classList.remove("not-valid");
        element.parentElement.lastElementChild.classList.toggle("hint");
        element.parentElement.classList.add("valid");
    }
}
function onSubmit(e){
    
    const succesful = nameValidation()&emailValidation()&activityValidation();
    if(!succesful){
        e.preventDefault();
    }
    // console.log(`name validation: ${nameValidation()}`);
    // console.log(`email validation: ${emailValidation()}`);
    // console.log(`activity validation: ${activityValidation()}`);

    if(payment_select.value === "credit-card"&(!creditValidation())){
        e.preventDefault();
        // console.log(`credit-card validation: ${creditValidation()}`);
    }
    
}


/*
    validates the name field
    The "Name" field cannot be blank or empty.
*/
function nameValidation(){
    const regex = /\S/;
    const value = regex.test(name_input.value);
    adjustValidTags(name_input, value);

    return value;
}
/*
    validates the email field
    The "Email Address" field must contain a validly formatted email address. The email address does not need to be a real email address, just formatted like one. For example: dave@teamtreehouse.com. A few characters for the username, followed by "@", followed by a few more characters and a ".com" for the domain name. You don’t have to account for other top-level domains, like .org, .net, etc.
*/
function emailValidation(){
    const regex = /^(\w|\d)+@(\w)+\.com$/;
    const properEmailCheck = regex.test(email_input.value);
    adjustValidTags(email_input, properEmailCheck);

    return properEmailCheck;

}
/*
    validates the activity field
    The "Register for Activities" section must have at least one activity selected.
*/
function activityValidation(){
    const total_element = document.getElementById("activities-cost");
    const total_value = parseInt(total_element.textContent.substring(8));
    const activityCheck = (total_value>0);
    adjustValidTags(total_element,activityCheck);
    return activityCheck;
}
/*
    validates the creditcard field if it is active
    If and only if credit card is the selected payment method:
        The "Card number" field must contain a 13 - 16 digit credit card number with no dashes or spaces. The value does not need to be a real credit card number.
        The "Zip code" field must contain a 5 digit number.
        The "CVV" field must contain a 3 digit number.
*/
function creditValidation(){
    function regex_fn(exp,value){
        const regex = exp;
        return regex.test(value);
    }
    const card_number = document.getElementById("cc-num");
    const zip_code = document.getElementById("zip");
    const cvv_number = document.getElementById("cvv");

    const card = regex_fn(/^(\d){13,16}$/,card_number.value);
    const zip = regex_fn(/^(\d){5}$/,zip_code.value);
    const cvv = regex_fn(/^(\d){3}$/,cvv_number.value);

    adjustValidTags(card_number , card);
    adjustValidTags(zip_code , zip);
    adjustValidTags(cvv_number , cvv);

    return (card && zip && cvv);
    
}

/* focus and blur */
function onActivityFocus(e){
    e.target.parentElement.className = "focus";
}
function onActivityBlur(e){
    e.target.parentElement.className = "";
}




/* --------main------------ */
onFirstLoad();

job_roles_select.addEventListener("change", otherJobRoleClick);
design_select.addEventListener("change",onDesignChosen);
activity_fieldset.addEventListener("change",onActivityChosen);
payment_select.addEventListener("change",onPaymentChosen);
form.addEventListener("submit",onSubmit);
email_input.addEventListener("keyup",emailValidation);


const checkboxes = document.querySelectorAll("input[type=checkbox]");
for(let i = 0; i < checkboxes.length; i++){
    checkboxes[i].addEventListener("focus",onActivityFocus);
    checkboxes[i].addEventListener("blur",onActivityBlur);
}
