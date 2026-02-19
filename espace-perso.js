// === Espace personnel – profil, temps passé, badges (fichier dédié) ===
// Ce fichier se concentre uniquement sur la gestion de l'espace perso.
// Il réutilise les fonctions globales `loadState`, `saveState`, `updateUI`
// déjà définies dans `script.js`.

let espacePersoSessionStart = null;

document.addEventListener("DOMContentLoaded", () => {
  let state = loadState();

  // Écran d'inscription : affiché uniquement si aucun compte n'existe encore
  const overlay = document.getElementById("signupOverlay");
  const signupForm = document.getElementById("signupForm");
  const signupFeedback = document.getElementById("signupFeedback");

  if (overlay && signupForm) {
    if (!state.hasRegistered) {
      overlay.classList.add("pr-overlay--visible");
      document.body.classList.add("pr-no-scroll");
    }

    signupForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(signupForm);
      const nickname = String(formData.get("nickname") || "").trim();
      const fullName = String(formData.get("fullName") || "").trim();
      const ageRaw = String(formData.get("age") || "").trim();

      if (!nickname) {
        if (signupFeedback) {
          signupFeedback.textContent = "Le pseudo est obligatoire pour créer ton compte.";
          signupFeedback.classList.remove(
            "pr-feedback--success",
            "pr-feedback--error"
          );
        }
        return;
      }

      let age = ageRaw;
      if (ageRaw) {
        const n = Number(ageRaw);
        if (!Number.isFinite(n) || n <= 0) {
          if (signupFeedback) {
            signupFeedback.textContent = "L'âge indiqué n'est pas valide.";
            signupFeedback.classList.remove(
              "pr-feedback--success",
              "pr-feedback--error"
            );
          }
          return;
        }
        age = String(Math.round(n));
      }

      state = {
        ...state,
        fullName,
        age,
        nickname,
        hasRegistered: true,
        createdAt: state.createdAt || new Date().toISOString(),
      };
      saveState(state);
      updateUI(state);
      applyEspacePersoUI(state);

      overlay.classList.remove("pr-overlay--visible");
      document.body.classList.remove("pr-no-scroll");
    });
  }

  // Pré-remplir le formulaire si un profil existe déjà
  const fullNameInput = document.getElementById("fullName");
  const ageInput = document.getElementById("age");
  const nicknameInput = document.getElementById("nickname");
  const learnerGoals = document.getElementById("learnerGoals");

  if (fullNameInput) fullNameInput.value = state.fullName || "";
  if (ageInput) ageInput.value = state.age || "";
  if (nicknameInput) nicknameInput.value = state.nickname || "";
  if (learnerGoals && learnerGoals.value !== (state.learnerGoals || "")) {
    learnerGoals.value = state.learnerGoals || "";
  }

  // Met à jour les éléments spécifiques de l'espace perso
  applyEspacePersoUI(state);

  // Gestion du formulaire de compte
  const accountForm = document.getElementById("accountForm");
  const accountFeedback = document.getElementById("accountFeedback");
  if (accountForm) {
    accountForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(accountForm);
      const fullName = String(formData.get("fullName") || "").trim();
      const ageRaw = String(formData.get("age") || "").trim();
      const nickname = String(formData.get("nickname") || "").trim();

      let age = ageRaw;
      if (ageRaw) {
        const n = Number(ageRaw);
        if (!Number.isFinite(n) || n <= 0) {
          if (accountFeedback) {
            accountFeedback.textContent = "L'âge indiqué n'est pas valide.";
            accountFeedback.classList.remove(
              "pr-feedback--success",
              "pr-feedback--error"
            );
          }
          return;
        }
        age = String(Math.round(n));
      }

      state = {
        ...state,
        fullName,
        age,
        nickname,
        hasRegistered: true,
        createdAt: state.createdAt || new Date().toISOString(),
      };
      saveState(state);
      updateUI(state);
      applyEspacePersoUI(state);

      if (accountFeedback) {
        accountFeedback.textContent = "Profil enregistré avec succès.";
        accountFeedback.classList.add("pr-feedback--success");
        accountFeedback.classList.remove("pr-feedback--error");
      }
    });
  }

  // Sous-section espace perso – objectifs de l'élève
  const goalsTextarea = document.getElementById("learnerGoals");
  if (goalsTextarea) {
    goalsTextarea.addEventListener("input", () => {
      state = { ...state, learnerGoals: goalsTextarea.value };
      saveState(state);
    });
  }

  // Démarrage du chrono de session pour calculer le temps passé
  espacePersoSessionStart = Date.now();

  window.addEventListener("beforeunload", () => {
    if (!espacePersoSessionStart) return;
    const now = Date.now();
    const delta = Math.max(0, now - espacePersoSessionStart);

    const current = loadState();
    const updated = {
      ...current,
      totalTimeMs: (current.totalTimeMs || 0) + delta,
    };
    saveState(updated);
  });
});

function applyEspacePersoUI(state) {
  const lessons = state.lessonsCompleted ?? 0;
  const exercises = state.exercisesPassed ?? 0;

  const summaryLessons = document.getElementById("summaryLessons");
  const summaryExercises = document.getElementById("summaryExercises");
  const summaryTimeSpent = document.getElementById("summaryTimeSpent");
  const summaryFullName = document.getElementById("summaryFullName");
  const summaryAge = document.getElementById("summaryAge");
  const summaryNickname = document.getElementById("summaryNickname");
  const accountWelcome = document.getElementById("accountWelcome");
  const heroProfileLine = document.getElementById("heroProfileLine");

  if (summaryLessons) summaryLessons.textContent = String(lessons);
  if (summaryExercises) summaryExercises.textContent = String(exercises);

  const minutes = Math.floor((state.totalTimeMs || 0) / 60000);
  if (summaryTimeSpent) summaryTimeSpent.textContent = `${minutes} min`;

  if (summaryFullName) summaryFullName.textContent = state.fullName || "–";
  if (summaryAge) summaryAge.textContent = state.age || "–";
  if (summaryNickname) summaryNickname.textContent = state.nickname || "–";

  if (accountWelcome) {
    if (!state.nickname && !state.fullName) {
      accountWelcome.textContent =
        "Aucun profil enregistré pour le moment. Commence par remplir le formulaire.";
    } else {
      const parts = [];
      if (state.nickname) parts.push(`@${state.nickname}`);
      if (state.fullName) parts.push(state.fullName);
      if (state.age) parts.push(`${state.age} ans`);
      accountWelcome.textContent = `Bienvenue dans ton espace, ${parts.join(
        " • "
      )} !`;
    }
  }

  if (heroProfileLine) {
    if (state.nickname) {
      heroProfileLine.textContent = `Heureuse de te revoir, @${state.nickname} !`;
    } else {
      heroProfileLine.textContent =
        "Bienvenue ! Crée ton espace personnel pour suivre ta progression.";
    }
  }

  // TODO (plus tard) : remplir ici la logique d'affichage des badges en fonction de la progression.
}

