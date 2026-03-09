document.addEventListener('DOMContentLoaded', () => {
    const chestContainer = document.getElementById('chestContainer');
    const chest = document.getElementById('chest');
    const instruction = document.getElementById('instruction');
    const contentBox = document.getElementById('contentBox');
    const textReveal = document.getElementById('textReveal');

    const onePieceText = `El One Piece es el "Proyecto de Libertad" de Joy Boy: un plan para bajar el nivel del mar (que subió 200 metros tras la guerra), destruir la Red Line y organizar la fiesta más grande de la historia donde todas las razas beban sake juntas.

Es la culminación de un sueño que requiere que alguien con el espíritu de un niño (Luffy/Nika) lo active para que el mundo deje de estar "encerrado".`;

    let isOpen = false;
    let isSpeaking = false;

    // We'll format the text slightly for typing effect to emphasize certain words
    const formattedHTML = `El <span class="highlight">One Piece</span> es el <span class="highlight">"Proyecto de Libertad"</span> de Joy Boy: un plan para bajar el nivel del mar (que subió 200 metros tras la guerra), destruir la <span class="highlight">Red Line</span> y organizar la fiesta más grande de la historia donde todas las razas beban sake juntas.<br><br>Es la culminación de un sueño que requiere que alguien con el espíritu de un niño (<span class="highlight">Luffy/Nika</span>) lo active para que el mundo deje de estar "encerrado".`;

    chestContainer.addEventListener('click', () => {
        if (isOpen) return; // Prevent multiple clicks
        
        // visual shake feedback
        chest.classList.add('shake');
        
        setTimeout(() => {
            chest.classList.remove('shake');
            openChest();
        }, 600);
    });

    function openChest() {
        isOpen = true;
        chest.src = 'chest_open.png';
        chestContainer.classList.add('open');
        instruction.style.opacity = '0';
        
        setTimeout(() => {
            instruction.style.display = 'none';
            contentBox.classList.remove('hidden');
            contentBox.classList.add('visible');
            
            // start typing effect
            typeWriterEffect();
            // start speech
            speakText();
        }, 1000);
    }

    function typeWriterEffect() {
        textReveal.innerHTML = '';
        
        let i = 0;
        let isTag = false;
        let text = formattedHTML;
        
        function type() {
            if (i < text.length) {
                let char = text.charAt(i);
                
                // If we encounter a tag, skip ahead to avoid waiting on characters inside HTML tags
                if (char === '<') {
                    isTag = true;
                }
                
                textReveal.innerHTML = text.substring(0, i + 1) + '<span class="cursor">|</span>';
                i++;
                
                if (char === '>') {
                    isTag = false;
                }
                
                // Delay: very fast if we are inside an HTML tag, normal speed otherwise. 
                // Using 0 ms for tags ensures tags get parsed instantly.
                let delay = isTag ? 0 : 35;
                
                if (isTag) {
                    type(); 
                } else {
                    setTimeout(type, delay);
                }
            } else {
                textReveal.innerHTML = text; // remove cursor when done
            }
        }
        
        type();
    }

    function speakText() {
        if (!('speechSynthesis' in window)) {
            console.warn('Speech synthesis not supported in this browser.');
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(onePieceText);
        utterance.lang = 'es-ES'; // Spanish
        utterance.rate = 0.9; // Slightly slower for dramatic effect
        utterance.pitch = 1.0; 
        
        // Try to find a good voice (preferably male, deep, or standard Spanish)
        const voices = window.speechSynthesis.getVoices();
        const esVoices = voices.filter(voice => voice.lang.startsWith('es'));
        if (esVoices.length > 0) {
            // Optional: pick a specific voice if available. Just use the first Spanish one.
            utterance.voice = esVoices[0];
        }

        utterance.onstart = () => { isSpeaking = true; };
        utterance.onend = () => { isSpeaking = false; };
        
        window.speechSynthesis.speak(utterance);
    }

    // Ensure voices are loaded (Chrome edge case)
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }
});
