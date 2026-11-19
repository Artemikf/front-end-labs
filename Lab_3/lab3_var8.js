"use strict";

const logs = [];
function out(message) {
    console.log(message);
    logs.push(typeof message === "object" ? JSON.stringify(message, null, 2) : String(message));
}

// ============================================================================
// ЗАВДАННЯ 1 (Варіант 8): Масиви, методи роботи з ними та функції
// 10 записів послуг: внутрішній id послуги, назва послуги, ім'я лікаря, що її
// проводить, кількість користувачів за місяць_1, кількість користувачів за
// місяць_2, вартість послуги, тривалість послуги у хв.
// ============================================================================

const services = [
    { id: 101, name: "Первинна консультація терапевта", doctor: "Коваленко О. В.", usersMonth1: 120, usersMonth2: 145, price: 650, durationMin: 30 },
    { id: 102, name: "Консультація клінічного психолога", doctor: "Бондаренко Н. П.", usersMonth1: 95, usersMonth2: 95, price: 900, durationMin: 50 },
    { id: 103, name: "Розшифровка аналізів", doctor: "Мельник І. С.", usersMonth1: 210, usersMonth2: 180, price: 450, durationMin: 20 },
    { id: 104, name: "Консультація педіатра", doctor: "Мельник І. С.", usersMonth1: 150, usersMonth2: 170, price: 650, durationMin: 40 },
    { id: 105, name: "Консультація дієтолога", doctor: "Савченко Д. М.", usersMonth1: 80, usersMonth2: 110, price: 800, durationMin: 45 },
    { id: 106, name: "Консультація кардіолога", doctor: "Коваленко О. В.", usersMonth1: 130, usersMonth2: 130, price: 900, durationMin: 40 },
    { id: 107, name: "Сімейна психотерапія", doctor: "Бондаренко Н. П.", usersMonth1: 60, usersMonth2: 75, price: 1200, durationMin: 60 },
    { id: 108, name: "Повторна консультація терапевта", doctor: "Коваленко О. В.", usersMonth1: 175, usersMonth2: 160, price: 500, durationMin: 20 },
    { id: 109, name: "Консультація невролога", doctor: "Ткаченко В. А.", usersMonth1: 110, usersMonth2: 125, price: 800, durationMin: 35 },
    { id: 110, name: "Експрес-консультація психолога", doctor: "Бондаренко Н. П.", usersMonth1: 88, usersMonth2: 88, price: 500, durationMin: 25 }
];

// 1.1. Впорядкування послуг за вартістю та знаходження середньої тривалості
// послуги у хв, серед тих, що відповідають одній і тій же вартості
function sortByPriceAndAvgDuration(list) {
    const sorted = [...list].sort((a, b) => a.price - b.price);
    const groupedByPrice = {};

    sorted.forEach(item => {
        if (!groupedByPrice[item.price]) {
            groupedByPrice[item.price] = [];
        }
        groupedByPrice[item.price].push(item.durationMin);
    });

    const avgByPrice = {};
    for (const priceKey in groupedByPrice) {
        const durations = groupedByPrice[priceKey];
        const sum = durations.reduce((acc, val) => acc + val, 0);
        avgByPrice[priceKey] = Number((sum / durations.length).toFixed(2));
    }

    return { sorted, avgByPrice };
}

const task1_1 = sortByPriceAndAvgDuration(services);
out("--- Завдання 1.1: Послуги, впорядковані за вартістю ---");
out(task1_1.sorted);
out("--- Завдання 1.1: Середня тривалість (хв) для однакової вартості ---");
out(task1_1.avgByPrice);

// 1.2. Знаходження послуги, яка має максимальну кількість користувачів, що
// прочитали про неї за місяць_1, та вивід її внутрішнього id
function findMaxUsersMonth1ServiceId(list) {
    if (list.length === 0) return null;
    let maxService = list[0];
    for (let i = 1; i < list.length; i++) {
        if (list[i].usersMonth1 > maxService.usersMonth1) {
            maxService = list[i];
        }
    }
    return { id: maxService.id, name: maxService.name, usersMonth1: maxService.usersMonth1 };
}

const task1_2 = findMaxUsersMonth1ServiceId(services);
out("--- Завдання 1.2: Максимум користувачів за місяць_1 та внутрішній id ---");
out(task1_2);

