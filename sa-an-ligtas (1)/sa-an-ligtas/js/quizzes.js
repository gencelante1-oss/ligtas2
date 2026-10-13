/* ==========================================================
   S.A.A.N. LIGTAS? — quizzes.js

   EDITING THE QUIZ
   All questions are in the QUESTIONS array below. Each question has:
     topic        - label shown above the question
     question     - the question text
     options      - exactly 4 answer choices
     answer       - index of the correct option (0 = A, 1 = B, 2 = C, 3 = D)
     explanation  - short explanation shown AFTER the learner answers
   Add, remove or reorder questions freely; the score and progress update by themselves.

   NOTE: The questions are general safety knowledge and should be reviewed by
   your adviser / school DRRM coordinator before classroom use.
   ========================================================== */
const QUESTIONS = [
  {
    topic: "Earthquake",
    question: "You are inside a classroom when strong shaking starts. What should you do first?",
    options: ["Run outside right away", "Drop, Cover, and Hold On under a sturdy desk or table", "Stand in a doorway and watch", "Use the elevator to leave quickly"],
    answer: 1,
    explanation: "Drop, Cover, and Hold On protects you from falling objects. Running during shaking is dangerous because of falling debris. Evacuate only after the shaking stops."
  },
  {
    topic: "Earthquake",
    question: "After a strong earthquake, which of these should you do when leaving the building?",
    options: ["Take the stairs and avoid elevators", "Take the elevator to save time", "Stay near glass windows for light", "Go back inside to get your bag"],
    answer: 0,
    explanation: "Elevators can stop working or trap people after an earthquake or during a fire. Use the stairs and do not re-enter a building until authorities say it is safe."
  },
  {
    topic: "Earthquake",
    question: "You are near the coast and feel a very strong earthquake that lasts a long time. What is the safest action once the shaking stops?",
    options: ["Go to the beach to look for a tsunami", "Wait for a text message before moving", "Move quickly to higher ground away from the coast", "Return home using the shoreline road"],
    answer: 2,
    explanation: "A strong, long earthquake near the coast can cause a tsunami. Move to higher ground right away instead of waiting for an official warning."
  },
  {
    topic: "Fire",
    question: "Smoke is filling the hallway during a fire. How should you move?",
    options: ["Stand upright and run", "Stay low, where the air is clearer, and move toward the exit", "Hide under a bed or desk", "Open every door to let smoke out"],
    answer: 1,
    explanation: "Smoke and hot gases rise, so the air near the floor is usually cleaner. Stay low and head for the nearest safe exit. Never hide in a burning building."
  },
  {
    topic: "Fire",
    question: "What does the 'PASS' method for using a fire extinguisher stand for?",
    options: ["Point, Activate, Spray, Stop", "Pull, Aim, Squeeze, Sweep", "Push, Aim, Spray, Step back", "Pull, Alert, Spray, Shout"],
    answer: 1,
    explanation: "Pull the pin, Aim at the base of the fire, Squeeze the handle, Sweep side to side. Only try it on a small fire, with an exit behind you, and if you have been trained."
  },
  {
    topic: "Fire / Electrical",
    question: "Why should you NOT throw water on an electrical fire?",
    options: ["Water is too expensive", "Water can conduct electricity and cause electric shock", "Water makes the fire smaller but slower", "Water turns into smoke immediately"],
    answer: 1,
    explanation: "Water conducts electricity and can shock you. If it is safe, switch off the power at the source, and use an extinguisher rated for electrical fires. If the fire is not small, evacuate and call for help."
  },
  {
    topic: "Electrical",
    question: "You see a fallen electrical wire after a storm. What should you do?",
    options: ["Move it with a wooden stick", "Stay far away, warn others, and report it to the proper authorities", "Touch it quickly to test if it is live", "Step over it carefully"],
    answer: 1,
    explanation: "Always treat fallen wires as live and dangerous, even if they look dead. Keep away, keep others away, and report them to the power utility or local authorities."
  },
  {
    topic: "Flood",
    question: "Floodwater is covering the road. What is the safest choice?",
    options: ["Walk through quickly", "Drive through slowly", "Turn around and find another route, or stay where it is safe", "Swim across to save time"],
    answer: 2,
    explanation: "Floodwater can hide open drains, debris, and strong currents, and may be contaminated or electrically charged. Do not walk, swim, or drive through it."
  },
  {
    topic: "Typhoon",
    question: "Which Philippine agency issues tropical cyclone warnings and Wind Signals?",
    options: ["PHIVOLCS", "PAGASA", "BFP", "DepEd"],
    answer: 1,
    explanation: "PAGASA monitors weather and issues tropical cyclone bulletins and Wind Signals. PHIVOLCS covers earthquakes and volcanoes, and BFP is the fire protection bureau."
  },
  {
    topic: "Typhoon",
    question: "A typhoon is approaching. Where should you get your information?",
    options: ["Forwarded messages with no source", "Official sources such as PAGASA, local DRRM offices, and school announcements", "Rumors from classmates", "Old photos from social media"],
    answer: 1,
    explanation: "Rely on official, up-to-date sources. Rumors and old photos spread quickly during disasters and can cause unsafe decisions."
  },
  {
    topic: "General preparedness",
    question: "Which item is the SAFEST light source to keep in an emergency go-bag?",
    options: ["Candles", "A flashlight with extra batteries", "Matches", "A kerosene lamp"],
    answer: 1,
    explanation: "Flames can start fires, especially after an earthquake or during a gas leak. A flashlight (or headlamp) with spare batteries is the safer choice."
  },
  {
    topic: "General emergency",
    question: "During a school evacuation, what should you do after you leave the building?",
    options: ["Go home without telling anyone", "Go to the designated assembly area and wait for the headcount", "Go back inside to look for friends", "Stand in front of the school gate"],
    answer: 1,
    explanation: "Going to the assembly area lets teachers account for everyone. Going home or back inside can leave people unaccounted for or put rescuers at risk."
  },
  {
    topic: "General emergency",
    question: "What does DRRM stand for?",
    options: ["Disaster Response and Rescue Mission", "Disaster Risk Reduction and Management", "Danger Reporting and Rescue Method", "Disaster Relief and Recovery Measures"],
    answer: 1,
    explanation: "DRRM means Disaster Risk Reduction and Management: the work of reducing risks and being ready before, during, and after a disaster."
  }
];

