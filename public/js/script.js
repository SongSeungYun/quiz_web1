document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    console.log('Current path:', path); // 디버깅용 로그

    if (path === '/' || path === '/index.html') {
        const startForm = document.getElementById('start-form');
        if (startForm) {
            startForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                console.log('Start form submitted'); // 디버깅용 로그
                const number = document.getElementById('number').value;
                if (number < 1 || number >15) {
                    alert('1부터 15 사이의 숫자를 입력해주세요.');
                    return;
                }
                // 퀴즈 데이터 요청
                try {
                    const response = await fetch(`/api/quizzes?n=${number}`);
                    if (!response.ok) {
                        throw new Error('네트워크 응답이 정상적이지 않습니다.');
                    }
                    const quizzes = await response.json();
                    console.log('Quizzes fetched:', quizzes); // 디버깅용 로그
                    // 세션 스토리지에 퀴즈 저장
                    sessionStorage.setItem('quizzes', JSON.stringify(quizzes));
                    sessionStorage.setItem('current', 0);
                    sessionStorage.setItem('score', 0);
                    sessionStorage.setItem('total', quizzes.length);
                    // 퀴즈 페이지로 이동
                    window.location.href = 'quiz.html';
                } catch (error) {
                    console.error('퀴즈 가져오기 오류:', error);
                    alert('퀴즈를 가져오는 중 오류가 발생했습니다.');
                }
            });
        } else {
            console.error('start-form 요소를 찾을 수 없습니다.');
        }
    }

    else if (path === '/quiz.html') {
        const quizNumberElem = document.getElementById('quiz-number');
        const questionElem = document.getElementById('question');
        const optionsElem = document.getElementById('options');
        const quizForm = document.getElementById('quiz-form');

        // 퀴즈 데이터 로드
        const quizzes = JSON.parse(sessionStorage.getItem('quizzes'));
        let current = parseInt(sessionStorage.getItem('current'), 10);
        let score = parseInt(sessionStorage.getItem('score'), 10);
        const total = parseInt(sessionStorage.getItem('total'), 10);

        console.log('Quizzes:', quizzes);
        console.log('Current:', current);
        console.log('Score:', score);
        console.log('Total:', total);

        if (!quizzes || isNaN(current)) {
            // 데이터가 없으면 시작 페이지로 이동
            console.error('퀴즈 데이터가 없습니다. index.html로 이동합니다.');
            window.location.href = 'index.html';
            return;
        }

        if (current >= quizzes.length) {
            // 모든 퀴즈 완료 시 결과 페이지로 이동
            window.location.href = 'result.html';
            return;
        }

        const currentQuiz = quizzes[current];
        quizNumberElem.textContent = `퀴즈 ${current + 1} / ${quizzes.length}`;
        questionElem.textContent = currentQuiz.question;

        // 옵션 생성
        optionsElem.innerHTML = '';
        currentQuiz.options.forEach((option, index) => {
            const div = document.createElement('div');
            div.innerHTML = `
                <input type="radio" id="option${index}" name="answer" value="${index}" required>
                <label for="option${index}">${option}</label>
            `;
            optionsElem.appendChild(div);
        });

        // 퀴즈 제출 처리
        quizForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(quizForm);
            const userAnswer = parseInt(formData.get('answer'), 10);
            console.log('User answer:', userAnswer);
            console.log('Correct answer:', currentQuiz.answer);

            if (userAnswer === currentQuiz.answer) {
                score += 1;
                sessionStorage.setItem('score', score);
                console.log('점수 증가:', score);
            }
            current += 1;
            sessionStorage.setItem('current', current);
            console.log('퀴즈 진행 상태:', current, score);

            if (current >= quizzes.length) {
                window.location.href = 'result.html';
            } else {
                // 다음 퀴즈로 로드
                window.location.reload();
            }
        });
    }

    else if (path === '/result.html') {
        const scoreElem = document.getElementById('score');
        const restartButton = document.getElementById('restart-button');

        const score = sessionStorage.getItem('score');
        const total = sessionStorage.getItem('total') || '0';

        console.log('Final Score:', score, '/', total);

        if (score === null || total === '0') {
            window.location.href = 'index.html';
            return;
        }

        scoreElem.textContent = `맞춘 개수: ${score} / ${total}`;

        restartButton.addEventListener('click', () => {
            // 세션 스토리지 초기화
            sessionStorage.clear();
            window.location.href = 'index.html';
        });
    }
});