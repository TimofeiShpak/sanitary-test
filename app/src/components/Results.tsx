import { observer } from "mobx-react";
import store from "../store/store";

const Results = observer(() => {
  let { isCheck, isShowResults, score, numberQuestions, scrollToAnswer, changeVisibleResults } = store;

  return (
    <div>
      { isCheck &&
        <div>
          <button onClick={changeVisibleResults}>
            { isShowResults ? 'Скрыть неправильные ответы' : 'Показать неправильные ответы' }
          </button>
          { isShowResults &&
            <div>
              <p>Ваши баллы: {`${score} : ${numberQuestions}`}</p>
              <span>Процент правильных ответов {`${(score/numberQuestions * 100).toFixed(1)}`}%</span>
            </div>
          }
        </div>
      }
    </div>
  )
});

export default Results;