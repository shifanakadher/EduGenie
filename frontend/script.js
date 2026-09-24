// ==========================================
// EduGenie Frontend JavaScript
// ==========================================

const API_URL = "http://127.0.0.1:8000";


// ==========================================
// Show Feature
// ==========================================

function showFeature(featureName) {

    const panels = document.querySelectorAll(".feature-panel");

    panels.forEach(panel => {
        panel.classList.add("hidden");
    });

    const selectedPanel = document.getElementById(featureName);

    if (selectedPanel) {
        selectedPanel.classList.remove("hidden");
    }

    const buttons = document.querySelectorAll(".feature-btn");

    buttons.forEach(button => {
        button.classList.remove("active");
    });

    buttons.forEach(button => {

        const onclickValue =
            button.getAttribute("onclick");

        if (
            onclickValue &&
            onclickValue.includes(
                `showFeature('${featureName}')`
            )
        ) {
            button.classList.add("active");
        }

    });
}


// ==========================================
// Loading
// ==========================================

function showLoading() {

    document
        .getElementById("loading")
        .classList
        .remove("hidden");
}


function hideLoading() {

    document
        .getElementById("loading")
        .classList
        .add("hidden");
}


// ==========================================
// Result
// ==========================================

function showResult(elementId, text) {

    const resultElement =
        document.getElementById(elementId);

    resultElement.textContent = text;

    resultElement.classList.remove("hidden");
}


// ==========================================
// Error
// ==========================================

function showError(elementId, message) {

    const resultElement =
        document.getElementById(elementId);

    resultElement.textContent =
        "⚠️ Something went wrong.\n\n" + message;

    resultElement.classList.remove("hidden");
}


// ==========================================
// API Request Helper
// ==========================================

