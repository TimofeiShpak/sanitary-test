import { observer } from "mobx-react";
import store from '../store/store';

interface SubQuestionItemProps {
  name: string,
  rightAnswer: string,
}

interface SubQuestionProps {
  titleQuestions: string,
  titleAnswers: string,
  answers: [string],
  questions: [SubQuestionItemProps]
}

export interface Data {
  answers?: [string],
  rightAnswer?: [string],
  question: string,
  isRight?: boolean,
  subQuestions?: SubQuestionProps,
  isOrder?: boolean,
}

interface QuestionProps {
  data: [string, Data],
  index: number,
}

const Question = observer((props: QuestionProps) => {
  let data = props.data[1];
  let id = props.data[0];
  let type = data.rightAnswer && data.rightAnswer.length === 1 ? 'radio' :  'checkbox';
  let { isCheck, rightAnswers, setRightAnswers } = store;
  let { isOrder, subQuestions } = data;
  let newAnswers: Array<string> = [];
  if (isOrder && subQuestions) {
    newAnswers = subQuestions.questions.map(x => x.rightAnswer).sort();
  } else if (data.answers) {
    newAnswers = data.answers.slice();
  }

  let checkIsCorrect = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (event.target instanceof HTMLElement) {
      let textElem = event.target.closest('.text_left');
      let id = null;
      if (textElem != null) {
        let questionElem = textElem.closest(".question");
        if (questionElem != null) {
          id = questionElem.id
        }
      }
      if (textElem) {
        let inputElem = textElem.querySelector('input');
        if (inputElem) {
          let isCorrect = true;
          let correct = inputElem.dataset.correct;
          if (correct === "true") {
            textElem.classList.add('right');
          } else {
            isCorrect = false;
            textElem.classList.add('wrong');
          }
          if (id != null) {
            setRightAnswers(id, isCorrect);
          }
        }
      }
    }
  }

  let onChangeSelect = (event: { target: HTMLSelectElement }, rightAnswer: string) => {
    let elem = event.target;
    let value = elem.value;
    let parent = elem.parentElement?.parentElement;
    if (isOrder && parent) {
      let children = [...parent.children];
      let number = +value;
      let questionItem = elem.parentElement;
      let index = children.findIndex(x => {
        let select = x.querySelector("select");
        if (select) {
          return select.id == elem.id
        }
      })
      if (questionItem) {
        let newSiblingElem = children[number - 1];
        if (number > index + 1) {
          newSiblingElem.after(questionItem)
        } else {
          newSiblingElem.before(questionItem)
        }
      }

      children = [...parent.children];
      let isRights:Array<HTMLSelectElement> = []
      children.forEach((node, i) => {
        if (node && parent) {
          let select = node.querySelector("select");
          if (select) {
            let selectValue = select.value;
            if (selectValue != `${i+1}`) {
              select.value = `${i+1}`
            }
            let rightAnswer = select.dataset.rightanswer
            if (rightAnswer == `${i+1}`) {
              isRights.push(select)
            } else {
              select.classList.remove('right-select');
            }
            select.classList.remove('wrong-select');
          }
          parent.appendChild(node)
        }
      });
      
      if (isRights.length == children.length) {
        isRights.forEach(x => {
          x.classList.add('right-select');
          x.classList.remove('wrong-select');
        })
      }
    }

    if (value == rightAnswer) {
      elem.classList.add('right-select');
      elem.classList.remove('wrong-select');
    } else {
      elem.classList.add('wrong-select');
      elem.classList.remove('right-select');
    }
  }

  return (
    <form data-id={id} id={id} className="question">
    <p className="pre">{ `${props.index + 1}. ${data.question}` }</p>
    { isCheck && data.rightAnswer ? (
        !rightAnswers[id] ? (
            <div className="wrong">
              Ошибка! Правильный ответ: 
              {[...data.rightAnswer].map((answer) => <p key={answer+id}>{answer}</p>)} 
            </div>
          ) : (
            <p className="right">Правильно!</p>
        )
      ) : ( data.rightAnswer &&
        <div className="guess">
          <div className="guess__title">Подсказка</div>
          <div className="guess__answers">
            {[...data.rightAnswer].map((answer) => <p className="guess__text" key={answer+id}>{answer}</p>)} 
          </div>
        </div>
      )
    }
    <div>
      { subQuestions && 
        (
          <div>
            <div>
              { isCheck && (
                  !rightAnswers[id] ? (
                    <div className="wrong">
                      Ошибка! 
                    </div>
                  ) : (
                    <p className="right">Правильно!</p>
                  )
                )
              }
            </div>
            <div className="subQuestions">
              <div>
                { subQuestions.titleQuestions &&
                  <div>{subQuestions.titleQuestions}</div>
                }
                {
                  subQuestions.questions.map((x,i) => {
                    return <div className="subQuestions-item" key={x.name+i}>
                      <div>{x.name}</div>
                      <select onChange={(e) => onChangeSelect(e, x.rightAnswer)} id={x.name} name={id} data-rightanswer={x.rightAnswer}>
                        <option value="" hidden={!!isOrder}></option>
                        {
                          newAnswers.map((answer, index) => {
                            return <option value={answer} key={answer+index}>{index+1}</option>
                          })
                        }
                      </select>
                    </div>
                  })
                }
              </div>
              { subQuestions.titleAnswers &&
                <div>
                  <div>{subQuestions.titleAnswers}</div>
                  {
                    newAnswers.map((answer, index) => {
                      return <div className="subQuestions-item" key={answer+index}>{index+1} {answer}</div>
                    })
                  }
                </div>
              }
            </div>
          </div>
        ) || newAnswers.length > 0 &&
        ( 
          newAnswers.map((answer,i) => {
            let correct = !!(data.rightAnswer && data.rightAnswer.includes(answer))
            return (
              <div className="text_left" key={answer+i} onClick={checkIsCorrect}>
                <input type={type} name={id} value={answer} id={answer+id} data-correct={correct} />
                <label htmlFor={answer+id}>{answer}</label>
              </div>
            )
          })
        ) || (
          <div className="text_left">
            <input type="text" name={id} autoComplete="off"/>
          </div>
        )
      }
    </div>
  </form>
  )
});

export default Question;