import { observer } from "mobx-react";
import Question from "./Question";
import store from "../store/store";
import { useState } from 'react';

const QuestionList = observer(() => {
  let questions = store.shuffleQuestions;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  const totalPages = Math.ceil(questions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = questions.slice(startIndex, startIndex + itemsPerPage);

  function goToPage(pageNumber:number) {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="question-list">
        <div>
        {
          currentItems.map((data, index) => {
            return <Question data={data} key={data[0]} index={index} />
          })
        }
      </div>
      <div className="pagging">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          ← Назад
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            style={{ fontWeight: currentPage === i + 1 ? 'bold' : 'normal' }}
          >
            {i + 1}
          </button>
        ))}

        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Вперёд →
        </button>
      </div>
    </div>
  )
});

export default QuestionList;