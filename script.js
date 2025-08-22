document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Choices.js for the searchable dropdown ---
    const symptomsSelect = document.getElementById('symptoms');
    const choices = new Choices(symptomsSelect, {
        removeItemButton: true,
        placeholder: true,
        placeholderValue: 'Type to search for symptoms...',
        searchPlaceholderValue: 'Type here...',
        allowHTML: true
    });



document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', `50%`);
            card.style.setProperty('--mouse-y', `50%`);
        });
    });
});


    // --- Get references to other DOM elements ---
    const form = document.getElementById('symptom-form');
    const predictBtn = document.getElementById('predict-btn');
    const btnText = document.querySelector('.btn-text');
    const spinner = document.querySelector('.spinner');
    const resultContainer = document.getElementById('result-container');
    
    // --- Listen for the form's submit event ---
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default page reload

        // --- UI Feedback: Show Loading State ---
        btnText.textContent = 'Analyzing...';
        spinner.classList.remove('hidden');
        predictBtn.disabled = true;
        resultContainer.classList.add('hidden');

        // --- Fetch API to send data to the Flask backend ---
        fetch('/predict', {
            method: 'POST',
            body: new FormData(form)
        })
        .then(response => response.json())
        .then(data => {
            // Update the result container with the prediction
            displayResults(data);
        })
        .catch(error => {
            // Handle any network or server errors
            console.error('Error:', error);
            const errorData = {
                error: 'An unexpected error occurred. Please check the console and try again.'
            };
            displayResults(errorData);
        })
        .finally(() => {
            // --- UI Feedback: Reset Button State ---
            btnText.textContent = 'Analyze Symptoms';
            spinner.classList.add('hidden');
            predictBtn.disabled = false;
        });
    });

    // --- Function to dynamically create and show the result card ---
    function displayResults(data) {
        let content = '';
        if (data.error) {
            content = `
                <div class="result-card error">
                    <div class="result-header">
                        <i class="ph ph-x-circle"></i>
                        <span>Analysis Failed</span>
                    </div>
                    <div class="result-body">
                        <h2 id="predicted-disease">Error</h2>
                        <p id="suggestion">${data.error}</p>
                    </div>
                </div>`;
        } else {
            content = `
                <div class="result-card">
                    <div class="result-header">
                        <i class="ph ph-first-aid-kit"></i>
                        <span>AI Analysis Complete</span>
                    </div>
                    <div class="result-body">
                        <h3 class="result-title">Potential Condition</h3>
                        <h2 id="predicted-disease">${data.prediction}</h2>
                        <p class="suggestion-title">Recommended Action</p>
                        <p id="suggestion">${data.suggestion}</p>
                    </div>
                </div>
                <p class="disclaimer">
                    <i class="ph ph-warning-circle"></i>
                    This is not a medical diagnosis. Always consult a healthcare professional.
                </p>`;
        }
        resultContainer.innerHTML = content;
        resultContainer.classList.remove('hidden');
    }
});

