const splash = document.querySelector("#splash");
const playButton = document.querySelector("#playButton");
const exitButton = document.querySelector("#exitButton");
const exitMessage = document.querySelector("#exitMessage");
const splashPlayerNameInput = document.querySelector("#splashPlayerName");
const splashCreateRoomButton = document.querySelector("#splashCreateRoomButton");
const splashJoinRoomButton = document.querySelector("#splashJoinRoomButton");
const splashRoomCodeInput = document.querySelector("#splashRoomCodeInput");
const splashRoomCodeEl = document.querySelector("#splashRoomCode");
const splashOnlineStatus = document.querySelector("#splashOnlineStatus");
const coinsEl = document.querySelector("#coins");
const sceneCard = document.querySelector("#sceneCard");
const avatar = document.querySelector("#avatar");
const levelNameEl = document.querySelector("#levelName");
const levelStepText = document.querySelector("#levelStepText");
const progressFill = document.querySelector("#progressFill");
const stepsEl = document.querySelector("#steps");
const scoreEl = document.querySelector("#score");
const caloriesEl = document.querySelector("#calories");
const streakEl = document.querySelector("#streak");
const sensorButton = document.querySelector("#sensorButton");
const stepButton = document.querySelector("#stepButton");
const undoStepButton = document.querySelector("#undoStepButton");
const sensorStatus = document.querySelector("#sensorStatus");
const avatarLevel = document.querySelector("#avatarLevel");
const skinList = document.querySelector("#skinList");
const missionsEl = document.querySelector("#missions");
const badgesEl = document.querySelector("#badges");
const badgeCount = document.querySelector("#badgeCount");
const rankingEl = document.querySelector("#ranking");
const toast = document.querySelector("#toast");
const playerNameInput = document.querySelector("#playerName");
const createRoomButton = document.querySelector("#createRoomButton");
const roomCodeInput = document.querySelector("#roomCodeInput");
const joinRoomButton = document.querySelector("#joinRoomButton");
const leaveRoomButton = document.querySelector("#leaveRoomButton");
const onlineBadge = document.querySelector("#onlineBadge");
const roomCard = document.querySelector("#roomCard");
const roomCodeEl = document.querySelector("#roomCode");
const onlineBoard = document.querySelector("#onlineBoard");
const onlineStatus = document.querySelector("#onlineStatus");

const STORAGE_KEY = "step-quest-save-v1";
const ONLINE_KEY = "step-quest-online-v1";
const CALORIES_PER_STEP = 0.04;

const levels = [
  { name: "Bosque Inicial", steps: 20, scene: "forest", reward: 25 },
  { name: "Praia do Folego", steps: 30, scene: "beach", reward: 40 },
  { name: "Cidade Ativa", steps: 50, scene: "city", reward: 70 },
  { name: "Trilha Alta", steps: 80, scene: "mountain", reward: 120 },
  { name: "Noite Neon", steps: 120, scene: "neon", reward: 180 },
  { name: "Dunas Douradas", steps: 170, scene: "desert", reward: 240 },
  { name: "Caverna Eco", steps: 230, scene: "cave", reward: 320 },
  { name: "Vale de Neve", steps: 300, scene: "snow", reward: 430 },
  { name: "Vulcao Ativo", steps: 390, scene: "volcano", reward: 560 },
  { name: "Orbita Final", steps: 500, scene: "space", reward: 750 },
];

const skins = [
  { id: "blue", name: "Azul Inicial", cost: 0, bodyColor: "#3a7bd5", skinColor: "#ffbf69" },
  { id: "lime", name: "Energia Verde", cost: 65, bodyColor: "#8cc63f", skinColor: "#ffd39a" },
  { id: "sun", name: "Sol Dourado", cost: 95, bodyColor: "#f7b733", skinColor: "#c98252" },
  { id: "coral", name: "Turbo Coral", cost: 130, bodyColor: "#f05d5e", skinColor: "#f1a66a" },
  { id: "aqua", name: "Aqua Sprint", cost: 175, bodyColor: "#22b8cf", skinColor: "#8d5524" },
  { id: "grape", name: "Uva Forte", cost: 210, bodyColor: "#7b61ff", skinColor: "#e0ac69" },
  { id: "rose", name: "Rosa Flash", cost: 255, bodyColor: "#f06595", skinColor: "#f6c7a4" },
  { id: "mint", name: "Menta Zen", cost: 310, bodyColor: "#2ca58d", skinColor: "#9c6644" },
  { id: "ice", name: "Gelo Rapido", cost: 380, bodyColor: "#74c0fc", skinColor: "#f3d5b5" },
  { id: "lava", name: "Lava Runner", cost: 470, bodyColor: "#e8590c", skinColor: "#7f5539" },
  { id: "neon", name: "Neon Noturno", cost: 590, bodyColor: "#263859", skinColor: "#d08c60" },
  { id: "royal", name: "Royal Legend", cost: 760, bodyColor: "#10222f", skinColor: "#ffdbac" },
];

