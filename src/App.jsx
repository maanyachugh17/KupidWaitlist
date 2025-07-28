import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      setMessage('Please fill in both fields.');
      return;
    }

    const digits = formData.phone.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15) {
      setMessage('Please enter a valid phone number.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbxzV4rU-y0EsVwRr_0tSozAaBfjvNdQr87NrA8gRGZ3YiYDq-u-A731egGtUdHnxmHw/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          timestamp: new Date().toISOString(),
          submission_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })
      });

      // Since mode: 'no-cors' doesn't return response data, we'll assume success
      setMessage('Successfully added to waitlist!');
      setFormData({ name: '', phone: '' });
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isPaused) {
    return (
      <div className="App">
        <div className="container">
          <h1>Kupid Waitlist</h1>
          <p>Waitlist temporarily paused. Please check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="container">
        <h1>Join the Kupid Waitlist</h1>
        <p>Be the first to know when we launch!</p>
        
        <form onSubmit={handleSubmit} className="waitlist-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your phone number"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={isSubmitting ? 'submitting' : ''}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Joining...
              </>
            ) : (
              'Join Waitlist'
            )}
          </button>
        </form>
        
        {message && (
          <div className={`message ${message.includes('Successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
