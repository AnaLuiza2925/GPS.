// --- ÁUDIO E EFEITOS SONOROS (WEB AUDIO API) ---
let audioCtx = null;
let isAudioPlaying = false;
let masterGain = null;
let mysteryInterval = null;

function initAudioAndStart() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.3;
        masterGain.connect(audioCtx.destination);
        
        startDetectiveNoirMusic();
    }
    playClickSound();
    showStory();
}

function playClickSound() {
    if (!audioCtx) return;
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.09);
}

function playSuccessSound() {
    if (!audioCtx) return;
    let now = audioCtx.currentTime;
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.1);
    osc.frequency.setValueAtTime(783.99, now + 0.2);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    osc.stop(now + 0.5);
}

function playErrorSound() {
    if (!audioCtx) return;
    let now = audioCtx.currentTime;
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(130, now + 0.15);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    osc.stop(now + 0.35);
}

function startDetectiveNoirMusic() {
    if (isAudioPlaying) return;
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    isAudioPlaying = true;

    const detectiveNotes = [110.00, 130.81, 164.81, 196.00, 233.08, 196.00, 164.81, 130.81];
    let step = 0;

    mysteryInterval = setInterval(() => {
        if (!isAudioPlaying || !audioCtx) return;

        let osc = audioCtx.createOscillator();
        let noteGain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(detectiveNotes[step], audioCtx.currentTime);

        let filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(320, audioCtx.currentTime);

        noteGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 0.3);
        noteGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.8);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start();
        osc.stop(audioCtx.currentTime + 1.9);

        step = (step + 1) % detectiveNotes.length;
    }, 1500);
}

function toggleAudioMenu() {
    playClickSound();
    const popup = document.getElementById("audioPopup");
    popup.classList.toggle("active");
}

function toggleAudio() {
    const btn = document.getElementById("audioToggleBtn");
    const trigger = document.getElementById("audioTriggerBtn");
    const slider = document.getElementById("volumeSlider");

    if (!audioCtx) {
        initAudioAndStart();
        btn.textContent = "Mutar Som";
        trigger.textContent = "🔊";
        return;
    }

    if (isAudioPlaying) {
        isAudioPlaying = false;
        masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
        btn.textContent = "Ativar Som";
        trigger.textContent = "🔇";
    } else {
        isAudioPlaying = true;
        masterGain.gain.setValueAtTime(slider.value, audioCtx.currentTime);
        btn.textContent = "Mutar Som";
        trigger.textContent = "🔊";
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }
}

function changeVolume(val) {
    if (masterGain && audioCtx && isAudioPlaying) {
        masterGain.gain.setValueAtTime(parseFloat(val), audioCtx.currentTime);
    }
}

window.addEventListener("click", function(e) {
    const container = document.querySelector(".audio-container");
    const popup = document.getElementById("audioPopup");
    if (!container.contains(e.target)) {
        popup.classList.remove("active");
    }
});

// Efeito de Digitação de Texto (Typewriter)
function typeWriter(elementId, text, i = 0) {
    if (i === 0) document.getElementById(elementId).textContent = "";
    if (i < text.length) {
        document.getElementById(elementId).textContent += text.charAt(i);
        setTimeout(() => typeWriter(elementId, text, i + 1), 25);
    }
}

// --- DADOS E LÓGICA DO JOGO ---