/* ---------------- Quiz engine ---------------- */
(function () {
  const startScreen = document.getElementById("quiz-start");
  const playScreen = document.getElementById("quiz-play");
  const resultScreen = document.getElementById("quiz-result");
  if (!startScreen) return;

  const els = {
    topic: document.getElementById("q-topic"),
    count: document.getElementById("q-count"),
    score: document.getElementById("q-score"),
    fill: document.getElementById("q-progress-fill"),
    track: document.getElementById("q-progress-track"),
    text: document.getElementById("q-text"),
    options: document.getElementById("q-options"),
    feedback: document.getElementById("q-feedback"),
    next: document.getElementById("q-next")
  };
  const LETTERS = ["A", "B", "C", "D"];
  let index = 0, score = 0, answered = false;

  function show(screen) {
    [startScreen, playScreen, resultScreen].forEach(function (s) { s.hidden = s !== screen; });
  }

  function renderQuestion() {
    const q = QUESTIONS[index];
    answered = false;
    els.topic.textContent = q.topic;
    els.count.textContent = "Question " + (index + 1) + " of " + QUESTIONS.length;
    els.score.textContent = "Score: " + score;
    const pct = Math.round((index / QUESTIONS.length) * 100);
    els.fill.style.width = pct + "%";
    els.track.setAttribute("aria-valuenow", String(pct));
    els.text.textContent = q.question;
    els.feedback.hidden = true;
    els.next.hidden = true;
    els.options.innerHTML = "";

    q.options.forEach(function (opt, i) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      const letter = document.createElement("span");
      letter.className = "letter"; letter.textContent = LETTERS[i];
      const label = document.createElement("span");
      label.textContent = opt;
      btn.append(letter, label);
      btn.addEventListener("click", function () { choose(i); });
      els.options.appendChild(btn);
    });
  }

  // The correct answer is only revealed AFTER the learner picks an option
  function choose(i) {
    if (answered) return;
    answered = true;
    const q = QUESTIONS[index];
    const buttons = els.options.querySelectorAll(".option");
    buttons.forEach(function (b) { b.disabled = true; });
    const correct = i === q.answer;
    if (correct) score++;
    buttons[i].classList.add(correct ? "correct" : "wrong");
    if (!correct) buttons[q.answer].classList.add("correct");

    els.feedback.className = "feedback " + (correct ? "good" : "bad");
    els.feedback.innerHTML = "";
    const strong = document.createElement("strong");
    strong.textContent = correct ? "Correct! " : "Not quite. The correct answer is " + LETTERS[q.answer] + ". ";
    els.feedback.append(strong, document.createTextNode(q.explanation));
    els.feedback.hidden = false;
    els.score.textContent = "Score: " + score;

    els.next.textContent = index === QUESTIONS.length - 1 ? "See results" : "Next question";
    els.next.hidden = false;
    els.next.focus();
  }

  function showResult() {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    document.getElementById("r-score").textContent = score + " / " + QUESTIONS.length;
    document.getElementById("r-pct").textContent = pct + "%";
    let msg;
    if (pct >= 90) msg = "Excellent! You are well prepared. Share what you learned with others.";
    else if (pct >= 70) msg = "Good job! Review the explanations for the questions you missed.";
    else if (pct >= 50) msg = "A decent start. Visit the Safety Protocols and Learning pages, then try again.";
    else msg = "Keep learning! Read the Safety Protocols page and try the quiz again.";
    document.getElementById("r-message").textContent = msg;
    els.fill.style.width = "100%";
    show(resultScreen);
    resultScreen.querySelector("h2").focus();
  }

  function start() {
    index = 0; score = 0;
    show(playScreen);
    renderQuestion();
  }

  els.next.addEventListener("click", function () {
    if (index < QUESTIONS.length - 1) { index++; renderQuestion(); } else { showResult(); }
  });
  document.getElementById("start-quiz").addEventListener("click", start);
  document.getElementById("restart-quiz").addEventListener("click", start);
  document.getElementById("total-questions").textContent = String(QUESTIONS.length);
  show(startScreen);
})();