// 1.3. Додавання нової послуги до 10 записів: якщо у ній відсутня хоч якась
// інфо — додаємо в кінець списку; якщо вся інфо є — шукаємо її місце у порядку
// спадання вартості послуг
function hasAllServiceInfo(item) {
    if (!item || typeof item !== "object") return false;
    const requiredFields = ["id", "name", "doctor", "usersMonth1", "usersMonth2", "price", "durationMin"];
    for (const field of requiredFields) {
        const val = item[field];
        if (val === undefined || val === null || String(val).trim() === "") {
            return false;
        }
    }
    return true;
}

function addServiceRecord(list, newService) {
    const result = [...list];
    if (!hasAllServiceInfo(newService)) {
        result.push(newService);
        return result;
    }

    // Спочатку впорядкуємо копію за спаданням вартості та знайдемо індекс вставки
    const sortedDesc = result.sort((a, b) => b.price - a.price);
    let insertIndex = sortedDesc.findIndex(item => newService.price >= item.price);
    if (insertIndex === -1) {
        insertIndex = sortedDesc.length;
    }
    sortedDesc.splice(insertIndex, 0, newService);
    return sortedDesc;
}

const completeNewService = {
    id: 111,
    name: "Консультація ендокринолога",
    doctor: "Кравчук М. П.",
    usersMonth1: 105,
    usersMonth2: 120,
    price: 850,
    durationMin: 35
};

const incompleteNewService = {
    id: 112,
    name: "Онлайн-супровід",
    doctor: "",
    usersMonth1: 40,
    usersMonth2: 50,
    price: 600,
    durationMin: 30
};

const task1_3_complete = addServiceRecord(services, completeNewService);
const task1_3_incomplete = addServiceRecord(services, incompleteNewService);
out("--- Завдання 1.3: Додавання повної послуги (за спаданням вартості) ---");
out(task1_3_complete);
out("--- Завдання 1.3: Додавання неповної послуги (у кінець списку) ---");
out(task1_3_incomplete);

// 1.4. Обчислити оновлену вартість послуги на наступний місяць:
// якщо usersMonth1 < usersMonth2 -> price * 1.15;
// якщо usersMonth1 === usersMonth2 -> price * 1 (не змінюється);
// якщо usersMonth1 > usersMonth2 -> price * 0.95;
// Надати оновлений список нових вартостей послуг: назва послуги, вартість, ім'я
const calculateUpdatedPrices = (list) => list.map(item => {
    let updatedPrice = item.price;
    if (item.usersMonth1 < item.usersMonth2) {
        updatedPrice = Number((item.price * 1.15).toFixed(2));
    } else if (item.usersMonth1 > item.usersMonth2) {
        updatedPrice = Number((item.price * 0.95).toFixed(2));
    }
    return {
        name: item.name,
        price: updatedPrice,
        doctor: item.doctor
    };
});

const task1_4 = calculateUpdatedPrices(services);
out("--- Завдання 1.4: Оновлений список вартостей послуг ---");
out(task1_4);


// ============================================================================
// ЗАВДАННЯ 2 (Варіант 8): Об'єктно-орієнтований JS-код
// 10 облікових записів користувачів: прізвище, ім'я, вік, освіта,
// мета зворотнього зв'язку, дата звернення, час звернення.
// ============================================================================

class UserAppeal {
    constructor(lastName, firstName, age, education, purpose, dateStr, timeStr) {
        this.lastName = lastName;
        this.firstName = firstName;
        this.age = age;
        this.education = education;
        this.purpose = purpose; // "співпраця", "скарга на якість послуги", "пропозиція", "наявність помилки на сайті"
        this.date = dateStr;    // "YYYY-MM-DD"
        this.time = timeStr;    // "HH:MM"
    }

    getMonth() {
        return Number(this.date.split("-")[1]); // 1..12
    }

    getTimeInMinutes() {
        const [hh, mm] = this.time.split(":").map(Number);
        return hh * 60 + mm;
    }

    isWorkingHours() {
        // Робочий час: 09:00 (540 хв) до 17:00 (1020 хв)
        const mins = this.getTimeInMinutes();
        return mins >= 9 * 60 && mins <= 17 * 60;
    }

