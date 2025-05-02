import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('Test suite 1', () => {
  test('Should initially display the "Create homework" card', () => {
    render(<App/>);
    expect(screen.getByText("Create homework")).toBeInTheDocument();
  });

  test('Should change UI when homework is posted', () => {
    render(<App/>);

    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes.length).toBeGreaterThanOrEqual(4);
    
    fireEvent.change(textboxes[0], { target: { value: 'Test Homework' } });
    fireEvent.change(textboxes[1], { target: { value: 'Test Description' } });

    const questionInput = screen.getByPlaceholderText("Question 1");
    fireEvent.change(questionInput, { target: { value: 'Q1?' } });
    
    const correctAnswerInput = screen.getByPlaceholderText("Correct answer");
    fireEvent.change(correctAnswerInput, { target: { value: 'A1' } });
    
    const postButton = screen.getByRole('button', { name: "Post Assignment" });
    fireEvent.click(postButton);
    
    expect(screen.getByText("Test Homework")).toBeInTheDocument();
  });

  test('Should generate student sample submissions', () => {
    render(<App/>);

    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'Test Homework' } });
    fireEvent.change(textboxes[1], { target: { value: 'Test Description' } });

    const addQuestionButton = screen.getByRole('button', { name: "+ Add Question" });
    fireEvent.click(addQuestionButton);
    fireEvent.click(addQuestionButton);

    const question1 = screen.getByPlaceholderText("Question 1");
    const question2 = screen.getByPlaceholderText("Question 2");
    const question3 = screen.getByPlaceholderText("Question 3");
    fireEvent.change(question1, { target: { value: 'Q1?' } });
    fireEvent.change(question2, { target: { value: 'Q2?' } });
    fireEvent.change(question3, { target: { value: 'Q3?' } });

    const correctAnswers = screen.getAllByPlaceholderText("Correct answer");
    fireEvent.change(correctAnswers[0], { target: { value: 'A1' } });
    fireEvent.change(correctAnswers[1], { target: { value: 'A2' } });
    fireEvent.change(correctAnswers[2], { target: { value: 'A3' } });

    const spinbuttons = screen.getAllByRole('spinbutton');
    fireEvent.change(spinbuttons[1], { target: { value: '90' } });
    fireEvent.change(spinbuttons[2], { target: { value: '0' } });

    const postButton = screen.getByRole('button', { name: "Post Assignment" });
    fireEvent.click(postButton);

    expect(screen.getByText("Test Homework")).toBeInTheDocument();
    const generateButton = screen.getByRole('button', { name: "Generate Sample Submissions" });
    fireEvent.click(generateButton);

    for (let i = 1; i <= 5; ++i)
      expect(screen.getByText("Student " + i)).toBeInTheDocument();
    
    const rows = screen.getAllByRole('row');
    const submissionRow = rows[rows.length - 1];
    const cells = submissionRow.querySelectorAll("td");
    expect(cells[1].textContent).toBe("10");
    expect(cells[3].textContent).toBe("90");
    expect(cells[5].textContent).toBe("0");
  });
});