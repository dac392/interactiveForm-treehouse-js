const name_input = document.getElementById("name");
const email_input = document.getElementById("email");
const other_roles_input = document.getElementById("other-job-role");
const job_roles_select = document.getElementById("title");
const shirt_colors_select = document.getElementById("color");
const design_select = document.getElementById("design");
const color_select = document.getElementById("color");
const activity_fieldset = document.getElementById("activities");
const activity_box = document.getElementById("activities-box");
const payment_fieldset = document.querySelector(".payment-methods");
const payment_select = document.getElementById("payment");
const form = document.querySelector("form");

/* event listeners */
function onFirstLoad(){
    name_input.focus();
    other_roles_input.style.display = "none";
    shirt_colors_select.disabled = true;

    payment_select.children[1].setAttribute("selected","");
    for(let i = 3; i < payment_fieldset.children.length; i++){
        payment_fieldset.children[i].style.display = "none";
    }
}

function otherJobRoleClick(e){
    if(e.target.value ==="other"){
        other_roles_input.style.display = "";
    }else{
        other_roles_input.style.display = "none";
    }
}

function onDesignChosen(e){
    const design = e.target.value;
    shirt_colors_select.disabled = false;
    const colors_options = color_select.children;
    // console.log(colors_options[1].attributes[0].textContent);
    for(let i = 1; i < colors_options.length; i++){
        if(colors_options[i].attributes["data-theme"].textContent === design){
            colors_options[i].style.display = "";
        }else{
            colors_options[i].style.display = "none";
        }
    }
    
}

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
function onActivityChosen(e){
    const activity = e.target;
    conflictPrevention(activity);

    const total_element = document.getElementById("activities-cost");
    let total_value = parseInt(total_element.textContent.substring(8));
    const activity_cost = parseInt(activity.attributes["data-cost"].textContent);
    (activity.checked)? (total_value+=activity_cost) : (total_value-= activity_cost);
    
    total_element.textContent= `Total: $${total_value}`;
}

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
    }else if(properInputBool && element.parentElement.classList.contains("not-valid")){     
        element.parentElement.classList.remove("not-valid");
        element.parentElement.lastElementChild.classList.toggle("hint");
        
    }
}
function onSubmit(e){
    e.preventDefault();
    console.log(`name validation: ${nameValidation()}`);
    console.log(`email validation: ${emailValidation()}`);
    console.log(`activity validation: ${activityValidation()}`);

    if(payment_select.value === "credit-card"){
        console.log(`credit-card validation: ${creditValidation()}`);
    }
    
}
function nameValidation(){
    const regex = /\S/;
    const value = regex.test(name_input.value);
    adjustValidTags(name_input, value);
      
    return value;
}
function emailValidation(){
    const regex = /^(\w|\d)+@(\w)+\.com$/;
    const properEmailCheck = regex.test(email_input.value);
    adjustValidTags(email_input, properEmailCheck);

    return properEmailCheck;

}
function activityValidation(){
    const total_element = document.getElementById("activities-cost");
    const total_value = parseInt(total_element.textContent.substring(8));
    const activityCheck = (total_value>0);
    adjustValidTags(total_element,activityCheck);
    return activityCheck;
}
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
