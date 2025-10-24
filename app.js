// Application state
const appState = {
    language: null,
    childhoodStories: [],
    targetTexts: []
};

// Data loaded from texts.json
let textsData = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadTextsData();
});

async function loadTextsData() {
    try {
        const response = await fetch('texts.json');
        textsData = await response.json();
        setupEventListeners();
    } catch (error) {
        console.error('Error loading texts data:', error);
        alert('Failed to load texts data. Please refresh the page.');
    }
}

function setupEventListeners() {
    // Language selection
    const languageCards = document.querySelectorAll('#step1 .option-card');
    languageCards.forEach(card => {
        card.addEventListener('click', function() {
            selectOption(languageCards, card);
            appState.language = card.dataset.language;
            loadChildhoodStories();
            setTimeout(() => goToStep(2), 500);
        });
    });
}

function selectOption(cards, selectedCard) {
    cards.forEach(card => card.classList.remove('selected'));
    selectedCard.classList.add('selected');
}

function selectMultipleOption(card, itemId, stateArray) {
    if (card.classList.contains('selected')) {
        card.classList.remove('selected');
        const index = stateArray.indexOf(itemId);
        if (index > -1) {
            stateArray.splice(index, 1);
        }
    } else {
        card.classList.add('selected');
        stateArray.push(itemId);
    }
}

function loadChildhoodStories() {
    const grid = document.getElementById('childhoodStoriesGrid');
    grid.innerHTML = '';
    
    textsData.childhoodStories.forEach(story => {
        const card = document.createElement('button');
        card.className = 'option-card multi-select';
        card.innerHTML = `
            <h3>${story.title}</h3>
            <p class="author">${story.author}</p>
            <p>${story.description}</p>
        `;
        card.addEventListener('click', function() {
            selectMultipleOption(card, story.id, appState.childhoodStories);
        });
        grid.appendChild(card);
    });
}

function proceedToTargetTexts() {
    if (appState.childhoodStories.length === 0) {
        alert('Please select at least one childhood story.');
        return;
    }
    
    loadTargetTexts();
    goToStep(3);
}

function loadTargetTexts() {
    const grid = document.getElementById('targetTextsGrid');
    const languageNameSpan = document.getElementById('selectedLanguageName');
    
    const languageNames = {
        'spanish': 'Spanish',
        'french': 'French',
        'german': 'German',
        'italian': 'Italian',
        'portuguese': 'Portuguese',
        'japanese': 'Japanese'
    };
    
    languageNameSpan.textContent = languageNames[appState.language];
    
    grid.innerHTML = '';
    
    const targetTexts = textsData.targetTexts[appState.language] || [];
    targetTexts.forEach(text => {
        const card = document.createElement('button');
        card.className = 'option-card multi-select';
        card.innerHTML = `
            <h3>${text.title}</h3>
            <p class="author">${text.author}</p>
            <p class="level-badge">${text.level}</p>
            <p>${text.description}</p>
        `;
        card.addEventListener('click', function() {
            selectMultipleOption(card, text.id, appState.targetTexts);
        });
        grid.appendChild(card);
    });
}

function goToStep(stepNumber) {
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => step.classList.remove('active'));
    document.getElementById(`step${stepNumber}`).classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generateLearningPath() {
    if (appState.targetTexts.length === 0) {
        alert('Please select at least one target text.');
        return;
    }
    
    // Generate the learning path
    const learningPath = createLearningPath();
    displayLearningPath(learningPath);
    goToStep(4);
}

function createLearningPath() {
    const languageNames = {
        'spanish': 'Spanish',
        'french': 'French',
        'german': 'German',
        'italian': 'Italian',
        'portuguese': 'Portuguese',
        'japanese': 'Japanese'
    };

    // Get selected stories and texts
    const selectedStories = textsData.childhoodStories.filter(s => 
        appState.childhoodStories.includes(s.id)
    );
    
    const selectedTexts = textsData.targetTexts[appState.language].filter(t => 
        appState.targetTexts.includes(t.id)
    );

    // Determine dominant style from childhood stories
    const styleCounts = {};
    selectedStories.forEach(story => {
        styleCounts[story.style] = (styleCounts[story.style] || 0) + 1;
    });
    const dominantStyle = Object.keys(styleCounts).reduce((a, b) => 
        styleCounts[a] > styleCounts[b] ? a : b
    );

    const styleDescriptions = {
        'whimsical': 'playful and imaginative storytelling',
        'educational': 'structured and informative learning',
        'classic-tale': 'timeless and philosophical storytelling',
        'adventure': 'action-oriented and exploratory narratives'
    };

    return {
        language: languageNames[appState.language],
        languageCode: appState.language,
        childhoodStories: selectedStories,
        targetTexts: selectedTexts,
        styleApproach: styleDescriptions[dominantStyle] || 'varied storytelling approaches',
        activities: generateActivities(selectedStories, selectedTexts, appState.language),
        resources: generateResources(appState.language, dominantStyle)
    };
}

