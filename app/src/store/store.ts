import { makeAutoObservable } from "mobx";
import { electroPrivods } from "./electorPrivodsData";
import { TAU } from "./TAU";
import { anatomy } from "./anatomy";
import { gistology } from './gistology';
import { clinika } from './clinika';
import { sanitary } from './sanitary';
import { biochimiya } from './biochimiya';
import { microBiology } from './microBiology';
import { microBiologyWord } from './microBiologyWord';
import { gos } from './gos';

interface Object {
  [key: string]: any;
}

interface Link {
  id: string,
  index: number,
}

// let answers = (text: String) => text.split(/[aбвгдАБВГBb6]\./).slice(1).map(x => x.replace(/;/g, '').replace(/\n/g, ' ').trim())
// let questions = (text: String) => {
//   let obj = {} as any;
//   text.split(/\d\d\./)
//   .slice(1)
//   .map(q => q.split(/[aбвгдАБВГBb6erежз]\./).map(x => x.replace(/;/g, '').replace(/\n/g, ' ').trim()))
//   .map((i, index) => {
//       let rI = i.findIndex(x => x.includes("V"));
//       i = i.map(x => x.replace('V', '').trim());
//       let r = rI !== -1 && i[rI + 1] || '';
//       let q = i[0];
//       obj[index+195] = {
//           "question": q,
//           "rightAnswer": [r],
//           "answers": i.slice(1)
//       }
//   })
//   const json = JSON.stringify(obj, null, 4);
//   navigator.clipboard.writeText(json.slice(1, -1))
//   return json.slice(1, -1)
// }

// function createObj(str) {
//   let newObj = {};
//   let values = str.split(/(а\)|б\)|в\)|г\))/g).filter(x => x !== 'а)' && x !== 'б)' && x !== 'в)' && x !== 'г)').map(x => x.replaceAll(/(\t|\n)/g, '').trim());
//   newObj.question = values[0];
//   newObj.rightAnswer = [values[1]];
//   newObj.answers = values.slice(1);
//   return newObj;
// }

// o = {};
// s.split(/\d{1,3}\./g).map((x,i) => createObj(x)).filter(x => !!x.question).map((x,i) => o[i+1] = x)

let allQuestions = Object.entries(gos);
let objects: Object = {};
for (let i = 0; i < allQuestions.length - 100; i += 100) {
  let key = `gos${i}`
  let isActive = i == 0;
  let endNumber = i + 100;
  if (allQuestions.length - i < 200) {
    endNumber = allQuestions.length;
  }
  objects[key] = {
    value: isActive,
    title: `Гос экзамен ${i+1}-${endNumber}`,
    data: Object.fromEntries(allQuestions.slice(i, endNumber))
  }
}

const defaultNumberQuestions = 100;

class Store {
  testName = '';
  questions: Object = {};
  dataQuestions: [string, any][] = [];
  showQuestions: [string, any][] = [];
  shuffleQuestions:Array<any> = [];
  score = 0;
  isCheck = false;
  isStart = false;
  isProgramScroll = true;
  isCanSelect = false;
  time = { hours: '00', seconds: '00', minutes: '00' };
  numberQuestions = defaultNumberQuestions;
  isShowResults = false;
  date = new Date();
  rightAnswers: Object = {};
  options: Object = {
    'rightAnswer': { value: true, title: 'правильные ответы' },
    'answers': { value: true, title: 'неправильные ответы' }
  }
  searchText = '';
  typeQuestions: Object = {
    // 'anatomy': { value: false, title: 'Анатомия и физиология человека', data: anatomy },
    // 'electroPrivods': { value: false, title: 'Электроприводы', data: electroPrivods },
    // 'TAU': { value: false, title: 'ТАУ', data: TAU },
    // gistology: { value: true, title: 'Гистологические исследования', data: gistology },
    // clinika: { value: false, title: 'Общеклинические исследования', data: clinika },
    // sanitary: { value: true, title: 'Санитарное дело', data: sanitary },
    // biochimiya: { value: false, title: 'Биохимия выбор определенных вопросов', data: biochimiya, 
    //   isCanSelect: true },

    ...objects,
    gos: { value: false, title: 'Гос экзамен выбор определенных вопросов', data: gos, 
      isCanSelect: true },
  };
  questionText = '';
  rangeNumberQuestions: Object = {
    "start": 1,
    "end": defaultNumberQuestions
  };
  keyTest = "";
  maxNumberQuestions = defaultNumberQuestions;

