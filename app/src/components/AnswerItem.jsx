import classNames from "classnames";
import { observer } from "mobx-react";
import store from "src/store/store";

const AnswerItem = observer((props) => {
  let { question, answers, rightAnswer, subQuestions } = props.data;
  let { getData } = store;
  let showQuestions = answers.slice();
  if (subQuestions) {
    showQuestions = subQuestions.questions.map(x => `${x.name} - ${x.rightAnswer}`);
  } else {
    showQuestions = getData(answers, rightAnswer);
  }

  return (
    <div className="question pre">
      <p>{props.index+1}.{ question }</p>
      <ul>
        { showQuestions.map((answer,i) => {
            let className = classNames({
              "answer": true,
              "right-answer": rightAnswer && rightAnswer.includes(answer) || false
            });
            return <li className={className} key={answer+i}>{ answer }</li>
          })
        }
      </ul>
    </div>
  )
});

export default AnswerItem;