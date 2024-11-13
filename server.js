const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();

// 미들웨어 설정
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// 메모리 내 퀴즈 데이터
const quizzes = [
    {
        question: '고조선을 건국한 인물은 누구인가요?',
        options: ['단군왕검', '주몽', '박혁거세', '김수로'],
        answer: 0,
    },
    {
        question: '삼국 중 가장 먼저 통일을 이룩한 나라는?',
        options: ['고구려', '백제', '신라', '가야'],
        answer: 2,
    },
    {
        question: '고려 시대에 몽골의 침입을 막기 위해 만든 방어 시설은?',
        options: ['북한산성', '남한산성', '강화도', '수원화성'],
        answer: 2,
    },
    {
        question: '조선을 건국한 왕은 누구인가요?',
        options: ['이성계', '정도전', '이방원', '이방석'],
        answer: 0,
    },
    {
        question: '임진왜란 당시 조선을 도운 명나라 장수는?',
        options: ['이순신', '권율', '이여송', '곽재우'],
        answer: 2,
    },
    {
        question: '조선 후기 실학을 집대성한 학자는?',
        options: ['정약용', '김정희', '박지원', '홍대용'],
        answer: 0,
    },
    {
        question: '1876년 체결된 조선의 첫 근대적 조약은?',
        options: ['강화도 조약', '남양도 조약', '제물포 조약', '을사조약'],
        answer: 0,
    },
    {
        question: '대한제국 시기 독립협회를 설립한 인물은?',
        options: ['서재필', '안창호', '이승만', '김구'],
        answer: 0,
    },
    {
        question: '1919년 3.1 운동 당시 민족대표 33인 중 한 명이 아닌 사람은?',
        options: ['손병희', '이승만', '김구', '안창호'],
        answer: 2,
    },
    {
        question: '일제강점기 항일 무장투쟁을 이끈 단체는?',
        options: ['독립협회', '신민회', '의열단', '한국광복군'],
        answer: 3,
    },
    {
        question: '대한민국 임시정부의 마지막 주석은 누구였나요?',
        options: ['이승만', '김구', '안창호', '이동휘'],
        answer: 1,
    },
    {
        question: '1945년 광복 이후 남한 단독 정부 수립의 근거가 된 선거는?',
        options: ['4.19 혁명', '5.10 총선거', '5.16 군사정변', '6월 민주항쟁'],
        answer: 1,
    },
    {
        question: '6.25 전쟁 당시 인천상륙작전을 지휘한 연합군 사령관은?',
        options: ['이승만', '맥아더', '김일성', '스탈린'],
        answer: 1,
    },
    {
        question: '1960년 이승만 대통령의 하야를 이끈 민주화 운동은?',
        options: ['4.19 혁명', '5.18 광주민주화운동', '6월 민주항쟁', '부마민주항쟁'],
        answer: 0,
    },
    {
        question: '1987년 대통령 직선제 개헌의 계기가 된 민주화 운동은?',
        options: ['4.19 혁명', '5.18 광주민주화운동', '6월 민주항쟁', '촛불집회'],
        answer: 2,
    },
];

// n개의 랜덤 퀴즈 가져오기
app.get('/api/quizzes', (req, res) => {
    const n = parseInt(req.query.n, 10) || 5; // 기본값 5

    if (n > quizzes.length) {
        return res.status(400).json({ error: `요청한 퀴즈 수(${n})가 전체 퀴즈 수(${quizzes.length})보다 많습니다.` });
    }

    // 퀴즈 리스트에서 랜덤하게 n개 선택
    const shuffled = quizzes.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, n);
    res.json(selected);
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});