import React, { useState, useEffect } from "react";

export const Footer = ({ shopMenu, policiesMenu }) => {
    const [stylesLoaded, setStylesLoaded] = useState(false);

    useEffect(() => {
        const loadStyles = async () => {
            await import('../styles/Footer.css');
            setStylesLoaded(true);
        };
        loadStyles();
    }, []);

    if (!stylesLoaded) {
        return null; // or return a loading spinner if desired
    }

    return (
      <footer className="footer">
        <div className="container">
          <div className="footer-sections">
            {/* Shop Menu */}
            <div className="footer-column">
              <h3>Shop</h3>
              <ul>
                {shopMenu.map((item, index) => (
                  <li key={index}>
                    <a href={item.link}>{item.title}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies Menu */}
            <div className="footer-column">
              <h3>Policies</h3>
              <ul>
                {policiesMenu.map((item, index) => (
                  <li key={index}>
                    <a href={item.link}>{item.title}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div className="footer-column">
              <h3>Customer Service</h3>
              <ul className="contact-info">
                <li>
                  <i className="fas fa-map-marker-alt">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"
                    >
                      <path d="M168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2H168.3zM192 256C227.3 256 256 227.3 256 192C256 156.7 227.3 128 192 128C156.7 128 128 156.7 128 192C128 227.3 156.7 256 192 256z"></path>
                    </svg>
                  </i>{' '}
                  <a
                    href="https://maps.app.goo.gl/iW7qXAw4j5fZFGxK8"
                    target="_blank"
                    title="971Souq Store Location"
                  >
                    971 Souq FZE, Business Centre, Sharjah Publishing City Free
                    Zone, Sharjah, United Arab Emirates
                  </a>
                </li>
                {/* <li>
                  <i className="fas fa-phone-alt">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="phone-alt"
                      role="img"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="currentColor"
                        d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"
                      ></path>
                    </svg>
                  </i>{' '}
                  <a href="tel:+9611888031">+961 1 888 031</a>
                </li> */}
                <li>
                  <i className="fab fa-whatsapp">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                    </svg>
                  </i>{' '}
                  <a href="https://wa.me/971504659971" target="_blank">
                    +971 50 465 9971
                  </a>
                </li>
                <li>
                  <i className="fas fa-envelope">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="envelope"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="currentColor"
                        d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"
                      ></path>
                    </svg>
                  </i>{' '}
                  <a href="mailto:admin@971souq.ae" target="_blank">
                    admin@971souq.ae
                  </a>
                </li>
              </ul>
              {/* Social Media Links */}
              <div className="social-links">
                <a href="https://www.facebook.com/macarabiame" target="_blank">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    role="presentation"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                  >
                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
                  </svg>
                </a>
                <a href="https://instagram.com/macarabia.me" target="_blank">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512"
                    xmlSpace="preserve"
                    aria-hidden="true"
                    focusable="false"
                    role="presentation"
                  >
                    <g>
                      <path d="M256,152c-57.9,0-105,47.1-105,105s47.1,105,105,105s105-47.1,105-105S313.9,152,256,152z M256,152   c-57.9,0-105,47.1-105,105s47.1,105,105,105s105-47.1,105-105S313.9,152,256,152z M437,0H75C33.6,0,0,33.6,0,75v362   c0,41.4,33.6,75,75,75h362c41.4,0,75-33.6,75-75V75C512,33.6,478.4,0,437,0z M256,392c-74.399,0-135-60.601-135-135   c0-74.401,60.601-135,135-135s135,60.599,135,135C391,331.399,330.399,392,256,392z M421,122c-16.5,0-30-13.5-30-30s13.5-30,30-30   s30,13.5,30,30S437.5,122,421,122z M256,152c-57.9,0-105,47.1-105,105s47.1,105,105,105s105-47.1,105-105S313.9,152,256,152z    M256,152c-57.9,0-105,47.1-105,105s47.1,105,105,105s105-47.1,105-105S313.9,152,256,152z M256,152c-57.9,0-105,47.1-105,105   s47.1,105,105,105s105-47.1,105-105S313.9,152,256,152z"></path>
                    </g>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>© 2025, 971souq.ae All rights reserved.</p>
          <div>
            <svg
              className="icon icon--full-color"
              viewBox="0 0 38 24"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              width="38"
              height="24"
              aria-labelledby="pi-visa"
            >
              <title id="pi-visa">Visa</title>
              <path
                opacity=".07"
                d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
              ></path>
              <path
                fill="#fff"
                d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
              ></path>
              <path
                d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z"
                fill="#142688"
              ></path>
            </svg>
            <svg
              className="icon icon--full-color"
              viewBox="0 0 38 24"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              width="38"
              height="24"
              aria-labelledby="pi-master"
            >
              <title id="pi-master">Mastercard</title>
              <path
                opacity=".07"
                d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
              ></path>
              <path
                fill="#fff"
                d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
              ></path>
              <circle fill="#EB001B" cx="15" cy="12" r="7"></circle>
              <circle fill="#F79E1B" cx="23" cy="12" r="7"></circle>
              <path
                fill="#FF5F00"
                d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"
              ></path>
            </svg>
          </div>
        </div>
      </footer>
    );
};