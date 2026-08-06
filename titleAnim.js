let spanTexts = document.querySelectorAll(".back-text span");
    window.onload = function(){
        for(let spanText of spanTexts){
            spanText.classList.add("active")
        }
    }