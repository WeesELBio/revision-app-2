let questions = {};
let currentQuestion = null;
let selectedAnswer = null;

fetch("questions.json")
    .then(r => r.json())
    .then(data => {
        questions = data;
        buildMenu();
        nextQuestion(); // AUTO LOAD FIRST QUESTION
    });

function buildMenu() {
    const menu = document.getElementById("menu");

    for (let subject in questions) {
        const subjectDetails = document.createElement("details");
        subjectDetails.open = true;

        const subjectSummary = document.createElement("summary");
        subjectSummary.textContent = subject;
        subjectDetails.appendChild(subjectSummary);

        for (let topic in questions[subject]) {
            const topicDetails = document.createElement("details");

            const topicSummary = document.createElement("summary");
            topicSummary.textContent = topic;
            topicDetails.appendChild(topicSummary);

            for (let sub in questions[subject][topic]) {
                const id = `${subject}-${topic}-${sub}`;

                const cb = document.createElement("input");
                cb.type = "checkbox";
                cb.checked = true;
                cb.id = id;

                const label = document.createElement("label");
                label.htmlFor = id;
                label.textContent = " " + sub;

                topicDetails.appendChild(cb);
                topicDetails.appendChild(label);
                topicDetails.appendChild(document.createElement("br"));
            }

            subjectDetails.appendChild(topicDetails);
        }

        menu.appendChild(subjectDetails);
    }
}

function getPool() {
    let pool = [];

    for (let subject in questions) {
        for (let topic in questions[subject]) {
            for (let sub in questions[subject][topic]) {
                const id = `${subject}-${topic}-${sub}`;
                const box = document.getElementById(id);
                if (box && box.checked) {
                    pool.push(...questions[subject][topic][sub]);
                }
            }
        }
    }

    return pool;
}

function nextQuestion() {
    document.getElementById("feedback").textContent = "";
    document.getElementById("answers").innerHTML = "";
    selectedAnswer = null;

    const pool = getPool();
    if (pool.length === 0) {
        document.getElementById("questionText").textContent =
            "No topics selected.";
        return;
    }

    currentQuestion = pool[Math.floor(Math.random() * pool.length)];
    document.getElementById("questionText").textContent =
        currentQuestion.question;

    const mode = document.querySelector('input[name="mode"]:checked').value;

    if (mode === "normal") {
        showNormal();
    } else {
        showHard();
    }
}

function showNormal() {
    let opts = [...currentQuestion.options];
    opts.sort(() => Math.random() - 0.5);

    const area = document.getElementById("answers");

    opts.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;

        btn.onclick = () => {
            selectedAnswer = opt;
            document.querySelectorAll("#answers button")
                .forEach(b => b.style.border = "");
            btn.style.border = "2px solid black";
        };

        area.appendChild(btn);
    });
}

function showHard() {
    const input = document.createElement("input");
    input.type = "text";
    input.id = "hardInput";
    input.style.width = "100%";
    document.getElementById("answers").appendChild(input);
}

function checkAnswer() {
    if (!currentQuestion) return;

    const mode = document.querySelector('input[name="mode"]:checked').value;

    let userAnswer =
        mode === "normal"
            ? selectedAnswer
            : document.getElementById("hardInput").value.trim();

    if (!userAnswer) return;

    const feedback = document.getElementById("feedback");

    if (userAnswer.toLowerCase() === currentQuestion.correct.toLowerCase()) {
        feedback.textContent = "Correct.";
    } else {
        feedback.textContent =
            "Incorrect. Correct answer: " + currentQuestion.correct;
    }
}