const missions = [
  { id: "m1", name: "Aquecimento diario", target: 20, reward: 20 },
  { id: "m2", name: "Mini caminhada diaria", target: 60, reward: 50 },
  { id: "m3", name: "Ritmo firme diario", target: 100, reward: 90 },
  { id: "w1", name: "Desafio semanal", target: 300, reward: 220 },
];

const badges = [
  { id: "b1", name: "Primeiro passo", text: "Deu o primeiro passo.", test: (s) => s.totalSteps >= 1 },
  { id: "b2", name: "20 passos", text: "Completou 20 passos.", test: (s) => s.totalSteps >= 20 },
  { id: "b3", name: "Explorador", text: "Desbloqueou 3 cenarios.", test: (s) => s.levelIndex >= 2 },
  { id: "b4", name: "Colecionador", text: "Comprou uma skin.", test: (s) => s.ownedSkins.length > 1 },
  { id: "b5", name: "Centena ativa", text: "Chegou a 100 passos.", test: (s) => s.totalSteps >= 100 },
  { id: "b6", name: "Quase atleta", text: "Chegou a 250 passos.", test: (s) => s.totalSteps >= 250 },
  { id: "b7", name: "Perna de aco", text: "Chegou a 500 passos.", test: (s) => s.totalSteps >= 500 },
  { id: "b8", name: "Mil passos", text: "Acumulou 1000 passos.", test: (s) => s.totalSteps >= 1000 },
  { id: "b9", name: "Viajante", text: "Desbloqueou 6 cenarios.", test: (s) => s.levelIndex >= 5 },
  { id: "b10", name: "Mestre dos mapas", text: "Chegou ao ultimo cenario.", test: (s) => s.levelIndex >= levels.length - 1 },
  { id: "b11", name: "Guarda-roupa cheio", text: "Desbloqueou todas as skins.", test: (s) => s.ownedSkins.length >= skins.length },
  { id: "b12", name: "Missao cumprida", text: "Concluiu todas as missoes.", test: (s) => s.claimedMissions.length >= missions.length },
];

const defaultState = {
  totalSteps: 0,
  levelIndex: 0,
  levelSteps: 0,
  score: 0,
  coins: 0,
  activeHours: 0,
  lastStepAt: 0,
  minuteSteps: [],
  claimedMissions: [],
  unlockedBadges: [],
  ownedSkins: ["blue"],
  activeSkin: "blue",
  ranking: [],
};

let state = loadState();
let motionEnabled = false;
let lastMotionStepAt = 0;
let sensorEvents = 0;
let sensorWatchdog = null;
let lastOrientation = null;
let toastTimer = null;
let motionEventCount = 0;
let motion = createMotionState();
let online = loadOnlineState();
let onlineSyncTimer = null;
let onlineSyncBusy = false;

function createMotionState() {
  return {
    gravity: { x: 0, y: 0, z: 0 },
    lastFiltered: 0,
    samples: [],
    armed: true,
    warmup: 0,
    stepTimes: [],
    lastStatusAt: 0,
  };
}

document.body.classList.add("menu-open");

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...defaultState, ...saved };
  } catch {
    return { ...defaultState };
  }
}

function loadOnlineState() {
  try {
    const saved = JSON.parse(localStorage.getItem(ONLINE_KEY));
    return {
      roomCode: saved?.roomCode || "",
      playerId: saved?.playerId || "",
      playerName: saved?.playerName || "",
      connected: false,
      players: [],
    };
  } catch {
    return { roomCode: "", playerId: "", playerName: "", connected: false, players: [] };
  }
}

