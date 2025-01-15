import React from "react";

export default function LayoutControls({ numberInRow, screenWidth, handleLayoutChange }) {
    return (
        <div className="layout-controls">
              <span className='number-sort'>View As:</span>
              {screenWidth >= 300 && (
                <button
                  className={`layout-buttons first-btn ${numberInRow === 1 ? 'active' : ''}`}
                  onClick={() => handleLayoutChange(1)}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z" fill="#808080"></path> <path d="M2 12C2 11.4477 2.44772 11 3 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H3C2.44772 13 2 12.5523 2 12Z" fill="#808080"></path> <path d="M3 17C2.44772 17 2 17.4477 2 18C2 18.5523 2.44772 19 3 19H21C21.5523 19 22 18.5523 22 18C22 17.4477 21.5523 17 21 17H3Z" fill="#808080"></path> </g></svg>
                </button>
              )}
              {screenWidth >= 300 && (
                <button
                  className={`layout-buttons ${numberInRow === 2 ? 'active' : ''}`}
                  onClick={() => handleLayoutChange(2)}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#808080"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Line_L"> <path id="Vector" d="M12 19V5" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#808080"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Line_L"> <path id="Vector" d="M12 19V5" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                </button>
              )}
              {screenWidth >= 550 && (
                <button
                  className={`layout-buttons ${numberInRow === 3 ? 'active' : ''}`}
                  onClick={() => handleLayoutChange(3)}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#808080"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Line_L"> <path id="Vector" d="M12 19V5" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#808080"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Line_L"> <path id="Vector" d="M12 19V5" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#808080"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Line_L"> <path id="Vector" d="M12 19V5" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                </button>
              )}
              {screenWidth >= 1200 && (
                <button
                  className={`layout-buttons ${numberInRow === 4 ? 'active' : ''}`}
                  onClick={() => handleLayoutChange(4)}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#808080"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Line_L"> <path id="Vector" d="M12 19V5" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#808080"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Line_L"> <path id="Vector" d="M12 19V5" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#808080"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Line_L"> <path id="Vector" d="M12 19V5" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#808080"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Line_L"> <path id="Vector" d="M12 19V5" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                </button>
              )}
              {screenWidth >= 1500 && (
                <button
                  className={`layout-buttons ${numberInRow === 5 ? 'active' : ''}`}
                  onClick={() => handleLayoutChange(5)}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#808080"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Line_L"> <path id="Vector" d="M12 19V5" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#808080"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Line_L"> <path id="Vector" d="M12 19V5" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#808080"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Line_L"> <path id="Vector" d="M12 19V5" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#808080"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Line_L"> <path id="Vector" d="M12 19V5" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#808080"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Line_L"> <path id="Vector" d="M12 19V5" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                </button>
              )}
            </div>
    );
}
