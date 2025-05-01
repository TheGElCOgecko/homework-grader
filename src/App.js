import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Button, Card, Form, InputGroup, Table } from 'react-bootstrap';

// Component to define homework (questions, answers, point values)
function DefineHomework({ onDefine }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', correctAnswer: '', maxPoints: 10 }
  ]);

  const addQuestion = () =>
      setQuestions([...questions, { text: '', correctAnswer: '', maxPoints: 10 }]);

  const updateQuestion = (idx, field, value) => {
    const updated = questions.map((q, i) =>
      i === idx ? { ...q, [field]: value } : q
    );
    setQuestions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onDefine({ title, description, questions });
  };

  return (
    <Card className="mt-4 mb-4">
      <Card.Header>Create homework</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </Form.Group>

          <hr/>
          <h5>Questions</h5>
          {questions.map((q, idx) => (
            <div key={idx} className="mb-4">
              <Form.Control
                as="textarea"
                rows={1}
                placeholder={`Question ${idx + 1}`}
                className="mb-2"
                value={q.text}
                onChange={e => updateQuestion(idx, 'text', e.target.value)}
                required
              />
              <Form.Control
                as="textarea"
                rows={1}
                placeholder="Correct answer"
                className="mb-2"
                value={q.correctAnswer}
                onChange={e => updateQuestion(idx, 'correctAnswer', e.target.value)}
                required
              />
              <InputGroup>
                <InputGroup.Text>Max points</InputGroup.Text>
                <Form.Control
                  type="number"
                  value={q.maxPoints}
                  onChange={e => updateQuestion(idx, 'maxPoints', Number(e.target.value))}
                  min={0}
                  required
                  style={{ maxWidth: '100px' }}
                />
              </InputGroup>
            </div>
          ))}

          <Button variant="link" onClick={addQuestion}>
            + Add Question
          </Button>
          <Button variant="primary" type="submit" className="mt-3">
            Post Assignment
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default function App() {
  const [homework, setHomework] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  // Handle teacher defining homework
  const handleDefine = (hw) => {
    setHomework(hw);
  };

  // Generate sample student submissions
  const generateSamples = () => {
    let samples = [];
    for (let i = 0; i < 5; ++i) {
        const studentName = `Student ${i + 1}`;
        const answers = homework.questions.map(q =>
            Math.random() < 0.7 ? q.correctAnswer : `[Haha, this is a wrong answer, santa is real]`
        );

        const grades = answers.map((ans, idx) => {
            const mp = homework.questions[idx].maxPoints;
            return ans === homework.questions[idx].correctAnswer ? mp : 0;
        });
        const totalScore = grades.reduce((a, b) => a + b, 0);

        const feedbacks = answers.map((ans, idx) =>
            ans === homework.questions[idx].correctAnswer
                ? ''
                : `You chose "${ans}". However, the answer is "${homework.questions[idx].correctAnswer}" because of a reason that AI can explain.`
        );

        samples.push({ studentName, answers, grades, totalScore, feedbacks });
    }
    setSubmissions(samples);
  };

  return (
    <>
      <Navbar className="fixed-top" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Homework Grader</Navbar.Brand>
        </Container>
      </Navbar>
      <Container className = "pt-5">
        {/* Determine component to load with lazy evaluation */}

        {/* Beginning screen */}
        {!homework && <DefineHomework onDefine={handleDefine} />}

        {/* Generate samples button */}
        {homework && submissions.length === 0 && (
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>{homework.title}</Card.Title>
              <Card.Text>{homework.description}</Card.Text>
              <Button onClick={generateSamples}>
                Generate Sample Submissions
              </Button>
            </Card.Body>
          </Card>
        )}
        
        {/* Generated samples */}
        {submissions.length > 0 && (
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>Student</th>
                {homework.questions.map((_, i) => (
                  <>
                    <th>Q{i + 1} Grade</th>
                    <th>Q{i + 1} Feedback</th>
                  </>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s, idx) => (
                <tr>
                  <td>{s.studentName}</td>
                  {s.grades.map((grade, i) => (
                    <>
                      <td>{grade}</td>
                      <td>{s.feedbacks[i]}</td>
                    </>
                  ))}
                  <td>{s.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
}