async function makeRequest(endpoint, requestBody) {

    const controller =
        new AbortController();

    const timeoutId =
        setTimeout(() => {
            controller.abort();
        }, 30000);

    try {

        const response =
            await fetch(
                `${API_URL}${endpoint}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(requestBody),

                    signal: controller.signal
                }
            );

        if (!response.ok) {

            let errorMessage =
                `Server returned status ${response.status}.`;

            try {

                const errorData =
                    await response.json();

                if (errorData.detail) {
                    errorMessage =
                        errorData.detail;
                }

            } catch {
                // Ignore JSON parsing errors
            }

            if (response.status === 503) {

                errorMessage =
                    "Gemini AI is temporarily busy. " +
                    "Please wait a little and try again.";

            }

            throw new Error(errorMessage);
        }

        return await response.json();

    } catch (error) {

        if (error.name === "AbortError") {

            throw new Error(
                "The request took too long. " +
                "Gemini may be temporarily busy. " +
                "Please try again."
            );
        }

        if (error.name === "TypeError") {

            throw new Error(
                "Could not connect to the EduGenie server. " +
                "Make sure FastAPI is running."
            );
        }

        throw error;

    } finally {

        clearTimeout(timeoutId);

    }
}


// ==========================================
// ASK QUESTION
// ==========================================

async function askQuestion() {

    const input =
        document.getElementById("askInput");

    const question =
        input.value.trim();

    if (!question) {

        alert("Please enter a question.");

        return;
    }

    showLoading();

    try {

        const data =
            await makeRequest(
                "/ask",
                {
                    question: question
                }
            );

        showResult(
            "askResult",
            data.answer
        );

    } catch (error) {

        showError(
            "askResult",
            error.message
        );

    } finally {

        hideLoading();

    }
}


// ==========================================
// EXPLAIN CONCEPT
// ==========================================

async function explainConcept() {

    const input =
        document.getElementById("explainInput");

    const topic =
        input.value.trim();

    if (!topic) {

        alert("Please enter a concept.");

        return;
    }

    showLoading();

    try {

        const data =
            await makeRequest(
                "/explain",
                {
                    topic: topic
                }
            );

        showResult(
            "explainResult",
            data.explanation
        );

    } catch (error) {

        showError(
            "explainResult",
            error.message
        );

    } finally {

        hideLoading();

    }
}


// ==========================================
// GENERATE QUIZ
// ==========================================

async function generateQuiz() {

    const input =
        document.getElementById("quizInput");

    const topic =
        input.value.trim();

    if (!topic) {

        alert("Please enter a quiz topic.");

        return;
    }

    showLoading();

    try {

        const data =
            await makeRequest(
                "/quiz",
                {
                    topic: topic
                }
            );

        showResult(
            "quizResult",
            data.quiz
        );

    } catch (error) {

        showError(
            "quizResult",
            error.message
        );

    } finally {

        hideLoading();

    }
}


// ==========================================
// SUMMARIZE TEXT
// ==========================================

async function summarizeText() {

    const input =
        document.getElementById("summarizeInput");

    const text =
        input.value.trim();

    if (!text) {

        alert(
            "Please enter some text to summarize."
        );

        return;
    }

    showLoading();

    try {

        const data =
            await makeRequest(
                "/summarize",
                {
                    text: text
                }
            );

        showResult(
            "summarizeResult",
            data.summary
        );

    } catch (error) {

        showError(
            "summarizeResult",
            error.message
        );

    } finally {

        hideLoading();

    }
}


// ==========================================
// CREATE LEARNING PATH
// ==========================================

async function createLearningPath() {

    const input =
        document.getElementById(
            "learningPathInput"
        );

    const topic =
        input.value.trim();

    if (!topic) {

        alert(
            "Please enter a learning topic."
        );

        return;
    }

    showLoading();

    try {

        const data =
            await makeRequest(
                "/learning-path",
                {
                    topic: topic
                }
            );

        showResult(
            "learningPathResult",
            data.learning_path
        );

    } catch (error) {

        showError(
            "learningPathResult",
            error.message
        );

    } finally {

        hideLoading();

    }
}


// ==========================================
// LOAD LEARNING HISTORY
// ==========================================

async function loadHistory() {

    const historyResult =
        document.getElementById("historyResult");

    if (!historyResult) {

        console.error(
            "historyResult element was not found."
        );

        return;
    }


    historyResult.innerHTML = `
        <p>Loading your learning history...</p>
    `;


    try {

        const response =
            await fetch(
                `${API_URL}/history`
            );


        if (!response.ok) {

            throw new Error(
                `Server returned status ${response.status}.`
            );

        }


        const data =
            await response.json();


        console.log(
            "History API response:",
            data
        );


        const history =
            data.history;


        // ======================================
        // Check History
        // ======================================

        if (
            !Array.isArray(history) ||
            history.length === 0
        ) {

            historyResult.innerHTML = `

                <div class="history-empty">

                    <h3>
                        📭 No History Yet
                    </h3>

                    <p>
                        Your EduGenie activities will
                        appear here after you use
                        the learning tools.
                    </p>

                </div>

            `;

            return;
        }


        // ======================================
        // Create History Cards
        // ======================================

        let historyHTML = "";


        history.forEach(record => {

            const date =
                record.created_at
                    ? new Date(
                        record.created_at
                    ).toLocaleString()
                    : "Unknown date";


            historyHTML += `

                <div class="history-card">

                    <div class="history-header">

                        <span class="history-feature">

                            ${getFeatureIcon(
                                record.feature
                            )}

                            ${formatFeatureName(
                                record.feature
                            )}

                        </span>


                        <span class="history-date">

                            ${escapeHtml(date)}

                        </span>

                    </div>


                    <div class="history-input">

                        <strong>
                            Input:
                        </strong>

                        <p>
                            ${escapeHtml(
                                record.input_text
                            )}
                        </p>

                    </div>


                    <div class="history-response">

                        <strong>
                            EduGenie Response:
                        </strong>

                        <p>
                            ${escapeHtml(
                                record.response_text
                            )}
                        </p>

                    </div>

                </div>

            `;

        });


        historyResult.innerHTML =
            historyHTML;


    } catch (error) {

        console.error(
            "History error:",
            error
        );


        historyResult.innerHTML = `

            <div class="history-error">

                <h3>
                    ⚠️ Could Not Load History
                </h3>

                <p>
                    ${escapeHtml(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}


// ==========================================
// History Feature Icon
// ==========================================

function getFeatureIcon(feature) {

    const icons = {

        "ask": "💡",

        "explain": "📚",

        "quiz": "📝",

        "summarize": "📄",

        "learning-path": "🛤️"

    };

    return icons[feature] || "📌";
}


// ==========================================
// History Feature Name
// ==========================================

function formatFeatureName(feature) {

    const names = {

        "ask": "Ask Question",

        "explain": "Explain Concept",

        "quiz": "Quiz",

        "summarize": "Summary",

        "learning-path": "Learning Path"

    };

    return names[feature] || feature;
}


// ==========================================
// Escape HTML
// ==========================================

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text ?? "";

    return div.innerHTML;
}