    getFullName() {
        return `${this.lastName} ${this.firstName}`;
    }
}

class AppealManager {
    constructor(users) {
        this.users = users;
    }

    // 2.1. Виведення переліку користувачів, які звернулись упродовж певного місяця,
    // у деякий заданий момент часу (наприклад, час звернення >= заданого часу)
    getUsersByMonthAndTime(targetMonth, minTimeStr) {
        const [minH, minM] = minTimeStr.split(":").map(Number);
        const minTotalMinutes = minH * 60 + minM;

        return this.users.filter(u => u.getMonth() === targetMonth && u.getTimeInMinutes() >= minTotalMinutes);
    }

    // 2.2. Вивести мінімальний вік користувача, що звернувся, його освіту та ім'я
    getYoungestUserInfo() {
        if (this.users.length === 0) return null;
        let youngest = this.users[0];
        for (const user of this.users) {
            if (user.age < youngest.age) {
                youngest = user;
            }
        }
        return {
            age: youngest.age,
            education: youngest.education,
            firstName: youngest.firstName
        };
    }

    // 2.3. Поділити користувачів за часом звернення на два класи:
    // «робочий час (09:00 до 17:00)» та «неробочий час»
    // та знайти кількість користувачів у кожному з класів та середній вік у кожному з них
    classifyByWorkingHours() {
        const working = [];
        const nonWorking = [];

        this.users.forEach(user => {
            if (user.isWorkingHours()) {
                working.push(user);
            } else {
                nonWorking.push(user);
            }
        });

        const avgAge = (arr) => arr.length === 0
            ? 0
            : Number((arr.reduce((sum, u) => sum + u.age, 0) / arr.length).toFixed(2));

        return {
            workingHours: {
                count: working.length,
                avgAge: avgAge(working)
            },
            nonWorkingHours: {
                count: nonWorking.length,
                avgAge: avgAge(nonWorking)
            }
        };
    }

    // 2.4. Забезпечити сортування користувачів в алфавітному порядку із виведенням
    // мети зворотнього зв'язку
    sortAlphabeticallyWithPurpose() {
        return [...this.users]
            .sort((a, b) => a.getFullName().localeCompare(b.getFullName(), "uk"))
            .map(u => ({
                fullName: u.getFullName(),
                purpose: u.purpose
            }));
    }
}

const userAppeals = [
    new UserAppeal("Шевченко", "Олена", 29, "вища", "пропозиція", "2026-10-05", "10:15"),
    new UserAppeal("Козак", "Ігор", 42, "вища", "скарга на якість послуги", "2026-10-12", "18:30"),
    new UserAppeal("Бондар", "Марія", 19, "неповна", "наявність помилки на сайті", "2026-10-14", "14:20"),
    new UserAppeal("Ткач", "Олександр", 35, "професійна", "співпраця", "2026-09-22", "09:45"),
    new UserAppeal("Кравченко", "Анна", 51, "вища", "пропозиція", "2026-10-19", "16:05"),
    new UserAppeal("Moroz", "Denis", 24, "вища", "наявність помилки на сайті", "2026-11-02", "21:10"),
    new UserAppeal("Литвин", "Софія", 31, "вища", "скарга на якість послуги", "2026-10-25", "11:40"),
    new UserAppeal("Олійник", "Віктор", 47, "повна", "співпраця", "2026-10-28", "08:15"),
    new UserAppeal("Савчук", "Ірина", 27, "вища", "пропозиція", "2026-11-10", "13:50"),
    new UserAppeal("Гнатюк", "Тарас", 38, "вища", "наявність помилки на сайті", "2026-10-30", "19:05")
];

const appealManager = new AppealManager(userAppeals);

out("--- Завдання 2.1: Користувачі за 10-й місяць з часом від 12:00 ---");
out(appealManager.getUsersByMonthAndTime(10, "12:00"));

out("--- Завдання 2.2: Мінімальний вік, освіта та ім'я ---");
out(appealManager.getYoungestUserInfo());

out("--- Завдання 2.3: Класифікація за робочим/неробочим часом ---");
out(appealManager.classifyByWorkingHours());

out("--- Завдання 2.4: Сортування в алфавітному порядку з метою звернення ---");
out(appealManager.sortAlphabeticallyWithPurpose());