  constructor() {
    makeAutoObservable(this);
    this.changeMode = this.changeMode.bind(this);
    this.start = this.start.bind(this);
    this.scrollToAnswer = this.scrollToAnswer.bind(this);
    this.exit = this.exit.bind(this);
    this.changeNumberQuestions = this.changeNumberQuestions.bind(this);
    this.changeVisibleResults = this.changeVisibleResults.bind(this);
    this.changeOption = this.changeOption.bind(this);
    this.changeSearchText = this.changeSearchText.bind(this);
    this.getData = this.getData.bind(this);
    this.changeTest = this.changeTest.bind(this);
    this.search = this.search.bind(this);
    this.check = this.check.bind(this);
    this.changeRangeNumberQuestions = this.changeRangeNumberQuestions.bind(this);
    this.changeSelectedQuestions = this.changeSelectedQuestions.bind(this);
    this.changeTest(Object.keys(objects)[0], true);
    this.setRightAnswers = this.setRightAnswers.bind(this);
  }

  scrollToAnswer(event: React.MouseEvent<HTMLElement, MouseEvent>) {
    let questionListElement = document.querySelector(".question-list");
    if (event.target instanceof HTMLElement) {
      let elem = event.target;
      if (document.documentElement.clientHeight < 700) {
        this.isShowResults = false;
      }
      if (elem.tagName === 'SPAN') {
        let answer = document.getElementById(`${elem.dataset.id}`);
        let top = answer?.offsetTop || 50;
        questionListElement?.scrollTo(0, top - 50);
      }
    }
  }

  shuffle(array: Array<any>) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  newOrderQuestions() {
    this.shuffleQuestions = this.shuffle(this.dataQuestions);
    this.shuffleQuestions = this.shuffleQuestions.slice(0, this.numberQuestions).map((data) => { 
      data[1].answers = this.shuffle(data[1].answers);
      if (data[1].subQuestions) {
        data[1].subQuestions.questions = this.shuffle(data[1].subQuestions.questions);
      }
      return data;
    });
  }

  changeMode() {
    this.isCheck = !this.isCheck;
    if (this.isCheck) {
      this.check();
    } else {
      let inputs = document.querySelectorAll('input');
      inputs.forEach((input) => { 
        input.checked = false; 
        input.value = ''; 
        input.classList.remove("right");
        input.classList.remove("wrong");
      });
      let selects = document.querySelectorAll('select');
      selects.forEach(x => {
        x.value = ''
        x.classList.remove("right-select");
        x.classList.remove("wrong-select");
      });
      this.start();
    }
  }

  checkEqual(rightAnswer: Array<string>, selectAnswer: string) {
    let isRight = false;
    if (selectAnswer.length > 2) {
      isRight = !!rightAnswer.find((answer) => {
        return answer.toLowerCase().slice(0, -2) === selectAnswer.toLowerCase().trim().slice(0, answer.length - 2)
      });
    } else {
      isRight = !!rightAnswer.find((answer) => answer.toLowerCase() === selectAnswer.toLowerCase().trim());
    }
    return isRight ? 1 : 0;
  }

  setRightAnswers(id: string, value: Boolean) {
    let oldValue = this.rightAnswers[id];
    if (oldValue == undefined || oldValue == null || oldValue == true) {
      this.rightAnswers[id] = value;
    } 
  }

  check() {
    this.score = 0;
    this.isShowResults = true;
    this.score = Object.values(this.rightAnswers).filter(x => !!x).length  
  }

  start() {
    this.isStart = true;
    this.rightAnswers = {}
    this.date = new Date();
    this.time = { hours: '00', seconds: '00', minutes: '00' };
    this.timer();
    this.newOrderQuestions();
  }

