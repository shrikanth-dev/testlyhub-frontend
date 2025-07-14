import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CreateTest.css';

const CreateTest = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '0',
    price: 0,
  });

  const [isMCQ, setIsMCQ] = useState(false);
  const [questionsText, setQuestionsText] = useState('');
  const [solutionsText, setSolutionsText] = useState('');

  const [mcqList, setMcqList] = useState([
    { question: '', options: '', correct: '' },
  ]);

  const handleMCQChange = (index, field, value) => {
    const updated = [...mcqList];
    updated[index][field] = value;
    setMcqList(updated);
  };

  const addMCQ = () => {
    setMcqList([...mcqList, { question: '', options: '', correct: '' }]);
  };

  const removeMCQ = (index) => {
    const updated = mcqList.filter((_, i) => i !== index);
    setMcqList(updated);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      let questionsArray = [];
      let solutionsArray = [];

      if (isMCQ) {
        mcqList.forEach((mcq) => {
          const options = mcq.options.split(',').map(opt => opt.trim());
          questionsArray.push({
            question: mcq.question,
            options: options,
          });
          solutionsArray.push(mcq.correct.trim());
        });
      } else {
        questionsArray = questionsText.split('\n').map(q => q.trim()).filter(Boolean);
        solutionsArray = solutionsText.split('\n').map(s => s.trim()).filter(Boolean);
      }

await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/tests/create`, {
          title: formData.title,
          description: formData.description,
          questions: questionsArray,
          solutions: solutionsArray,
          duration: parseInt(formData.duration, 10),
          price: parseFloat(formData.price),
          type: isMCQ ? 'mcq' : 'input', 
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Test created successfully!');

      setFormData({
        title: '',
        description: '',
        duration: '0',
        price: 0,
      });
      setQuestionsText('');
      setSolutionsText('');
      setMcqList([{ question: '', options: '', correct: '' }]);
    } catch (err) {
      console.error('Create Test Error:', err);
      alert('Failed to create test.');
    }
  };

  return (
    <div className="create-test-container">
      <div className="create-test-card">
        <h2>📝 Create a New Test</h2>

        <div className="toggle-type">
          <button
            className={isMCQ ? 'secondary-button' : 'primary-button'}
            onClick={() => setIsMCQ(false)}
          >
            Input-Based
          </button>
          <button
            className={isMCQ ? 'primary-button' : 'secondary-button'}
            onClick={() => setIsMCQ(true)}
          >
            MCQ-Based
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-test-form">
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          {isMCQ ? (
            <div className="mcq-section">
              {mcqList.map((mcq, index) => (
                <div key={index} className="mcq-item">
                  <input
                    type="text"
                    placeholder={`Question ${index + 1}`}
                    value={mcq.question}
                    onChange={(e) => handleMCQChange(index, 'question', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Options (comma separated)"
                    value={mcq.options}
                    onChange={(e) => handleMCQChange(index, 'options', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Correct Answer"
                    value={mcq.correct}
                    onChange={(e) => handleMCQChange(index, 'correct', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeMCQ(index)}
                    className="remove-button"
                    disabled={mcqList.length === 1}
                  >
                    ❌ Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addMCQ} className="secondary-button">
                ➕ Add Another MCQ
              </button>
            </div>
          ) : (
            <>
              <textarea
                name="questionsText"
                placeholder="Enter questions (one per line)"
                value={questionsText}
                onChange={(e) => setQuestionsText(e.target.value)}
                required
              />
              <textarea
                name="solutionsText"
                placeholder="Enter solutions (one per line, matching questions)"
                value={solutionsText}
                onChange={(e) => setSolutionsText(e.target.value)}
                required
              />
            </>
          )}
          <input
            type="number"
            name="duration"
            placeholder="Duration (minutes)"
            value={formData.duration}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <button type="submit">✅ Create Test</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTest;