// ============================================================================
// ДОПОМІЖНИЙ БЛОК ДЛЯ ЗАХИСТУ (Manual_to_Lab_3.pdf, п. 4.2 - 4.4)
// ============================================================================

// Типи даних та typeof
const primString = "МедКонсалт";
const primNumber = 8;
const primBoolean = true;
const primUndefined = undefined;
const primNull = null;
const primBigInt = 9007199254740993n;
const primSymbol = Symbol("var8");
const objSample = { service: "Терапія" };
const arrSample = [1, 2, 3];

out("--- Захист: typeof примітивних та об'єктних типів ---");
out([
    typeof primString,
    typeof primNumber,
    typeof primBoolean,
    typeof primUndefined,
    typeof primNull,
    typeof primBigInt,
    typeof primSymbol,
    typeof objSample,
    Array.isArray(arrSample) ? "array (object)" : typeof arrSample
]);

// Явне перетворення типів (Number(), String(), Boolean())
const explicitNum = Number("650");
const explicitStr = String(101);
const explicitBool = Boolean(1);
out("--- Захист: явне перетворення типів ---");
out({ explicitNum, explicitStr, explicitBool });

// Арифметичні оператори (+, -, *, /, %), присвоєння (=, +=, -=), порівняння (===, !==, >)
let demoScore = 10;
demoScore += 5;
demoScore -= 3;
const arithSum = 10 + 5;
const arithMod = 10 % 3;
const arithMul = 4 * 2;
const cmpStrictEq = (8 === 8);
const cmpStrictNeq = ("8" !== 8);
const cmpGt = (15 > 10);
out("--- Захист: оператори ---");
out({ demoScore, arithSum, arithMod, arithMul, cmpStrictEq, cmpStrictNeq, cmpGt });

// Switch та цикли (while, do...while)
const modeCode = "consult";
let modeLabel = "";
switch (modeCode) {
    case "consult":
        modeLabel = "Онлайн-консультація";
        break;
    case "support":
        modeLabel = "Підтримка";
        break;
    default:
        modeLabel = "Інше";
}

let wCount = 0;
while (wCount < 2) {
    wCount++;
}

let dwCount = 0;
do {
    dwCount++;
} while (dwCount < 1);
out("--- Захист: switch, while, do...while ---");
out({ modeLabel, wCount, dwCount });

// Масив та 8+ методів (push, pop, shift, unshift, splice, slice, join, map, filter, sort)
const demoArr = ["Терапевт", "Психолог", "Педіатр"];
demoArr.push("Дієтолог");
const poppedItem = demoArr.pop();
const shiftedItem = demoArr.shift();
demoArr.unshift("Кардіолог");
const slicedPart = demoArr.slice(0, 2);
demoArr.splice(1, 0, "Невролог");
const joinedStr = demoArr.join(", ");
const filteredArr = demoArr.filter(x => x.length > 8);
out("--- Захист: методи масиву ---");
out({ poppedItem, shiftedItem, slicedPart, joinedStr, filteredArr });

// Методи Date, Math, String
const nowDate = new Date();
const dateInfo = `${nowDate.getFullYear()}-${nowDate.getMonth() + 1}-${nowDate.getDate()}`;
const mathInfo = {
    ceilVal: Math.ceil(4.2),
    roundVal: Math.round(4.6),
    maxVal: Math.max(650, 900, 450)
};
const sampleText = "  Онлайн-консультація лікаря  ";
const stringInfo = {
    trimmed: sampleText.trim(),
    upper: sampleText.trim().toUpperCase(),
    hasWord: sampleText.includes("лікаря")
};
out("--- Захист: Date, Math, String ---");
out({ dateInfo, mathInfo, stringInfo });

// Неявне перетворення типів
const implicit1 = "5" + 2;     // "52" (конкатенація рядка)
const implicit2 = "10" - 3;    // 7 (перетворення рядка до числа)
const implicit3 = !0;          // true (перетворення 0 до false та заперечення)
out("--- Захист: неявне перетворення типів ---");
out({ implicit1, implicit2, implicit3 });

// Відображення логів на сторінці, якщо скрипт запущено у браузері
if (typeof document !== "undefined") {
    const pre = document.getElementById("output");
    if (pre) {
        pre.textContent = logs.join("\n");
    }
}