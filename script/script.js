const form = document.querySelector("form")
const statusMessage = document.querySelector("[data-status]")
const feedbackMode = form.dataset.mode == "feedback"
const fields = Array.from(form.querySelectorAll("input:not([type='checkbox']), textarea, select"));
const password = form.querySelector("#password")
const confirmation = form.querySelector("#confirm-password")
let submitted = false

// проверка инпута/поля ввода
const checkField = (field)=>{
    field.setCustomValidity("");
    if(field.required && field.type !== "radio" && !field.value.trim()){
        field.setCustomValidity("This field is required");
    }
    if((field == confirmation) && field.value && (field.value !== password.value)){
        field.setCustomValidity("Passwords do not match");
    }
    return field.validity.valid;
}
// короче отладка ошибок
const getError = (field)=>{
    if(field.type == "radio"){
        return "Please select your gender"
    }
    if(field.validity.customError){
        return field.validationMessage;
    }
    if(field.validity.valueMissing){
        return field.tagName == "SELECT" ? "Please choose a country" : "This field is required"
    }
    if(field.validity.typeMismatch){
        return "Please enter a valid email address"
    }
    if(field.id == "password"){
        return "Use 8+ symbols and uppercase,lowercase,number,and special symbol"
    }
    if(field.validity.tooLong){
        return "Your entry is too long"
    }
    return "Please check this field"
}
// feedback
const showFeedback = (field)=>{
    const valid = checkField(field)
    const feedback = document.getElementById(field.type == "radio" ? "gender-feedback" : field.id + "-feedback")
    const group = field.type == "radio" ? fields.filter((item)=> {item.name == field.name}) : [field]

    group.forEach((item)=>{
        item.setAttribute("aria-invalid", String(!valid));
        if(item.type !== "radio"){
            item.classList.toggle("border-slate-300", false)
            item.classList.toggle("border-green-600", valid)
            item.classList.toggle("border-red-600", !valid)
        }
    })
    feedback.textContent = valid ? "Looks good!" : getError(field)
    feedback.classList.toggle("text-green-700", valid)
    feedback.classList.toggle("text-red-600", !valid)
    return valid
}
// task 3
form.addEventListener("submit",(event)=>{
    event.preventDefault()
    statusMessage.textContent = ""
    if(feedbackMode){
        submitted = true
        fields.forEach(showFeedback);
        const invalidField = fields.find((field) => !field.validity.valid);
        if(invalidField){
            invalidField.focus()
            return
        }
    }
    statusMessage.textContent = password ? "Registration completed successfully" : "Ur message sent successfully"
});
// task 4
fields.forEach((field) => {
    field.addEventListener("input",()=>{
        statusMessage.textContent = ""
        checkField(field);
        if(submitted || field.hasAttribute("aria-invalid")){
            showFeedback(field)
        }
        if(field == password && confirmation && (submitted || confirmation.hasAttribute("aria-invalid"))){
            showFeedback(confirmation)
        }
    })
    field.addEventListener("blur",()=>{
        if(feedbackMode){
            showFeedback(field)
        }
    });
    field.addEventListener("change",()=>{
        statusMessage.textContent = ""
        if(feedbackMode){
            showFeedback(field);
        }
    });
});
// task 4
form.addEventListener("reset",() => {
    submitted = false
    statusMessage.textContent = ""
    fields.forEach((field) => {
        field.setCustomValidity("");
        field.removeAttribute("aria-invalid")
        field.classList.remove("border-green-600", "border-red-600")
        if(feedbackMode && field.type !== "radio"){
            field.classList.add("border-slate-300")
        }
    });
    form.querySelectorAll("[id$='-feedback']").forEach((message) => {
        message.textContent = ""
        message.classList.remove("text-green-700","text-red-600")
    });
});