const characters = [
    {
        name: "Dra. Velocidade",
        avatar: "https://thumbs.dreamstime.com/b/dark-noir-portrait-female-detective-holding-retro-telephone-receiver-private-detective-spy-investigation-dark-noir-portrait-311350908.jpg",
        subject: "Cinemática",
        description: "Sua missão é investigar as pistas de tempo, movimento e trajetórias deixadas na sala para descobrir para onde o Professor foi levado.",
        puzzle: {
            clue: "💬 'Se o tempo corre sem parar, mas a posição nunca muda... o segredo está guardado no único lugar da escola onde tudo fica parado em repouso absoluto. O relógio parou às 14:30h após um trajeto de 300 metros percorrido a 2 m/s constante.'",
            question: "Analisando o bilhete: Quanto tempo (em minutos) durou a última caminhada do Professor Rafael antes do relógio parar?",
            options: [
                { text: " 2,5 minutos (150 segundos)", correct: true },
                { text: " 5 minutos (300 segundos)", correct: false },
                { text: " 10 minutos (600 segundos)", correct: false }
            ]
        }
    },
    {
        name: "Professor Newton",
        avatar: "https://img.freepik.com/premium-photo/man-wearing-hat-magnifying-glass-looking-into-magnifying-glass_1057087-4633.jpg?w=2000",
        subject: "Leis de Newton",
        description: "Sua missão é analisar as marcas de forças nas portas, armários trancados e objetos arrastados no local do sumiço.",
        puzzle: {
            clue: "💬 'Para abrir o cofre dos mapas, uma força invisível tentou vencer a inércia. Se nenhuma força externa agir sobre um corpo, ele permanecerá em seu estado original para sempre... A resposta está trancada onde o equilíbrio perfeito reside.'",
            question: "Decifre a charada do bilhete: Qual é o próximo local onde a força oculta agiu?",
            options: [
                { text: " No Laboratório de Máquinas (Lei da Ação e Reação)", correct: false },
                { text: "Na Biblioteca, onde rege o Princípio da Inércia (1ª Lei)", correct: true },
                { text: " Perto da árvore (2ª Lei do Movimento)", correct: false }
            ]
        }
    },
    {
        name: "Agente Energia",
        avatar: "https://pbs.twimg.com/media/GjLOsIiX0AAFI40.jpg",
        subject: "Trabalho e Energia",
        description: "Sua missão é rastrear as oscilações de energia e os circuitos de emergência desligados pela escola.",
        puzzle: {
            clue: "💬 'Nada se cria, nada se perde, tudo se transforma. O dispositivo GPS foi ocultado onde a energia potencial gravitacional atinge seu ponto mais alto na estrutura deste prédio...'",
            question: "Onde o Professor Rafael escondeu a próxima pista baseando-se no conceito de Energia Potencial Gravitacional?",
            options: [
                { text: " No ponto mais alto da escola (O Sótão / Caixa d'Água)", correct: true },
                { text: " No subsolo da escola (O Porão)", correct: false },
                { text: " No centro do pátio principal", correct: false }
            ]
        }
    }
];

let selected = -1;

function changeScreen(screenId) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.style.display = "none";
    });
    document.getElementById(screenId).style.display = "flex";
}

function showStory() {
    changeScreen("story");
}

function showCharacters() {
    selected = -1;
    document.querySelectorAll(".character").forEach(card => {
        card.classList.remove("selected");
        card.querySelector(".select-label").textContent = "SELECIONAR";
    });
    document.getElementById("continueButton").disabled = true;
    changeScreen("characters");
}

function selectCharacter(index) {
    playClickSound();
    selected = index;
    document.querySelectorAll(".character").forEach((card, i) => {
        card.classList.toggle("selected", i === index);
        card.querySelector(".select-label").textContent = i === index ? "✓ SELECIONADO" : "SELECIONAR";
    });
    document.getElementById("continueButton").disabled = false;
}

function continueMission() {
    if (selected === -1) return;
    const character = characters[selected];

    document.getElementById("missionAvatar").innerHTML = `<img src="${character.avatar}" alt="${character.name}">`;
    document.getElementById("missionName").textContent = character.name;
    document.getElementById("missionSubject").textContent = "Especialidade: " + character.subject;
    document.getElementById("missionDescription").textContent = character.description;

    changeScreen("mission");
}

function startPuzzle() {
    const character = characters[selected];
    const puzzle = character.puzzle;

    typeWriter("clueText", puzzle.clue);
    document.getElementById("puzzleQuestion").textContent = puzzle.question;

    const optionsContainer = document.getElementById("puzzleOptions");
    optionsContainer.innerHTML = "";
    document.getElementById("puzzleFeedback").textContent = "";

    puzzle.options.forEach(opt => {
        let btn = document.createElement("button");
        btn.className = "option-btn";
        btn.textContent = opt.text;
        btn.onclick = () => checkPuzzleAnswer(opt.correct, btn);
        optionsContainer.appendChild(btn);
    });

    changeScreen("puzzleScreen");
}

