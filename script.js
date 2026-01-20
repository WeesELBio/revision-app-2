let questions = {};
let currentQuestion = null;
let selectedAnswer = null;

fetch("questions.json")
    .then(res => res.json())
    .then(data => {
        questions = data;
        buildTopicSelector();
    });

function buildTopicSelector() {
    const box = document.getElementById("topicBox");

    for (let subject in questions) {
        const s = document.createElement("h3");
        s.textContent = subject;
        box.appendChild(s);

        for (let topic in questions[subject]) {
            const t = document.createElement("strong");
            t.textContent = topic;
            box.appendChild(t);
            box.appendChild(document.createElement("br"));

            for (let sub in questions[subject][topic]) {
                const id = `${subject}-${topic}-${sub}`;

                const cb = document.createElement("input");
                cb.type = "checkbox";
                cb.checked = true;
                cb.id = id;

                const label = document.createElement("label");
                label.htmlFor = id;
                label.textContent = " " + sub;

                box.appendChild(cb);
                box.appendChild(label);
                box.appendChild(document.createElement("br"));
            }
        }
    }
}

function getSelectedQuestions() {
    let pool = [];

    for (let subject in questions) {
        for (let topic in questions[subject]) {
            for (let sub in questions[subject][topic]) {
                const id = `${subject}-${topic}-${sub}`;
                if (document.getElementById(id).checked) {
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

    const pool = getSelectedQuestions();
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
        showMultipleChoice();
    } else {
        showHardMode();
    }
}

function showMultipleChoice() {
    selectedAnswer = null;
    const answersDiv = document.getElementById("answers");

    let opts = [...currentQuestion.options];
    opts.sort(() => Math.random() - 0.5);

    opts.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.onclick = () => {
            selectedAnswer = opt;
            document.querySelectorAll("#answers button")
                .forEach(b => b.style.border = "");
            btn.style.border = "2px solid black";
        };
        answersDiv.appendChild(btn);
    });
}

function showHardMode() {
    const input = document.createElement("input");
    input.type = "text";
    input.id = "hardInput";
    input.style.width = "100%";
    document.getElementById("answers").appendChild(input);
}

function checkAnswer() {
    if (!currentQuestion) return;

    const mode = document.querySelector('input[name="mode"]:checked').value;
    let userAnswer;

    if (mode === "normal") {
        userAnswer = selectedAnswer;
    } else {
        userAnswer = document.getElementById("hardInput").value.trim();
    }

    if (!userAnswer) return;

    const feedback = document.getElementById("feedback");

    if (userAnswer.toLowerCase() === currentQuestion.correct.toLowerCase()) {
        feedback.textContent = "Correct.";
    } else {
        feedback.textContent =
            "Incorrect. Correct answer: " + currentQuestion.correct;
    }
}
