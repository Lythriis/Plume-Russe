// === SECTION 1 – Cœur de la progression (profil local, stats) ===
// Gestion d'un petit "profil" stocké dans le navigateur (localStorage)
const STORAGE_KEY = "plume-russe-progress-v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        lessonsCompleted: 0,
        exercisesPassed: 0,
        lastActivity: null,
        teacherNotes: "",
        fullName: "",
        age: "",
        nickname: "",
        totalTimeMs: 0,
        hasRegistered: false,
        createdAt: null,
        learnerGoals: "",
      };
    }
    const parsed = JSON.parse(raw);
    return {
      lessonsCompleted: parsed.lessonsCompleted ?? 0,
      exercisesPassed: parsed.exercisesPassed ?? 0,
      lastActivity: parsed.lastActivity ?? null,
      teacherNotes: parsed.teacherNotes ?? "",
      fullName: parsed.fullName ?? "",
      age: parsed.age ?? "",
      nickname: parsed.nickname ?? "",
      totalTimeMs: parsed.totalTimeMs ?? 0,
      hasRegistered: parsed.hasRegistered ?? false,
      createdAt: parsed.createdAt ?? null,
      learnerGoals: parsed.learnerGoals ?? "",
    };
  } catch {
    return {
      lessonsCompleted: 0,
      exercisesPassed: 0,
      lastActivity: null,
      teacherNotes: "",
      fullName: "",
      age: "",
      nickname: "",
      totalTimeMs: 0,
      hasRegistered: false,
      createdAt: null,
      learnerGoals: "",
    };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatDate(dateStr) {
  if (!dateStr) return "–";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "–";
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// === SECTION 2 – Mise à jour de l'interface (tableau de bord, suivi) ===
function updateUI(state) {
  const lessons = state.lessonsCompleted;
  const exercises = state.exercisesPassed;

  const statLessons = document.getElementById("statLessons");
  const statExercises = document.getElementById("statExercises");
  const statLastActivity = document.getElementById("statLastActivity");

  const detailLessons = document.getElementById("detailLessons");
  const detailExercises = document.getElementById("detailExercises");
  const detailLastActivity = document.getElementById("detailLastActivity");

  const progressSummary = document.getElementById("progressSummary");

  if (statLessons) statLessons.textContent = String(lessons);
  if (statExercises) statExercises.textContent = String(exercises);
  if (statLastActivity)
    statLastActivity.textContent = formatDate(state.lastActivity);

  if (detailLessons) detailLessons.textContent = String(lessons);
  if (detailExercises) detailExercises.textContent = String(exercises);
  if (detailLastActivity)
    detailLastActivity.textContent = formatDate(state.lastActivity);

  if (progressSummary) {
    if (!state.lastActivity && lessons === 0 && exercises === 0) {
      progressSummary.textContent = "Aucune progression enregistrée pour le moment.";
    } else {
      progressSummary.textContent = `Leçons complétées : ${lessons} • Exercices réussis : ${exercises} • Dernière activité : ${formatDate(
        state.lastActivity
      )}`;
    }
  }

  const notes = document.getElementById("teacherNotes");
  if (notes && notes.value !== state.teacherNotes) {
    notes.value = state.teacherNotes;
  }
}

// === SECTION 3 – Actions de progression (terminer une leçon / un exercice) ===
function bumpLesson(state) {
  const next = { ...state };
  next.lessonsCompleted += 1;
  next.lastActivity = new Date().toISOString();
  saveState(next);
  updateUI(next);
  return next;
}

function bumpExercise(state) {
  const next = { ...state };
  next.exercisesPassed += 1;
  next.lastActivity = new Date().toISOString();
  saveState(next);
  updateUI(next);
  return next;
}

// === SECTION 4 – Initialisation des interactions de base ===
// Boutons, exercices, notes professeur. Les futures fonctionnalités (badges,
// inscriptions, surprises, modération) pourront avoir leurs propres blocs ici.
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Sous-section 4.1 – Chargement de l'état actuel
  let state = loadState();
  updateUI(state);

  // Sous-section 4.2 – Accueil (boutons principaux)
  // Bouton "Commencer la prochaine leçon" : on incrémente une leçon terminée
  const startLessonBtn = document.getElementById("startLessonBtn");
  if (startLessonBtn) {
    startLessonBtn.addEventListener("click", () => {
      state = bumpLesson(state);
      window.location.hash = "#lecons";
    });
  }

  // Bouton "Continuer"
  const continueBtn = document.getElementById("continueBtn");
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      if (state.lessonsCompleted === 0) {
        window.location.hash = "#lecons";
      } else {
        window.location.hash = "#exercices";
      }
    });
  }

  // Sous-section 4.3 – Navigation des leçons
  // Boutons "Ouvrir la leçon" : pour l'instant, on fait défiler vers la section exercices
  document.querySelectorAll(".lesson-open-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.hash = "#exercices";
    });
  });

  // Sous-section 4.4 – Exercices (QCM)
  document.querySelectorAll(".pr-quiz").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const correct = form.getAttribute("data-correct");
      const feedback = form.querySelector("[data-feedback]");
      const selected = form.querySelector("input[type=radio]:checked");

      if (!feedback) return;

      if (!selected) {
        feedback.textContent = "Choisis une réponse avant de valider.";
        feedback.classList.remove("pr-feedback--success", "pr-feedback--error");
        return;
      }

      if (selected.value === correct) {
        feedback.textContent = "Bravo, c'est correct !";
        feedback.classList.add("pr-feedback--success");
        feedback.classList.remove("pr-feedback--error");
        state = bumpExercise(state);
      } else {
        feedback.textContent = "Ce n'est pas la bonne réponse, essaie encore.";
        feedback.classList.add("pr-feedback--error");
        feedback.classList.remove("pr-feedback--success");
      }
    });
  });

  // Sous-section 4.5 – Exercices (réponse libre)
  document.querySelectorAll(".pr-input-exercise").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const expectedRaw = (form.getAttribute("data-answer") || "").trim();
      const expected = expectedRaw.toLowerCase();
      const feedback = form.querySelector("[data-feedback]");
      const input = form.querySelector("input[name=answer]");

      if (!feedback || !input) return;

      const value = String(input.value || "").trim().toLowerCase();

      if (!value) {
        feedback.textContent = "Écris une réponse avant de valider.";
        feedback.classList.remove("pr-feedback--success", "pr-feedback--error");
        return;
      }

      if (value === expected) {
        feedback.textContent = "Parfait ! Tu as bien écrit la réponse.";
        feedback.classList.add("pr-feedback--success");
        feedback.classList.remove("pr-feedback--error");
        state = bumpExercise(state);
      } else {
        feedback.textContent = `Ce n'est pas tout à fait ça. La réponse attendue est « ${expectedRaw} ».`;
        feedback.classList.add("pr-feedback--error");
        feedback.classList.remove("pr-feedback--success");
      }
    });
  });

  // Sous-section 4.6 – Notes professeur (espace perso professeur)
  const notes = document.getElementById("teacherNotes");
  if (notes) {
    notes.addEventListener("input", () => {
      state = { ...state, teacherNotes: notes.value };
      saveState(state);
    });
  }

  // === SECTION 5 – Place réservée (future) ===
  // 5.1 – Badges & récompenses visuelles
  // 5.2 – Espace personnel élève (compte, pseudo, avatar)
  // 5.3 – Modération / administration (réinitialiser la progression, cacher/montrer des surprises)
  // 5.4 – Features cachées / surprises (débloquées selon la progression)
});