function checkPuzzleAnswer(isCorrect, btnElement) {
    const feedback = document.getElementById("puzzleFeedback");
    if (isCorrect) {
        playSuccessSound();
        btnElement.style.background = "#1b5e20";
        btnElement.style.borderColor = "#42ff78";
        feedback.style.color = "#42ff78";
        feedback.textContent = "CORRETO! Acessando sistema de GPS da escola...";
        setTimeout(() => startMapScreen(), 2000);
    } else {
        playErrorSound();
        btnElement.style.background = "#5e1b1b";
        btnElement.style.borderColor = "#ff4242";
        feedback.style.color = "#ff4242";
        feedback.textContent = "RESPOSTA INCORRETA. Tente analisar o enigma novamente!";
    }
}

function startMapScreen() {
    changeScreen("mapScreen");
    document.getElementById("radarStatusText").textContent = "LOCALIZANDO...";
    document.getElementById("gpsPin").style.display = "none";
    document.getElementById("mapSuccessMessage").style.display = "none";

    setTimeout(() => {
        playSuccessSound();
        document.getElementById("radarStatusText").textContent = "SINAL ENCONTRADO!";
        document.getElementById("gpsPin").style.display = "block";
        document.getElementById("mapSuccessMessage").style.display = "block";
    }, 2500);
}

function startPhase3() {
    changeScreen("phase3Screen");
    document.getElementById("phase3Feedback").textContent = "";
    const textoPista3 = '💬 "A gravidade puxa a fruta do pé de jambo a 10 m/s². Se um jambo cai do topo e leva 1 segundo para tocar o chão, a estante secreta de física tem o valor exato da distância percorrida!" (Fórmula: d = 5 * t²)';
    typeWriter("phase3Clue", textoPista3);
}

function openPhase4() {
    changeScreen("phase4Screen");
    document.getElementById("phase4Feedback").textContent = "";
    const textoPista4 = '💬 "SISTEMA BLOQUEADO: Deslocamento Vetorial registrado no chão. O trajeto foi de 3 metros para o Norte e 4 metros para o Leste até a sombra do tronco. Qual o vetor de deslocamento em linha reta?"';
    typeWriter("phase4Clue", textoPista4);
}

function openPhase5() {
    changeScreen("phase5Screen");
    document.getElementById("phase5Feedback").textContent = "";
    const textoPista5 = '💬 "A combinação secreta é formada por: 1) A aceleração da gravidade aproximada (10); 2) O tempo de queda do jambo (1); 3) A força resultante do movimento circular no galho (4)." -> (Senha: 1, 1, 4)';
    typeWriter("phase5Clue", textoPista5);
}

function checkPhase3(isCorrect) {
    const feedback = document.getElementById("phase3Feedback");
    if (isCorrect) {
        playSuccessSound();
        feedback.style.color = "#42ff78";
        feedback.textContent = "EXATO! Estante 5 desbloqueada. Abrindo Fase 4...";
        setTimeout(() => {
            openPhase4();
        }, 1800);
    } else {
        playErrorSound();
        feedback.style.color = "#ff4242";
        feedback.textContent = "ESTANTE ERRADA! Tente calcular a distância (d = 5 * t²).";
    }
}

function checkPhase4(isCorrect) {
    const feedback = document.getElementById("phase4Feedback");
    if (isCorrect) {
        playSuccessSound();
        feedback.style.color = "#42ff78";
        feedback.textContent = "CORRETO! Vetor de 5 metros validado. Abrindo Fase 5...";
        setTimeout(() => {
            openPhase5();
        }, 1800);
    } else {
        playErrorSound();
        feedback.style.color = "#ff4242";
        feedback.textContent = "CÓDIGO INVÁLIDO! Lembre-se do Teorema de Pitágoras (3² + 4² = 5²).";
    }
}

function checkPhase5(isCorrect) {
    const feedback = document.getElementById("phase5Feedback");
    if (isCorrect) {
        playSuccessSound();
        feedback.style.color = "#42ff78";
        feedback.textContent = "CADEADO ABERTO COM SUCESSO!";
        setTimeout(() => {
            changeScreen("phase6Screen");
        }, 1800);
    } else {
        playErrorSound();
        feedback.style.color = "#ff4242";
        feedback.textContent = "COMBINAÇÃO INCORRETA! Verifique os dados das pistas anteriores.";
    }
}

function restartGame() {
    showCharacters();
}