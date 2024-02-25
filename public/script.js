document.addEventListener('DOMContentLoaded', () => {
    const nextQuestionButton = document.getElementById('next-question');
    let currentQuestionIndex = 0;
    let quizData = [];

    // Fetch quiz data from the server
    const fetchQuizData = async () => {
        try {
            const response = await fetch('/api/quiz');
            quizData = await response.json();
            displayQuestion();
        } catch (error) {
            console.error("Failed to fetch quiz data:", error);
        }
    };

    // Display the current question
    const displayQuestion = () => {
        if (currentQuestionIndex < quizData.length) {
            const { ImagePath, CorrectAnswer, ProbabilityDistribution } = quizData[currentQuestionIndex];
            document.getElementById('quiz-image').src = ImagePath;
            // Additional logic for displaying options and handling responses goes here
        } else {
            // Handle end of quiz
            document.getElementById('quiz-container').innerHTML = '<h2>Quiz Completed!</h2>';
        }
    };

    nextQuestionButton.addEventListener('click', () => {
        currentQuestionIndex++;
        displayQuestion();
    });

    fetchQuizData();
});
