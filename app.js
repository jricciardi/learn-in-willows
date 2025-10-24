// Application state
const appState = {
    bookStyle: null,
    language: null,
    targetText: {
        title: '',
        sample: ''
    }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    // Book style selection
    const styleCards = document.querySelectorAll('#step1 .option-card');
    styleCards.forEach(card => {
        card.addEventListener('click', function() {
            selectOption(styleCards, card);
            appState.bookStyle = card.dataset.style;
            setTimeout(() => goToStep(2), 500);
        });
    });

    // Language selection
    const languageCards = document.querySelectorAll('#step2 .option-card');
    languageCards.forEach(card => {
        card.addEventListener('click', function() {
            selectOption(languageCards, card);
            appState.language = card.dataset.language;
            setTimeout(() => goToStep(3), 500);
        });
    });
}

function selectOption(cards, selectedCard) {
    cards.forEach(card => card.classList.remove('selected'));
    selectedCard.classList.add('selected');
}

function goToStep(stepNumber) {
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => step.classList.remove('active'));
    document.getElementById(`step${stepNumber}`).classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generateLearningPath() {
    // Get target text input
    appState.targetText.title = document.getElementById('targetTextTitle').value.trim();
    appState.targetText.sample = document.getElementById('targetTextSample').value.trim();

    if (!appState.targetText.title) {
        alert('Please enter a title for your target text.');
        return;
    }

    // Generate the learning path
    const learningPath = createLearningPath();
    displayLearningPath(learningPath);
    goToStep(4);
}

function createLearningPath() {
    const bookStyleDescriptions = {
        'whimsical': {
            name: 'Whimsical',
            approach: 'playful and imaginative storytelling',
            focus: 'creative expressions, descriptive language, and narrative flow'
        },
        'educational': {
            name: 'Educational',
            approach: 'structured and informative learning',
            focus: 'clear explanations, technical vocabulary, and logical progression'
        },
        'classic-tale': {
            name: 'Classic Tale',
            approach: 'timeless and philosophical storytelling',
            focus: 'elegant prose, moral lessons, and universal themes'
        },
        'adventure': {
            name: 'Adventure',
            approach: 'action-oriented and exploratory narratives',
            focus: 'vivid descriptions, movement verbs, and exciting sequences'
        }
    };

    const languageInfo = {
        'spanish': { name: 'Spanish', level: 'A1-B2' },
        'french': { name: 'French', level: 'A1-B2' },
        'german': { name: 'German', level: 'A1-B2' },
        'italian': { name: 'Italian', level: 'A1-B2' },
        'portuguese': { name: 'Portuguese', level: 'A1-B2' },
        'japanese': { name: 'Japanese', level: 'N5-N3' }
    };

    const style = bookStyleDescriptions[appState.bookStyle];
    const lang = languageInfo[appState.language];

    // Analyze the target text (simplified)
    const textComplexity = analyzeTextComplexity(appState.targetText.sample);

    return {
        style: style,
        language: lang,
        targetText: appState.targetText.title,
        complexity: textComplexity,
        phases: generatePhases(style, lang, textComplexity),
        estimatedTime: calculateEstimatedTime(textComplexity),
        resources: generateResources(appState.bookStyle, appState.language)
    };
}

function analyzeTextComplexity(sample) {
    if (!sample) {
        return 'intermediate';
    }
    
    const wordCount = sample.split(/\s+/).length;
    const avgWordLength = sample.replace(/\s/g, '').length / Math.max(wordCount, 1);
    
    if (avgWordLength < 5) {
        return 'beginner';
    } else if (avgWordLength < 7) {
        return 'intermediate';
    } else {
        return 'advanced';
    }
}