function saveOnlineState() {
  localStorage.setItem(
    ONLINE_KEY,
    JSON.stringify({
      roomCode: online.roomCode,
      playerId: online.playerId,
      playerName: online.playerName,
    })
  );
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function currentLevel() {
  return levels[Math.min(state.levelIndex, levels.length - 1)];
}

function getPlayerName() {
  const savedName = online.playerName || "";
  const typedName = playerNameInput.value.trim() || splashPlayerNameInput.value.trim();
  return (typedName || savedName || "Jogador").slice(0, 14);
}

function getOnlinePayload() {
  return {
    name: getPlayerName(),
    totalSteps: state.totalSteps,
    score: state.score,
    coins: state.coins,
    calories: Math.round(state.totalSteps * CALORIES_PER_STEP),
    levelName: currentLevel().name,
    levelIndex: state.levelIndex,
    levelSteps: state.levelSteps,
    levelGoal: currentLevel().steps,
    updatedAt: Date.now(),
  };
}

async function apiRequest(pathName, options = {}) {
  const response = await fetch(pathName, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Falha de conexao.");
  }
  return data;
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function buzz(pattern = 40) {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

function beep() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.frequency.value = 620;
  gain.gain.value = 0.04;
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start();
  osc.stop(context.currentTime + 0.08);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function resetSensorCalibration(showMessage = true) {
  motion = createMotionState();
  lastMotionStepAt = 0;
  lastOrientation = null;
  motionEventCount = 0;
  sensorEvents = 0;

  if (showMessage) {
    sensorStatus.textContent =
      "Sensor iniciado e calibrando. Fique parado por 3 segundos e depois caminhe normalmente.";
    showToast("Sensor calibrando.");
    buzz(30);
  }
}

function recordMinuteStep(now) {
  const minute = Math.floor(now / 60000);
  const entry = state.minuteSteps.find((item) => item.minute === minute);
  if (entry) {
    entry.steps += 1;
  } else {
    state.minuteSteps.push({ minute, steps: 1 });
  }
  state.minuteSteps = state.minuteSteps.filter((item) => minute - item.minute <= 60);
}

function updateActiveStreak(now) {
  const last = state.lastStepAt;
  if (!last || now - last > 60 * 60 * 1000) {
    state.activeHours = 0;
  }

  if (last && now - last >= 60 * 60 * 1000 && now - last < 2 * 60 * 60 * 1000) {
    state.activeHours += 1;
    showToast(`Sequencia ativa: ${state.activeHours}h! Multiplicador maior.`);
  }

  state.lastStepAt = now;
}

function stepMultiplier() {
  return 1 + Math.min(3, state.activeHours) * 0.25;
}

function minuteBonus(now) {
  const minute = Math.floor(now / 60000);
  const thisMinute = state.minuteSteps.find((item) => item.minute === minute);
  return thisMinute && thisMinute.steps > 0 && thisMinute.steps % 25 === 0;
}

function addStep(amount = 1, source = "manual") {
  for (let i = 0; i < amount; i += 1) {
    const now = Date.now();
    recordMinuteStep(now);
    updateActiveStreak(now);

    const points = Math.round(10 * stepMultiplier());
    state.totalSteps += 1;
    state.levelSteps += 1;
    state.score += points;
    state.coins += 1;

    if (minuteBonus(now)) {
      state.score += 120;
      state.coins += 20;
      showToast("Bonus de ritmo: +120 pontos e +20 moedas!");
      buzz([40, 30, 40]);
      beep();
    }

    completeLevelsIfNeeded();
    checkMissions();
    checkBadges();
  }

  saveState();
  render();
  animateStep();
  syncOnline(false);

  if (source === "sensor" && motion.stepTimes.length < 2) {
    sensorStatus.textContent = "Sensor ativo: passos detectados pelo movimento do celular.";
  }
}

function removeStep() {
  if (state.totalSteps <= 0) {
    showToast("Ainda nao ha passos para remover.");
    return;
  }

  state.totalSteps = Math.max(0, state.totalSteps - 1);
  state.levelSteps = Math.max(0, state.levelSteps - 1);
  state.score = Math.max(0, state.score - 10);
  state.coins = Math.max(0, state.coins - 1);

  saveState();
  render();
  syncOnline(false);
  showToast("1 passo removido.");
}

function completeLevelsIfNeeded() {
  let level = currentLevel();
  while (state.levelSteps >= level.steps) {
    state.levelSteps -= level.steps;
    state.score += level.reward;
    state.coins += level.reward;
    saveRank(level.name, level.steps);
    showToast(`Fase completa: ${level.name}! +${level.reward} moedas`);
    buzz([70, 40, 70]);
    beep();

    if (state.levelIndex < levels.length - 1) {
      state.levelIndex += 1;
      level = currentLevel();
    } else {
      level = currentLevel();
      break;
    }
  }
}

function saveRank(levelName, steps) {
  state.ranking.unshift({
    levelName,
    steps,
    score: state.score,
    date: new Date().toLocaleDateString("pt-BR"),
  });
  state.ranking = state.ranking.slice(0, 5);
}

function checkMissions() {
  missions.forEach((mission) => {
    if (state.totalSteps >= mission.target && !state.claimedMissions.includes(mission.id)) {
      state.claimedMissions.push(mission.id);
      state.coins += mission.reward;
      showToast(`Missao concluida: ${mission.name}! +${mission.reward} moedas`);
      buzz(60);
    }
  });
}

function checkBadges() {
  badges.forEach((badge) => {
    if (badge.test(state) && !state.unlockedBadges.includes(badge.id)) {
      state.unlockedBadges.push(badge.id);
      state.coins += 15;
      showToast(`Conquista desbloqueada: ${badge.name}`);
      buzz([35, 35, 35]);
    }
  });
}

function animateStep() {
  avatar.classList.remove("step");
  window.requestAnimationFrame(() => {
    avatar.classList.add("step");
  });
}

function buyOrEquipSkin(skinId) {
  const skin = skins.find((item) => item.id === skinId);
  if (!skin) return;

  if (state.ownedSkins.includes(skin.id)) {
    state.activeSkin = skin.id;
    showToast(`${skin.name} equipado.`);
  } else if (state.coins >= skin.cost) {
    state.coins -= skin.cost;
    state.ownedSkins.push(skin.id);
    state.activeSkin = skin.id;
    showToast(`Skin ${skin.name} comprada e equipada!`);
    buzz(70);
  } else {
    showToast(`Faltam ${skin.cost - state.coins} moedas.`);
  }

  checkBadges();
  saveState();
  render();
}

async function enableSensor() {
  const hasMotion = "DeviceMotionEvent" in window;
  const hasOrientation = "DeviceOrientationEvent" in window;

  if (!hasMotion && !hasOrientation) {
    sensorStatus.textContent = "Este navegador nao oferece sensor de movimento. Use os botoes de passos.";
    showToast("Modo simulacao ativado.");
    return;
  }

  try {
    if (hasMotion && typeof DeviceMotionEvent.requestPermission === "function") {
      const permission = await DeviceMotionEvent.requestPermission();
      if (permission !== "granted") {
        sensorStatus.textContent = "Permissao negada. O botao +1 passo continua funcionando.";
        return;
      }
    }

    if (hasOrientation && typeof DeviceOrientationEvent.requestPermission === "function") {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission !== "granted") {
        sensorStatus.textContent = "Permissao negada. Os botoes de passos continuam funcionando.";
        return;
      }
    }

    resetSensorCalibration(true);

    if (!motionEnabled) {
      if (hasMotion) window.addEventListener("devicemotion", handleMotion);
      if (hasOrientation) window.addEventListener("deviceorientation", handleOrientation);
      motionEnabled = true;
    }

    sensorEvents = 0;
    clearTimeout(sensorWatchdog);
    sensorWatchdog = setTimeout(() => {
      if (sensorEvents === 0) {
        sensorStatus.textContent = window.isSecureContext
          ? "Sensor autorizado, mas nenhum movimento chegou. Balance ou caminhe com o celular desbloqueado."
          : "O navegador bloqueou eventos de sensor em HTTP. Para sensor real, abra esta pagina por HTTPS.";
        showToast("Sem eventos de sensor. Use HTTPS ou os botoes.");
      }
    }, 4200);

    sensorButton.textContent = "Sensor ativo";
    sensorStatus.textContent = window.isSecureContext
      ? "Sensor iniciado. Aguarde a calibracao e caminhe com o celular."
      : "Tentando sensor em HTTP. Se nao contar, o celular exige HTTPS.";
    showToast("Sensor ativado. Bora caminhar!");
    buzz(40);
  } catch {
    sensorStatus.textContent = "Nao consegui ativar o sensor. Use HTTPS ou os botoes de passos.";
  }
}

function handleMotion(event) {
  const now = Date.now();
  sensorEvents += 1;
  motionEventCount += 1;

  const linear = getLinearAcceleration(event);
  if (!linear) return;

  const magnitude = Math.sqrt(linear.x ** 2 + linear.y ** 2 + linear.z ** 2);
  const filtered = motion.lastFiltered * 0.74 + magnitude * 0.26;
  motion.lastFiltered = filtered;
  motion.samples.push(filtered);
  if (motion.samples.length > 46) motion.samples.shift();

  motion.warmup += 1;
  if (motion.warmup < 22 || motion.samples.length < 22) {
    sensorStatus.textContent = "Calibrando sensor... caminhe em ritmo normal.";
    return;
  }

  const stats = sampleStats(motion.samples);
  const threshold = clamp(stats.mean + stats.std * 1.62, 1.28, 4.9);
  const releaseThreshold = clamp(stats.mean + stats.std * 0.38, 0.45, threshold * 0.68);
  const interval = lastMotionStepAt ? now - lastMotionStepAt : 900;
  const cadenceOk = interval >= 460 && interval <= 1700;
  const restartOk = interval > 2200;

  if (filtered < releaseThreshold) {
    motion.armed = true;
  }

  if (motion.armed && filtered > threshold && (cadenceOk || restartOk)) {
    lastMotionStepAt = now;
    motion.armed = false;
    rememberStepTime(now);
    addStep(1, "sensor");
  }
}

function handleOrientation(event) {
  if (event.beta === null || event.gamma === null) return;
  if (motionEventCount > 12) return;

  const now = Date.now();
  sensorEvents += 1;

  if (!lastOrientation) {
    lastOrientation = { beta: event.beta, gamma: event.gamma };
    return;
  }

  const swing =
    Math.abs(event.beta - lastOrientation.beta) + Math.abs(event.gamma - lastOrientation.gamma);

  lastOrientation = { beta: event.beta, gamma: event.gamma };

  const interval = lastMotionStepAt ? now - lastMotionStepAt : 900;
  if (swing > 22 && interval > 620 && interval < 1700) {
    lastMotionStepAt = now;
    rememberStepTime(now);
    addStep(1, "sensor");
  }
}

function getLinearAcceleration(event) {
  const direct = event.acceleration;
  if (direct && [direct.x, direct.y, direct.z].every((value) => typeof value === "number")) {
    const linear = {
      x: direct.x || 0,
      y: direct.y || 0,
      z: direct.z || 0,
    };
    const directMagnitude = Math.sqrt(linear.x ** 2 + linear.y ** 2 + linear.z ** 2);
    if (directMagnitude > 0.12) return linear;
  }

  const raw = event.accelerationIncludingGravity;
  if (!raw) return null;

  const x = raw.x || 0;
  const y = raw.y || 0;
  const z = raw.z || 0;
  const alpha = 0.94;

  motion.gravity.x = motion.gravity.x * alpha + x * (1 - alpha);
  motion.gravity.y = motion.gravity.y * alpha + y * (1 - alpha);
  motion.gravity.z = motion.gravity.z * alpha + z * (1 - alpha);

  return {
    x: x - motion.gravity.x,
    y: y - motion.gravity.y,
    z: z - motion.gravity.z,
  };
}

function sampleStats(samples) {
  const mean = samples.reduce((sum, value) => sum + value, 0) / samples.length;
  const variance =
    samples.reduce((sum, value) => sum + (value - mean) ** 2, 0) / samples.length;

  return {
    mean,
    std: Math.sqrt(variance),
  };
}

function rememberStepTime(now) {
  motion.stepTimes.push(now);
  if (motion.stepTimes.length > 6) motion.stepTimes.shift();

  if (now - motion.lastStatusAt < 1600 || motion.stepTimes.length < 2) return;

  const intervals = [];
  for (let i = 1; i < motion.stepTimes.length; i += 1) {
    intervals.push(motion.stepTimes[i] - motion.stepTimes[i - 1]);
  }
  const avg = intervals.reduce((sum, value) => sum + value, 0) / intervals.length;
  const cadence = Math.round(60000 / avg);
  motion.lastStatusAt = now;
  sensorStatus.textContent = `Sensor preciso ativo: ritmo aproximado de ${cadence} passos/min.`;
}

function renderScene(progress) {
  sceneCard.className = "scene-card";
  const scene = currentLevel().scene;
  if (scene !== "forest") sceneCard.classList.add(scene);

  avatar.style.setProperty("--walk", `${progress}%`);
  avatar.className = "avatar";
  const skin = skins.find((item) => item.id === state.activeSkin) || skins[0];
  avatar.style.setProperty("--avatar-shirt", skin.bodyColor);
  avatar.style.setProperty("--avatar-skin", skin.skinColor);
}

function startGameView() {
  splash.classList.add("hidden");
  document.body.classList.remove("menu-open");
  showToast("Jogo iniciado. Bora caminhar!");
  enableSensor();
}

function exitGameView() {
  exitMessage.textContent = "Pode fechar a aba quando quiser. Seu progresso fica salvo.";
  showToast("Progresso salvo.");
  window.close();
}

async function createOnlineRoom() {
  createRoomButton.disabled = true;
  splashCreateRoomButton.disabled = true;
  onlineStatus.textContent = "Criando sala privada...";
  splashOnlineStatus.textContent = "Criando sala privada...";

  try {
    const playerName = getPlayerName();
    const data = await apiRequest("/api/room/create", {
      method: "POST",
      body: JSON.stringify({ name: playerName, payload: getOnlinePayload() }),
    });

    connectOnlineRoom(data.roomCode, data.playerId, playerName, data.players);
    showToast(`Sala criada: ${data.roomCode}`);
    startGameView();
  } catch (error) {
    onlineStatus.textContent = error.message;
    splashOnlineStatus.textContent = error.message;
  } finally {
    createRoomButton.disabled = false;
    splashCreateRoomButton.disabled = false;
  }
}

async function joinOnlineRoom() {
  joinRoomButton.disabled = true;
  splashJoinRoomButton.disabled = true;
  onlineStatus.textContent = "Entrando na sala...";
  splashOnlineStatus.textContent = "Entrando na sala...";

  try {
    const playerName = getPlayerName();
    const code = (roomCodeInput.value.trim() || splashRoomCodeInput.value.trim()).toUpperCase();
    const data = await apiRequest("/api/room/join", {
      method: "POST",
      body: JSON.stringify({ roomCode: code, name: playerName, payload: getOnlinePayload() }),
    });

    connectOnlineRoom(data.roomCode, data.playerId, playerName, data.players);
    showToast(`Entrou na sala ${data.roomCode}`);
    startGameView();
  } catch (error) {
    onlineStatus.textContent = error.message;
    splashOnlineStatus.textContent = error.message;
  } finally {
    joinRoomButton.disabled = false;
    splashJoinRoomButton.disabled = false;
  }
}

function connectOnlineRoom(roomCode, playerId, playerName, players = []) {
  online = {
    roomCode,
    playerId,
    playerName,
    connected: true,
    players,
  };
  playerNameInput.value = playerName;
  splashPlayerNameInput.value = playerName;
  roomCodeInput.value = roomCode;
  splashRoomCodeInput.value = roomCode;
  saveOnlineState();
  startOnlineSync();
  renderOnline();
  syncOnline(true);
}

async function leaveOnlineRoom() {
  const previous = { ...online };
  online = { roomCode: "", playerId: "", playerName: previous.playerName, connected: false, players: [] };
  clearInterval(onlineSyncTimer);
  localStorage.removeItem(ONLINE_KEY);
  renderOnline();
  showToast("Voce saiu da sala.");

  if (previous.roomCode && previous.playerId) {
    try {
      await apiRequest("/api/room/leave", {
        method: "POST",
        body: JSON.stringify({ roomCode: previous.roomCode, playerId: previous.playerId }),
      });
    } catch {
      // The local room may already be gone if the server was restarted.
    }
  }
}

function startOnlineSync() {
  clearInterval(onlineSyncTimer);
  onlineSyncTimer = setInterval(() => syncOnline(false), 1600);
}

async function syncOnline(force = false) {
  if (!online.connected || !online.roomCode || !online.playerId || onlineSyncBusy) return;
  onlineSyncBusy = true;

  try {
    const data = await apiRequest("/api/room/update", {
      method: "POST",
      body: JSON.stringify({
        roomCode: online.roomCode,
        playerId: online.playerId,
        payload: getOnlinePayload(),
      }),
    });

    online.players = data.players || [];
    online.connected = true;
    renderOnline();
  } catch (error) {
    onlineStatus.textContent = force
      ? error.message
      : "Reconectando sala online...";
  } finally {
    onlineSyncBusy = false;
  }
}

async function restoreOnlineRoom() {
  if (!online.roomCode || !online.playerId) {
    renderOnline();
    return;
  }

  playerNameInput.value = online.playerName || "";
  splashPlayerNameInput.value = online.playerName || "";
  roomCodeInput.value = online.roomCode || "";
  splashRoomCodeInput.value = online.roomCode || "";

  try {
    const data = await apiRequest("/api/room/update", {
      method: "POST",
      body: JSON.stringify({
        roomCode: online.roomCode,
        playerId: online.playerId,
        payload: getOnlinePayload(),
      }),
    });

    online.connected = true;
    online.players = data.players || [];
    startOnlineSync();
  } catch {
    online.connected = false;
    online.players = [];
    localStorage.removeItem(ONLINE_KEY);
  }

  renderOnline();
}

function renderOnline() {
  const connected = online.connected && online.roomCode;
  onlineBadge.textContent = connected ? "Conectado" : "Privado";
  roomCard.classList.toggle("active", Boolean(connected));
  roomCodeEl.textContent = connected ? online.roomCode : "----";
  splashRoomCodeEl.textContent = connected ? online.roomCode : "----";

  if (!connected) {
    onlineBoard.innerHTML = "";
    onlineStatus.textContent = "Crie uma sala e envie o codigo para seu amigo.";
    splashOnlineStatus.textContent = "Crie uma sala ou entre com o codigo do seu amigo.";
    return;
  }

  const sortedPlayers = [...online.players].sort((a, b) => b.totalSteps - a.totalSteps);
  onlineBoard.innerHTML = "";

  sortedPlayers.forEach((player) => {
    const card = document.createElement("div");
    card.className = `player-card ${player.id === online.playerId ? "me" : ""}`;
    const stale = Date.now() - player.updatedAt > 6000;
    card.innerHTML = `
      <strong>${player.name}${player.id === online.playerId ? " (voce)" : ""}</strong>
      <span>${player.totalSteps} passos</span>
      <span>${player.score} pontos</span>
      <span>${player.levelName}${stale ? " - offline?" : ""}</span>
    `;
    onlineBoard.appendChild(card);
  });

  onlineStatus.textContent =
    sortedPlayers.length < 2
      ? `Sala ${online.roomCode} pronta. Envie esse codigo para seu amigo.`
      : "Partida privada ativa para 2 jogadores.";
  splashOnlineStatus.textContent =
    sortedPlayers.length < 2
      ? `Sala ${online.roomCode} criada. Envie esse codigo para seu amigo.`
      : "Partida privada ativa para 2 jogadores.";
}

function renderSkins() {
  skinList.innerHTML = "";
  skins.forEach((skin) => {
    const owned = state.ownedSkins.includes(skin.id);
    const active = state.activeSkin === skin.id;
    const button = document.createElement("button");
    button.className = `skin ${active ? "active" : ""} ${owned ? "owned" : "locked"}`;
    button.type = "button";
    button.innerHTML = `
      <span class="skin-preview" aria-hidden="true">
        <span class="skin-swatch" style="background:${skin.skinColor}"></span>
        <span class="skin-swatch" style="background:${skin.bodyColor}"></span>
      </span>
      <span>
        <strong>${skin.name}</strong>
        <small>${active ? "Equipado" : owned ? "Equipar" : `Comprar - ${skin.cost} moedas`}</small>
      </span>
    `;
    button.addEventListener("click", () => buyOrEquipSkin(skin.id));
    skinList.appendChild(button);
  });
}

function renderMissions() {
  missionsEl.innerHTML = "";
  missions.forEach((mission) => {
    const done = state.claimedMissions.includes(mission.id);
    const task = document.createElement("div");
    task.className = `task ${done ? "done" : ""}`;
    task.innerHTML = `<strong>${mission.name}</strong><span>${Math.min(state.totalSteps, mission.target)}/${mission.target} passos - ${mission.reward} moedas</span>`;
    missionsEl.appendChild(task);
  });
}

function renderBadges() {
  badgesEl.innerHTML = "";
  badges.forEach((badge) => {
    const unlocked = state.unlockedBadges.includes(badge.id);
    const item = document.createElement("div");
    item.className = `badge ${unlocked ? "unlocked" : ""}`;
    item.innerHTML = `<strong>${unlocked ? "[OK]" : "[--]"} ${badge.name}</strong><span>${badge.text}</span>`;
    badgesEl.appendChild(item);
  });
  badgeCount.textContent = `${state.unlockedBadges.length}/${badges.length}`;
}

function renderRanking() {
  rankingEl.innerHTML = "";
  const entries = state.ranking.length
    ? state.ranking
    : [{ levelName: "Nenhuma fase completa ainda", steps: 0, score: 0, date: "Hoje" }];

  entries.forEach((entry) => {
    const item = document.createElement("li");
    item.textContent = `${entry.levelName} - ${entry.score} pts - ${entry.date}`;
    rankingEl.appendChild(item);
  });
}

function render() {
  const level = currentLevel();
  const progress = Math.min(100, Math.round((state.levelSteps / level.steps) * 100));

  coinsEl.textContent = state.coins;
  levelNameEl.textContent = level.name;
  levelStepText.textContent = `${state.levelSteps}/${level.steps}`;
  progressFill.style.width = `${progress}%`;
  stepsEl.textContent = state.totalSteps;
  scoreEl.textContent = state.score;
  caloriesEl.textContent = Math.round(state.totalSteps * CALORIES_PER_STEP);
  streakEl.textContent = `${state.activeHours}h`;
  avatarLevel.textContent = `Nivel ${Math.floor(state.totalSteps / 50) + 1}`;

  renderScene(progress);
  renderSkins();
  renderMissions();
  renderBadges();
  renderRanking();
  renderOnline();
}

sensorButton.addEventListener("click", enableSensor);
stepButton.addEventListener("click", () => addStep(1, "manual"));
undoStepButton.addEventListener("click", removeStep);
playButton.addEventListener("click", startGameView);
exitButton.addEventListener("click", exitGameView);
createRoomButton.addEventListener("click", createOnlineRoom);
joinRoomButton.addEventListener("click", joinOnlineRoom);
leaveRoomButton.addEventListener("click", leaveOnlineRoom);
roomCodeInput.addEventListener("input", () => {
  roomCodeInput.value = roomCodeInput.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  splashRoomCodeInput.value = roomCodeInput.value;
});
splashCreateRoomButton.addEventListener("click", createOnlineRoom);
splashJoinRoomButton.addEventListener("click", joinOnlineRoom);
splashPlayerNameInput.addEventListener("input", () => {
  playerNameInput.value = splashPlayerNameInput.value;
});
playerNameInput.addEventListener("input", () => {
  splashPlayerNameInput.value = playerNameInput.value;
});
splashRoomCodeInput.addEventListener("input", () => {
  splashRoomCodeInput.value = splashRoomCodeInput.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  roomCodeInput.value = splashRoomCodeInput.value;
});

checkBadges();
render();
restoreOnlineRoom();

if (!window.isSecureContext) {
  sensorStatus.textContent =
    "Sensor pode ser bloqueado em HTTP. Os botoes funcionam agora; para passos reais, use HTTPS.";
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {
      // The game still works if PWA registration is unavailable.
    });
  });
}
