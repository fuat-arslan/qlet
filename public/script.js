document.addEventListener('DOMContentLoaded', () => {
    let userId = ''; // Variable to store the user ID
    const userIdInput = document.getElementById('user-id-input'); // Assuming you have an input for the user ID
    const startQuizButton = document.getElementById('start-quiz-button'); // Button to start the quiz
    const quizContainer = document.getElementById('quiz-container'); // The quiz container
    const nextQuestionButton = document.getElementById('next-question');
    
    let currentQuestionIndex = 0;
    let quizData = [];
    const choices = ["MEL", "DNV", "NV", "AK", "BCC", "VASC", "SC", "BKL", "DF"]; // Fixed choices
    let isFirstIteration = true; // Global flag to track iteration
    let selectedButton = null; // Added to track the selected button


    const fab = document.getElementById('fab');
    const abbrPanel = document.getElementById('abbr-panel');
    fab.addEventListener('click', () => {
        if (abbrPanel.style.display === 'none' || !abbrPanel.style.display) {
            abbrPanel.style.display = 'block';
            fab.textContent = '−'; // Change FAB icon to indicate it can close the panel
        } else {
            abbrPanel.style.display = 'none';
            fab.textContent = '+'; // Change FAB icon back to default
        }
    });
    // Hide quiz container initially
    quizContainer.style.display = 'none';

    function preloadImages(imageArray) {
        const images = [];
        for (let i = 0; i < imageArray.length; i++) {
            images[i] = new Image();
            images[i].src = imageArray[i];
        }
    }

    // Shuffle quiz data to randomize question order
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Fetch quiz data from the server
    const fetchQuizData = async () => {
        try {
            const response = await fetch('/api/quiz');
            const data = await response.json();
            shuffleArray(data); // Shuffle questions
            quizData = data;
            // Preload images
            const imagePaths = quizData.map(q => q.ImagePath); // Assuming quizData is your array of question objects
            preloadImages(imagePaths);
            displayQuestion();
        } catch (error) {
            console.error("Failed to fetch quiz data:", error);
        }
    };

   
    // Display the current question and choices
    // Display the current question and choices with fade effect
    const displayQuestion = () => {
        const quizContainer = document.getElementById('quiz-container');
        const optionsContainer = document.getElementById('options');
        const quizImage = document.getElementById('quiz-image');
        const aiAnswerDisplay = document.getElementById('ai-answer-display'); // Container for AI's answer
        const questionTitle = document.getElementById('question-title'); // Get the question title element

        // Define color classes for choices
        const colorClasses = [
            "option-color-1", "option-color-2", "option-color-3",
            "option-color-4", "option-color-5", "option-color-6",
            "option-color-7", "option-color-8", "option-color-9"
        ];

        // Update progress bar and numerical display
        const totalQuestions = 2*quizData.length;
        // if it is first iteration, then questionsAnswered = currentQuestionIndex + 1 else questionsAnswered = currentQuestionIndex + 1 + quizData.length

        const questionsAnswered = currentQuestionIndex + 1 + (isFirstIteration ? 0 : quizData.length);
        const progressPercentage = (questionsAnswered / totalQuestions) * 100;

        const progressBar = document.getElementById('quiz-progress-bar');
        const remainingQuestionsDisplay = document.getElementById('remaining-questions');

        progressBar.style.width = `${progressPercentage}%`; // Update progress bar width
        remainingQuestionsDisplay.textContent = `${questionsAnswered} / ${totalQuestions}`; // Update numerical display

    
        // Fade out current question
        quizContainer.classList.add('fade-out');
        setTimeout(() => {
            if (currentQuestionIndex < quizData.length) {
                const { ImagePath, AIAnswer } = quizData[currentQuestionIndex]; // Assume AIAnswer is part of your data
                
                // Set the question title
                questionTitle.textContent = `Question #${currentQuestionIndex + 1} ${isFirstIteration ? '' : '- with AI'}; What is your diagnosis?`;
                quizImage.onload = () => {
                    quizContainer.classList.remove('fade-out');
                    quizContainer.classList.add('fade-in');
                    setTimeout(() => quizContainer.classList.remove('fade-in'), 100);
                };
                quizImage.src = ImagePath;
                // Clear previous choices and update for the new question
                optionsContainer.innerHTML = "";
                choices.forEach((choice, index) => {
                    const button = document.createElement('button');
                    button.textContent = choice;
    
                    // Assign a color class to each button based on its index
                    button.classList.add(colorClasses[index % colorClasses.length]); // Use modulo for safety
    
                    //button.onclick = () => handleChoiceSelection(choice, currentQuestionIndex, AIAnswer); // Pass AIAnswer if needed
                    button.onclick = () => selectChoice(button, choice);
                    optionsContainer.appendChild(button);
                });
    
                // Display AI's answer during the second iteration
                if (!isFirstIteration) {
                    const aiAnswerIndex = choices.findIndex(choice => choice === AIAnswer);
                    const aiAnswerColorClass = colorClasses[aiAnswerIndex % colorClasses.length];
                    
                    // Reset AI answer display styling to match the choice buttons
                    aiAnswerDisplay.textContent = `AI's answer: ${AIAnswer}`; // Set the text content
                    aiAnswerDisplay.className = 'ai-answer-style'; // Reset to base class
                    aiAnswerDisplay.classList.add(aiAnswerColorClass); // Apply the specific color class for border
                
                    // Style adjustments to make only the AI answer part colored and boxed
                    aiAnswerDisplay.style.backgroundColor = 'transparent'; // Ensure background is transparent
                    aiAnswerDisplay.style.color = 'black'; // Set text color to black or as per your design
                    aiAnswerDisplay.style.borderColor = window.getComputedStyle(document.querySelector('.' + aiAnswerColorClass)).backgroundColor; // Use the color class to set the border color
                
                    // Move the AI's answer display below the "Next Question" button
                    quizImage.insertAdjacentElement('afterend', aiAnswerDisplay);
                    aiAnswerDisplay.style.display = 'block';
                } else {
                    aiAnswerDisplay.style.display = 'none';
                }
                
    
                // Ensure the fade-out class is removed and fade-in class is added for transition effect
                quizContainer.classList.remove('fade-out');
                quizContainer.classList.add('fade-in');
    
                // Remove fade-in class after animation to allow it to be reapplied next time
                setTimeout(() => quizContainer.classList.remove('fade-in'), 100);
            } else if (isFirstIteration) {
                // After the first iteration, shuffle questions again and start the second iteration
                shuffleArray(quizData);
                currentQuestionIndex = 0;
                isFirstIteration = false;
                displayQuestion(); // Start displaying questions for the second iteration
            } else {
                quizContainer.innerHTML = '<h2>Quiz Completed!</h2>';
            }
        }, 100); // This should match the duration of the fade-out animation
    };
    
    const selectChoice = (button, choice) => {
        if (selectedButton) {
            selectedButton.classList.remove('selected'); // Remove selection from previously selected button
        }
        selectedButton = button;
        selectedButton.classList.add('selected'); // Highlight the newly selected button
    };
    
    nextQuestionButton.addEventListener('click', () => {
        if (!selectedButton) {
            alert("Please select an answer.");
            return;
        }

        const selectedChoice = selectedButton.textContent;
        handleChoiceSelection(selectedChoice, currentQuestionIndex);
        submitAnswer(userId, currentQuestionIndex, selectedChoice, !isFirstIteration); // Submit the answer to the server
    });
        

    const handleChoiceSelection = (choice, questionId) => {
        console.log(`Choice selected: ${choice}`);

        if (!isFirstIteration) {
            // In the second iteration, reveal the correct answer after selection
            const correctAnswer = quizData[questionId].CorrectAnswer;
            setTimeout(() => {
                alert(`You chose: ${choice}. The correct answer is: ${correctAnswer}.`);
                moveToNextQuestion();
            }, 500); // Short delay to let the user see the AI's answer before alert
        } else {
            // Move directly to the next question in the first iteration
            moveToNextQuestion();
        }
    };

    const moveToNextQuestion = () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            displayQuestion();
        } else if (isFirstIteration) {
            isFirstIteration = false;
            currentQuestionIndex = 0;
            shuffleArray(quizData);
            displayQuestion();
        } else {
            quizContainer.innerHTML = '<h2>Quiz Completed!</h2>';
        }
    };

    
    
    
    function submitAnswer(userId, questionId, selectedOption, isWithAI) {
        fetch('/submit-answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                userId, 
                questionId, 
                selectedOption, 
                isWithAI // Add the isWithAI information
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    
    // Event listener for the "Start Quiz" button
    startQuizButton.addEventListener('click', () => {
        userId = userIdInput.value.trim(); // Get the user ID from input
        if (userId) {
            // Hide user ID input and show quiz container
            userIdInput.style.display = 'none';
            startQuizButton.style.display = 'none';
            quizContainer.style.display = 'block';
            fetchQuizData(); // Start the quiz
        } else {
            alert('Please enter a User ID.');
        }
    });



    document.getElementById('abbr-button').addEventListener('click', function() {
        var abbrPanel = document.getElementById('abbr-panel');
        if (abbrPanel.style.display === 'none' || abbrPanel.style.display === '') {
            abbrPanel.style.display = 'block';
            this.textContent = 'Hide Abbreviations'; // Change button text to indicate action
        } else {
            abbrPanel.style.display = 'none';
            this.textContent = 'Show Abbreviations'; // Reset button text
        }
    });
});