function generatePhases(style, lang, complexity) {
    const phases = [
        {
            name: 'Foundation Phase (Weeks 1-4)',
            description: `Build your ${lang.name} foundation with ${style.approach}`,
            activities: [
                `Learn basic ${lang.name} phonetics and pronunciation`,
                'Master essential greetings and common expressions',
                'Study 200 high-frequency words related to ' + style.focus,
                'Practice simple sentence structures',
                'Read adapted children\'s stories in ' + lang.name
            ]
        },
        {
            name: 'Building Phase (Weeks 5-12)',
            description: `Develop comprehension skills tailored to ${style.name.toLowerCase()} narratives`,
            activities: [
                'Expand vocabulary to 500-800 words',
                'Study grammar patterns found in your target text',
                'Practice reading short passages in the ' + style.name.toLowerCase() + ' style',
                'Learn common idioms and expressions',
                'Start analyzing sentence structures from your target text'
            ]
        },
        {
            name: 'Bridge Phase (Weeks 13-20)',
            description: 'Connect your skills to your target text',
            activities: [
                'Identify and study unique vocabulary in your target text',
                'Break down complex sentences from your text',
                'Practice with similar texts in the same style',
                'Focus on cultural context and literary devices',
                'Read chapter summaries of your target text in ' + lang.name
            ]
        },
        {
            name: 'Mastery Phase (Weeks 21-24)',
            description: 'Read and comprehend your chosen text',
            activities: [
                'Begin reading your target text with support materials',
                'Create vocabulary notes for challenging passages',
                'Discuss themes and interpretations',
                'Practice extensive reading in the target language',
                'Celebrate your achievement!'
            ]
        }
    ];

    // Adjust based on complexity
    if (complexity === 'beginner') {
        phases[0].name = 'Foundation Phase (Weeks 1-3)';
        phases[3].name = 'Mastery Phase (Weeks 16-20)';
    } else if (complexity === 'advanced') {
        phases[0].name = 'Foundation Phase (Weeks 1-6)';
        phases[3].name = 'Mastery Phase (Weeks 28-36)';
    }

    return phases;
}

function calculateEstimatedTime(complexity) {
    const timeframes = {
        'beginner': '20-24 weeks',
        'intermediate': '24-28 weeks',
        'advanced': '32-40 weeks'
    };
    return timeframes[complexity];
}

function generateResources(bookStyle, language) {
    const resources = [
        `${language.charAt(0).toUpperCase() + language.slice(1)} children's literature collections`,
        'Language learning apps (Duolingo, Babbel, or Memrise)',
        `Graded readers in ${language}`,
        'Online dictionaries and translation tools',
        `Audio recordings of ${language} children's stories`,
        'Language exchange partners or tutors',
        'Flashcard apps (Anki or Quizlet) for vocabulary'
    ];

    // Add style-specific resources
    if (bookStyle === 'whimsical') {
        resources.push('Illustrated storybooks with rich descriptions');
    } else if (bookStyle === 'educational') {
        resources.push('Educational videos and documentaries in target language');
    } else if (bookStyle === 'classic-tale') {
        resources.push('Literary analysis guides in target language');
    } else if (bookStyle === 'adventure') {
        resources.push('Graphic novels and adventure comics');
    }

    return resources;
}

function displayLearningPath(path) {
    const resultsDiv = document.getElementById('learningPathResults');
    
    let html = `
        <div class="summary-box">
            <h3>📖 Your Learning Journey</h3>
            <p><strong>Book Style:</strong> ${path.style.name} - ${path.style.approach}</p>
            <p><strong>Target Language:</strong> ${path.language.name}</p>
            <p><strong>Target Text:</strong> ${path.targetText}</p>
            <p><strong>Estimated Time:</strong> ${path.estimatedTime}</p>
            <p><strong>Complexity Level:</strong> ${path.complexity.charAt(0).toUpperCase() + path.complexity.slice(1)}</p>
        </div>
    `;

    // Add phases
    path.phases.forEach((phase, index) => {
        html += `
            <div class="path-section">
                <h3>${phase.name}</h3>
                <p><em>${phase.description}</em></p>
                <ul>
                    ${phase.activities.map(activity => `<li>✓ ${activity}</li>`).join('')}
                </ul>
            </div>
        `;
    });

    // Add resources
    html += `
        <div class="path-section">
            <h3>📚 Recommended Resources</h3>
            <ul>
                ${path.resources.map(resource => `<li>• ${resource}</li>`).join('')}
            </ul>
        </div>
    `;

    resultsDiv.innerHTML = html;
}

function startOver() {
    // Reset state
    appState.bookStyle = null;
    appState.language = null;
    appState.targetText = { title: '', sample: '' };

    // Clear selections
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Clear inputs
    document.getElementById('targetTextTitle').value = '';
    document.getElementById('targetTextSample').value = '';

    // Go back to step 1
    goToStep(1);
}