  exit() {
    this.isStart = false;
    this.isCheck = false;
    this.time = { hours: '00', seconds: '00', minutes: '00' };
  }

  changeTime() {
    let currentTime = new Date();
    let newTime = new Date(+currentTime - +this.date);
    this.time = {
      seconds: `0${newTime.getSeconds()}`.slice(-2),
      minutes: `0${newTime.getMinutes()}`.slice(-2),
      hours: `0${newTime.getUTCHours()}`.slice(-2),
    }
  }

  timer() {
    let interval = setInterval(() => {
      if (!this.isCheck && this.isStart) { 
        this.changeTime();
      } else {
        clearInterval(interval);
      }
    }, 1000)
  }

  changeNumberQuestions(event: { target: HTMLInputElement }) {
    this.numberQuestions = +event.target.value
    if (event.target.value) {
      let checkedValue = Math.max(1, Math.min(+event.target.value, this.dataQuestions.length));
      this.numberQuestions = checkedValue;
      if (this.rangeNumberQuestions.start < 1) {
        this.rangeNumberQuestions.start = 1
      }
      this.rangeNumberQuestions.end = this.rangeNumberQuestions.start + checkedValue - 1;
    }
  }

  changeVisibleResults() {
    this.isShowResults = !this.isShowResults;
  }

  getId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
        return v.toString(16);
    });
  }

  changeOption(title: string, value: boolean) {
    this.options[title].value = value;
  }

  changeSelectedQuestions(questions: Object) {
    let { start, end } = this.rangeNumberQuestions
    this.dataQuestions = Object.entries(questions).slice(start - 1, end);
    this.questions = Object.fromEntries(this.dataQuestions);
    this.showQuestions = this.dataQuestions.slice();
  }

  changeTest(title: string, value: boolean) {
    Object.keys(this.typeQuestions).forEach((key) => {
      this.typeQuestions[key].value = false;
    });
    this.typeQuestions[title].value = value;
    let questions = this.typeQuestions[title].data;
    this.maxNumberQuestions = Object.entries(questions).length;

    this.rangeNumberQuestions.end = this.maxNumberQuestions;
    this.rangeNumberQuestions.start = 1;
    this.changeSelectedQuestions(questions);
    this.numberQuestions = this.dataQuestions.length;

    this.testName = this.typeQuestions[title].title;
    this.isCanSelect = this.typeQuestions[title].isCanSelect || false;
    this.newOrderQuestions();
    this.keyTest = title;
  }

  changeWidthInput(elem: HTMLInputElement) {
    elem.style.width = '200px';
    let width = Math.min(elem.scrollWidth, document.documentElement.clientWidth / 2);
    elem.style.width = width + 'px';
  }

  search(text: string) {
    this.showQuestions = this.dataQuestions.filter((data) => data[1].question.toLowerCase().includes(text));
  }

  changeSearchText(event: { target: HTMLInputElement }) {
    let elem = event.target;
    this.searchText = elem.value;
    this.changeWidthInput(elem);
    this.search(elem.value.toLowerCase());
  }

  changeRangeNumberQuestions(event: { target: HTMLInputElement }, type: string) {
    let elem = event.target;
    let value = +elem.value;
    if (type != null && value > 0) {
      if (this.maxNumberQuestions >= value) {
        this.rangeNumberQuestions[type] = value;
        let { start, end } = this.rangeNumberQuestions;
        if (start > 0 && end > 0) {
          this.numberQuestions = end - start + 1;
        }
        let questions = this.typeQuestions[this.keyTest].data;
        this.changeSelectedQuestions(questions);
      }
    } else {
      this.rangeNumberQuestions[type] = "";
    }
  }

  getData(answers: string[], rightAnswer: string[]) {
    answers = answers.length > 0 ? answers : rightAnswer;
    if (!this.options.rightAnswer.value) {
      answers = answers.filter((value) => !rightAnswer.includes(value));
    }
    if (!this.options.answers.value) {
      answers = answers.filter((value) => rightAnswer.includes(value));
    }
    return answers;
  }
}

const store = new Store();

export default store;