function generateActivities(stories, texts, language) {
    const activities = [];
    
    // Foundation activities based on childhood stories
    activities.push({
        name: 'Foundation: Build Your Language Base',
        description: `Connect with ${language} through the lens of stories you loved`,
        tasks: [
            `Learn basic ${language} pronunciation and phonetics`,
            'Master essential everyday expressions and greetings',
            `Study 200-300 high-frequency words commonly used in children's literature`,
            'Practice basic sentence structures through simple story excerpts',
            `Read ${stories.map(s => s.title).slice(0, 2).join(' and ')} in simplified ${language} versions`
        ]
    });

    // Building activities based on target texts
    const textLevels = texts.map(t => t.level);
    const hasAdvanced = textLevels.includes('advanced');
    const hasIntermediate = textLevels.includes('intermediate');
    
    activities.push({
        name: 'Building: Develop Reading Skills',
        description: 'Expand vocabulary and comprehension',
        tasks: [
            `Expand vocabulary to ${hasAdvanced ? '1000-1500' : '500-800'} words`,
            'Study grammar patterns and verb conjugations',
            'Read graded readers matched to your childhood story preferences',
            'Practice with audio recordings to improve listening comprehension',
            'Start analyzing sentence structures in your target texts'
        ]
    });

    // Bridge activities connecting to target texts
    activities.push({
        name: 'Bridge: Connect to Your Goals',
        description: 'Prepare for your selected texts',
        tasks: texts.map(text => 
            `Study vocabulary and context specific to "${text.title}" by ${text.author}`
        ).concat([
            'Read summaries and analyses in the target language',
            'Practice with similar texts in the same genre or time period',
            'Focus on cultural and historical context'
        ])
    });

    // Mastery activities
    activities.push({
        name: 'Mastery: Read Your Chosen Texts',
        description: 'Achieve your reading goals',
        tasks: texts.map(text => 
            `Read "${text.title}" with support materials and annotations`
        ).concat([
            'Keep a vocabulary journal for challenging words',
            'Join discussion groups or forums about the texts',
            'Explore related works by the same authors',
            'Celebrate your achievement!'
        ])
    });

    return activities;
}

function generateResources(language, style) {
    const baseResources = [
        `${language} children's literature collections`,
        'Language learning apps (Duolingo, Babbel, Memrise, or Busuu)',
        `Graded readers in ${language}`,
        'Online dictionaries and translation tools (WordReference, Reverso)',
        `Audio recordings and podcasts in ${language}`,
        'Language exchange partners through Tandem or HelloTalk',
        'Flashcard apps (Anki or Quizlet) for vocabulary building'
    ];

    // Add style-specific resources
    const styleResources = {
        'whimsical': ['Illustrated storybooks with rich descriptions', 'Animated shorts in target language'],
        'educational': ['Educational videos and documentaries', 'Non-fiction texts on topics of interest'],
        'classic-tale': ['Literary analysis guides', 'Classic literature reading groups'],
        'adventure': ['Graphic novels and comics', 'Travel narratives and adventure blogs']
    };

    return baseResources.concat(styleResources[style] || []);
}

function displayLearningPath(path) {
    const resultsDiv = document.getElementById('learningPathResults');
    
    let html = `
        <div class="summary-box">
            <h3>📖 Your Personalized Learning Journey</h3>
            <p><strong>Target Language:</strong> ${path.language}</p>
            <p><strong>Childhood Stories:</strong> ${path.childhoodStories.map(s => s.title).join(', ')}</p>
            <p><strong>Target Texts:</strong></p>
            <ul class="target-texts-list">
                ${path.targetTexts.map(t => `<li>"${t.title}" by ${t.author} (${t.level})</li>`).join('')}
            </ul>
            <p><strong>Learning Approach:</strong> ${path.styleApproach}</p>
        </div>
    `;

    // Add activity phases
    path.activities.forEach(activity => {
        html += `
            <div class="path-section">
                <h3>${activity.name}</h3>
                <p><em>${activity.description}</em></p>
                <ul>
                    ${activity.tasks.map(task => `<li>✓ ${task}</li>`).join('')}
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
    appState.language = null;
    appState.childhoodStories = [];
    appState.targetTexts = [];

    // Clear selections
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Go back to step 1
    goToStep(1);
}
