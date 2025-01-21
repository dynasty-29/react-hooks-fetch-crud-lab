import React, { useState, useEffect } from "react";
import QuestionItem from "./QuestionItem";
import QuestionForm from "./QuestionForm";

function QuestionList() {
  const [questions, setQuestions] = useState([]);

  // Fetch questions on load
  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((response) => response.json())
      .then((data) => setQuestions(data));
  }, []);

  // Add a new question
  const addQuestion = (newQuestion) => {
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion),
    })
      .then((response) => response.json())
      .then((savedQuestion) => setQuestions((prev) => [...prev, savedQuestion]));
  };

  // Delete a question
  const deleteQuestion = (id) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    }).then(() => {
      setQuestions((prev) => prev.filter((question) => question.id !== id));
    });
  };

  // Update a question's correct answer
  const updateQuestion = (id, updatedData) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((updatedQuestion) => {
        setQuestions((prev) =>
          prev.map((question) =>
            question.id === id ? updatedQuestion : question
          )
        );
      });
  };

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            onDelete={deleteQuestion}
            onUpdate={updateQuestion}
          />
        ))}
      </ul>
      <QuestionForm onAddQuestion={addQuestion} />
    </section>
  );
}

export default QuestionList;
