import React from 'react';
import '../styles/Contact.css';

export const meta = () => {
  return [{title: 'Contact Us | Hydrogen Storefront'}];
};

export default function ContactUs() {
  return (
    <div className="contact-us-page">
      <h1>Contact Us</h1>
      <p>
        We’d love to hear from you! Feel free to reach out to us for any
        inquiries, feedback, or support.
      </p>
      <div className="contact-info">
        <h3>Contact Information:</h3>
        <a href="mailto:admin@971souq.ae" target="_blank">
          <strong>Email:</strong> admin@971souq.ae
        </a>
        {/* <p>
            <strong>Phone:</strong> <a href="tel:+9611888031">+961 1 888 031</a>
          </p> */}
        <p>
          <strong>Whatsapp:</strong>
          <a href="https://wa.me/971504659971">+971 50 465 9971</a>
        </p>
        <p>
          <strong>Address:</strong>
          <a
            href="https://maps.app.goo.gl/iW7qXAw4j5fZFGxK8"
            target="_blank"
            title="971 Souq Store Location"
          >
            971 Souq FZE, Business Centre, Sharjah Publishing City Free Zone,
            Sharjah, United Arab Emirates
          </a>
        </p>
      </div>
      <form className="contact-form">
        <h3>Send Us a Message</h3>
        <label>
          Name:
          <input type="text" name="name" required />
        </label>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <label>
          Message:
          <textarea name="message" rows="5" required></textarea>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
