'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './HomePage.css';

export default function HomePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    day: '',
    month: '',
    year: '',
    time: '',
    city: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting to save data...");

    // التحقق من صحة البيانات
    if (!formData.name || !formData.day || !formData.month || !formData.year) {
      alert('Please fill in all required fields!');
      return;
    }

    try {
      const { collection, addDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      // حفظ البيانات في Firestore
      await addDoc(collection(db, "users"), {
        ...formData,
        createdAt: new Date()
      });
      console.log("Data saved successfully!");

      // حفظ البيانات في localStorage
      localStorage.setItem('astroUserData', JSON.stringify(formData));

      // الانتقال لشاشة العرافة
      router.push('/ceremony');
    } catch (error) {
      console.error("Firebase Error:", error);
      alert("Error saving data. Check console for details.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="pixel-registration">
      {/* خلفية بكسل آرت */}
      <div className="pixel-bg"></div>

      {/* النجوم المتحركة */}
      <div className="pixel-stars"></div>

      {/* الحاوية الرئيسية */}
      <div className="registration-container">
        {/* العنوان */}
        <div className="pixel-title">
          <h1>🪐 ASTRO QUEST</h1>
          <p className="subtitle">Begin your journey into the stars...</p>
        </div>

        {/* بطاقة التسجيل */}
        <div className="pixel-card">
          <form onSubmit={handleSubmit} className="pixel-form">

            {/* اسم المسافر */}
            <div className="form-group">
              <label className="pixel-label">TRAVELER'S NAME</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name..."
                value={formData.name}
                onChange={handleChange}
                className="pixel-input"
                required
              />
            </div>

            {/* تاريخ الميلاد */}
            <div className="form-group">
              <label className="pixel-label">DATE OF BIRTH</label>
              <div className="date-inputs">
                <div className="date-group">
                  <span className="date-label">DAY</span>
                  <input
                    type="number"
                    name="day"
                    placeholder="DD"
                    min="1"
                    max="31"
                    value={formData.day}
                    onChange={handleChange}
                    className="pixel-input date-input"
                    required
                  />
                </div>
                <div className="date-group">
                  <span className="date-label">MONTH</span>
                  <input
                    type="number"
                    name="month"
                    placeholder="MM"
                    min="1"
                    max="12"
                    value={formData.month}
                    onChange={handleChange}
                    className="pixel-input date-input"
                    required
                  />
                </div>
                <div className="date-group">
                  <span className="date-label">YEAR</span>
                  <input
                    type="number"
                    name="year"
                    placeholder="YYYY"
                    min="1900"
                    max="2024"
                    value={formData.year}
                    onChange={handleChange}
                    className="pixel-input date-input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* الوقت والمكان */}
            <div className="form-row">
              <div className="form-group">
                <label className="pixel-label">BIRTH TIME</label>
                <input
                  type="text"
                  name="time"
                  placeholder="HH:MM"
                  value={formData.time}
                  onChange={handleChange}
                  className="pixel-input"
                />
              </div>

              <div className="form-group">
                <label className="pixel-label">CITY</label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="pixel-input"
                />
              </div>
            </div>

            {/* زر الإرسال */}
            <button type="submit" className="pixel-button">
              <span className="button-text">CONSULT THE STARS</span>
              <span className="button-glow"></span>
            </button>

            {/* تفاصيل صغيرة */}
            <div className="pixel-footer">
              <div className="pixel-line"></div>
              <p className="footer-text">Your cosmic journey awaits...</p>
              <div className="pixel-line"></div>
            </div>
          </form>
        </div>

        {/* عناصر زخرفية */}
        <div className="pixel-decoration">
          <div className="pixel-planet"></div>
          <div className="pixel-satellite"></div>
          <div className="pixel-comet"></div>
        </div>
      </div>
    </div>
  );
}
