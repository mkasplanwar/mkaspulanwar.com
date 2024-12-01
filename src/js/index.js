const professions = [
    "Machine Learning Engineer",
    "Data Scientist",
    "Student",
    "Bitcoin Enthusiast"
];

let currentProfession = 0;
let typingIndex = 0;
const typingSpeed = 60;
const erasingSpeed = 30;
const delayBetween = 1000;

const typingElement = document.getElementById("typing-profession");

function typeProfession() {
    if (typingIndex < professions[currentProfession].length) {
        typingElement.textContent += professions[currentProfession].charAt(typingIndex);
        typingIndex++;
        setTimeout(typeProfession, typingSpeed);
    } else {
        setTimeout(eraseProfession, delayBetween);
    }
}

function eraseProfession() {
    if (typingIndex > 0) {
        typingElement.textContent = professions[currentProfession].substring(0, typingIndex - 1);
        typingIndex--;
        setTimeout(eraseProfession, erasingSpeed);
    } else {
        currentProfession = (currentProfession + 1) % professions.length;
        setTimeout(typeProfession, typingSpeed);
    }
}

typeProfession();